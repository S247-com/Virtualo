package com.virtualo.core.runtime

import android.app.Activity
import android.app.Instrumentation
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import com.virtualo.core.container.VirtualContext
import com.virtualo.core.models.VirtualPackage

/**
 * VirtualInstrumentation
 * The heart of the virtualization engine. Intercepts activity lifecycle
 * and performs intent re-routing (Stub -> Guest).
 */
class VirtualInstrumentation(private val base: Instrumentation) : Instrumentation() {

    /**
     * Intercepts intent starting to swap Guest -> Stub
     */
    fun execStartActivity(
        who: Context?, contextThread: IBinder?, token: IBinder?,
        target: Activity?, intent: Intent?, requestCode: Int, options: Bundle?
    ): ActivityResult? {
        Log.d("VirtualO", "execStartActivity: ${intent?.component?.className}")

        // Check if destination is a Guest Activity
        val targetClass = intent?.component?.className
        val pkgName = intent?.component?.packageName ?: ""
        
        val vPkg = VirtualRuntime.getPackage(pkgName)
        if (vPkg != null && targetClass != null) {
            // Re-route to our StubActivity and store original intent
            intent?.apply {
                component = android.content.ComponentName(who?.packageName ?: "", "com.virtualo.core.runtime.StubActivity")
                putExtra("TARGET_ACTIVITY", targetClass)
                putExtra("PKG_NAME", pkgName)
                putExtra("APK_PATH", vPkg.apkPath)
            }
        }
        
        return try {
            val execMethod = Instrumentation::class.java.getDeclaredMethod(
                "execStartActivity",
                Context::class.java, IBinder::class.java, IBinder::class.java,
                Activity::class.java, Intent::class.java, Int::class.java, Bundle::class.java
            )
            execMethod.isAccessible = true
            execMethod.invoke(base, who, contextThread, token, target, intent, requestCode, options) as ActivityResult?
        } catch (e: Exception) {
            Log.e("VirtualO", "execStartActivity failure: ${e.message}")
            null
        }
    }

    /**
     * Intercepts activity instantiation to swap Stub -> Guest
     */
    override fun newActivity(cl: ClassLoader?, className: String?, intent: Intent?): Activity {
        val targetActivity = intent?.getStringExtra("TARGET_ACTIVITY")
        val pkgName = intent?.getStringExtra("PKG_NAME")

        if (targetActivity != null && pkgName != null) {
            // Restore environment if process was recreated
            val vPkg = VirtualRuntime.getOrRestorePackage(VirtualCore.getContext(), pkgName)
            if (vPkg != null && vPkg.classLoader != null) {
                Log.i("VirtualO", "Instrumentation: Instantiating Guest $targetActivity")
                return vPkg.classLoader!!.loadClass(targetActivity).newInstance() as Activity
            }
        }
        
        return base.newActivity(cl, className, intent)
    }

    override fun callActivityOnCreate(activity: Activity?, icicle: Bundle?) {
        if (activity != null && isGuestActivity(activity)) {
            val pkgName = activity.intent.getStringExtra("PKG_NAME") ?: ""
            val vPkg = VirtualRuntime.getOrRestorePackage(activity, pkgName)
            
            if (vPkg != null) {
                Log.d("VirtualO", "Instrumentation: Patching Guest Activity Context: ${activity.javaClass.name}")
                
                // 1. Ensure Application is ready
                val guestApp = AppInitializer.initApplication(activity, vPkg)
                
                // 2. Inject VirtualContext (Sandboxed FS + Guest Resources)
                val appRoot = java.io.File(activity.filesDir, "virtual/apps/$pkgName")
                val virtualContext = VirtualContext(activity, appRoot, vPkg.resources)
                
                try {
                    // Patch mBase in ContextWrapper
                    val baseField = android.content.ContextWrapper::class.java.getDeclaredField("mBase")
                    baseField.isAccessible = true
                    baseField.set(activity, virtualContext)

                    // Patch mApplication in Activity
                    val appField = Activity::class.java.getDeclaredField("mApplication")
                    appField.isAccessible = true
                    appField.set(activity, guestApp)

                    // 3. FORCE GUEST THEME (Prevent AppCompat Crash)
                    activity.setTheme(android.R.style.Theme_DeviceDefault)
                    
                } catch (e: Exception) {
                    Log.e("VirtualO", "Failed to patch guest activity: ${e.message}")
                }
            }
        }
        base.callActivityOnCreate(activity, icicle)
    }

    private fun isGuestActivity(activity: Activity): Boolean {
        // Simplified check: If it's loaded by a DexClassLoader, it's likely ours
        return activity.javaClass.classLoader is dalvik.system.DexClassLoader
    }
}
