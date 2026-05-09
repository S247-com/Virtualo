package com.roklinn.virtualo.core.runtime

import android.app.Instrumentation
import android.util.Log

/**
 * HookManager
 * Handles low-level reflection hooks to swap system components.
 */
object HookManager {
    private const val TAG = "HookManager"

    fun injectInstrumentation() {
        try {
            // Android 14+ precaution: hidden API unsealing would normally go here
            // using native bypass or 'meta-reflection'.
            
            val activityThreadClass = Class.forName("android.app.ActivityThread")
            val currentActivityThreadMethod = activityThreadClass.getDeclaredMethod("currentActivityThread")
            currentActivityThreadMethod.isAccessible = true
            val activityThread = currentActivityThreadMethod.invoke(null) ?: return

            val instrumentationField = activityThreadClass.getDeclaredFields().find { it.name == "mInstrumentation" }
            instrumentationField?.let {
                it.isAccessible = true
                val base = it.get(activityThread) as Instrumentation
                if (base !is VirtualInstrumentation) {
                    it.set(activityThread, VirtualInstrumentation(base))
                    Log.i(TAG, "VirtualInstrumentation Hooked Successfully")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Critical Hook Failure: ${e.message}")
        }
    }
}
