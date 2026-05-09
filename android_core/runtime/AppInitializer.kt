package com.virtualo.core.runtime

import android.app.Application
import android.content.Context
import android.content.ContextWrapper
import android.util.Log
import com.virtualo.core.container.VirtualContext
import com.virtualo.core.models.VirtualPackage

/**
 * AppInitializer
 * Responsible for creating and calling 'onCreate' on the guest Application.
 */
object AppInitializer {
    private const val TAG = "AppInitializer"

    fun initApplication(context: Context, vPkg: VirtualPackage): Application? {
        val existing = VirtualRuntime.getApplication(vPkg.packageName)
        if (existing != null) return existing

        try {
            val classLoader = vPkg.classLoader ?: return null
            
            // 1. Load Application class (default to android.app.Application if none specified)
            // Note: PackageInfo doesn't explicitly store the <application android:name="...">
            // unless we parse the manifest deeply. For MVP, we use default or heuristics.
            val appClassName = "android.app.Application" 
            val appClass = classLoader.loadClass(appClassName)
            val guestApp = appClass.newInstance() as Application

            // 2. Prepare VirtualContext
            val appRoot = java.io.File(context.filesDir, "virtual/apps/${vPkg.packageName}")
            val virtualContext = VirtualContext(context, appRoot, vPkg.resources)

            // 3. Attach base context
            val attachMethod = ContextWrapper::class.java.getDeclaredMethod("attachBaseContext", Context::class.java)
            attachMethod.isAccessible = true
            attachMethod.invoke(guestApp, virtualContext)

            // 4. Install Providers (MUST be before Application.onCreate)
            // Note: In MVP we don't have the full PackageInfo here, 
            // but in production we would pass it.
            // ProviderManager.installProviders(info, vPkg)

            // 5. Call onCreate
            guestApp.onCreate()
            
            VirtualRuntime.setApplication(vPkg.packageName, guestApp)
            Log.i(TAG, "Virtual Application Initialized: ${vPkg.packageName}")
            return guestApp
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to init Virtual Application: ${e.message}")
            return null
        }
    }
}
