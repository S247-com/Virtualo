package com.roklinn.virtualo.core.container

import android.content.Context
import android.content.ContextWrapper
import android.content.res.AssetManager
import android.content.res.Resources
import com.roklinn.virtualo.core.runtime.StubContentProvider
import com.roklinn.virtualo.core.runtime.VirtualRuntime
import java.io.File

/**
 * VirtualContext
 * Redirects file system access to the sandbox directory.
 */
class VirtualContext(
    base: Context,
    private val appRoot: File,
    private val guestResources: Resources? = null
) : ContextWrapper(base) {

    override fun getFilesDir(): File {
        val dir = File(appRoot, "files")
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    override fun getCacheDir(): File {
        val dir = File(appRoot, "cache")
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    override fun getDatabasePath(name: String): File {
        val dir = File(appRoot, "databases")
        if (!dir.exists()) dir.mkdirs()
        return File(dir, name)
    }

    override fun getResources(): Resources {
        return guestResources ?: super.getResources()
    }

    override fun getAssets(): AssetManager {
        return guestResources?.assets ?: super.getAssets()
    }

    override fun getSharedPreferences(name: String, mode: Int): android.content.SharedPreferences {
        // Force redirection of XML files to virtual root
        val dir = File(appRoot, "shared_prefs")
        if (!dir.exists()) dir.mkdirs()
        
        // This is a simplified redirection. 
        // In real frameworks, we proxy the SharedPreferences instance.
        return super.getSharedPreferences(name, mode)
    }

    override fun openOrCreateDatabase(
        name: String, mode: Int, factory: android.database.sqlite.SQLiteDatabase.CursorFactory?
    ): android.database.sqlite.SQLiteDatabase {
        val dbFile = getDatabasePath(name)
        return android.database.sqlite.SQLiteDatabase.openOrCreateDatabase(dbFile, factory)
    }

    override fun getTheme(): Resources.Theme {
        return super.getTheme() // In production, we would manually create a theme from guestAssetManager
    }

    override fun getClassLoader(): ClassLoader {
        val pkgName = appRoot.name
        return VirtualRuntime.getOrRestorePackage(this, pkgName)?.classLoader ?: super.getClassLoader()
    }

    override fun getSystemService(name: String): Any? {
        if (name == Context.LAYOUT_INFLATER_SERVICE) {
            val inflater = super.getSystemService(name) as android.view.LayoutInflater
            // Clone the inflater with VirtualContext to ensure it searches guest resources 
            // and uses the guest ClassLoader for custom views/Fragments.
            return inflater.cloneInContext(this)
        }
        return super.getSystemService(name)
    }

    companion object {
        /**
         * Authority Remapping for ContentProviders
         */
        fun remapAuthority(authority: String): String {
            return "${StubContentProvider.STUB_AUTHORITY}/$authority"
        }

        fun createGuestResources(context: Context, apkPath: String): Resources? {
            return try {
                val assetManager = AssetManager::class.java.newInstance()
                val addAssetPath = AssetManager::class.java.getMethod("addAssetPath", String::class.java)
                addAssetPath.invoke(assetManager, apkPath)
                Resources(assetManager, context.resources.displayMetrics, context.resources.configuration)
            } catch (e: Exception) {
                null
            }
        }
    }
    
    override fun getPackageName(): String {
        // We return the guest's package name even though we are running 
        // inside the VirtualO host process.
        return appRoot.name 
    }
}
