package com.virtualo.core.runtime

import android.app.Application
import android.util.Log
import com.virtualo.core.models.VirtualPackage
import java.util.concurrent.ConcurrentHashMap

/**
 * VirtualRuntime
 * Manages the state of virtualized processes and application instances.
 */
object VirtualRuntime {
    private const val TAG = "VirtualRuntime"
    
    private val loadedPackages = ConcurrentHashMap<String, VirtualPackage>()
    private val guestApplications = ConcurrentHashMap<String, Application>()

    fun getOrRestorePackage(context: Context, packageName: String): VirtualPackage? {
        // 1. Check memory cache
        loadedPackages[packageName]?.let { return it }

        // 2. Attempt restoration from Registry
        val registry = CloneRegistry(context)
        val meta = registry.getRegisteredApps().find { it.packageName == packageName } ?: return null

        Log.i(TAG, "Restoring dead package: $packageName")
        
        // Build the virtual package
        val resources = VirtualContext.createGuestResources(context, meta.apkPath)
        val dexDir = File(context.cacheDir, "dex_opt_${packageName}")
        if (!dexDir.exists()) dexDir.mkdirs()

        // Multi-Dex support is native in DexClassLoader for Android 10+
        val classLoader = DexClassLoader(
            meta.apkPath,
            dexDir.absolutePath,
            null,
            ClassLoader.getSystemClassLoader().parent
        )

        val vPkg = VirtualPackage(packageName, meta.apkPath, "", classLoader, resources)
        registerPackage(vPkg)
        return vPkg
    }

    fun registerPackage(pkg: VirtualPackage) {
        loadedPackages[pkg.packageName] = pkg
    }

    fun getApplication(packageName: String): Application? = guestApplications[packageName]

    fun setApplication(packageName: String, app: Application) {
        guestApplications[packageName] = app
    }

    fun isLoaded(packageName: String): Boolean = loadedPackages.containsKey(packageName)
}
