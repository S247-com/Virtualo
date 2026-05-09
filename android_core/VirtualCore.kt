package com.roklinn.virtualo.core

import android.content.Context
import android.util.Log
import com.roklinn.virtualo.core.pm.PackageParser
import java.io.File

/**
 * VirtualO Core Engine
 * Responsible for initializing the sandbox environment.
 */
object VirtualCore {
    private const val TAG = "VirtualCore"
    private lateinit var context: Context
    lateinit var virtualRoot: File
    lateinit var registry: CloneRegistry

    fun init(ctx: Context) {
        this.context = ctx.applicationContext
        this.virtualRoot = File(context.filesDir, "virtual/apps")
        this.registry = CloneRegistry(context)
        
        if (!virtualRoot.exists()) {
            virtualRoot.mkdirs()
        }

        // Inject low-level hooks
        com.roklinn.virtualo.core.runtime.HookManager.injectInstrumentation()
        
        Log.d(TAG, "VirtualO Initialized: ${virtualRoot.absolutePath}")
    }

    fun getContext(): Context = context

    /**
     * Starts a virtual service through the proxy layer.
     */
    fun startVirtualService(guestIntent: android.content.Intent) {
        ComponentManager.startService(context, guestIntent)
    }

    /**
     * Loads a virtual package into the runtime environment.
     */
    fun loadPackage(pkgName: String, apkPath: String, launcher: String) {
        if (!VirtualRuntime.isLoaded(pkgName)) {
            val resources = VirtualContext.createGuestResources(context, apkPath)
            val vPkg = com.roklinn.virtualo.core.models.VirtualPackage(
                pkgName, apkPath, launcher, null, resources
            )
            VirtualRuntime.registerPackage(vPkg)
        }
    }

    /**
     * Installs a clone.
     */
    suspend fun installClone(app: AppScanManager.AppInfo, onProgress: (Int) -> Unit = {}): Boolean {
        if (registry.isInstalled(app.packageName)) {
            Log.w(TAG, "App already installed: ${app.packageName}")
            return true 
        }

        val appDir = File(virtualRoot, app.packageName)
        val success = ApkInstaller.install(app.apkPath, appDir, onProgress)
        
        if (success) {
            registry.registerApp(CloneRegistry.CloneMeta(
                packageName = app.packageName,
                name = app.name,
                version = app.version,
                installTime = System.currentTimeMillis(),
                apkPath = File(appDir, "base.apk").absolutePath
            ))
        }
        
        return success
    }
}
