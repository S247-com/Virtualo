package com.virtualo.core.runtime

import android.util.Log

/**
 * CrashPreventionManager
 * Detects and mitigates common virtualization crashes.
 */
object CrashPreventionManager {
    private const val TAG = "CrashPrevention"

    fun setupGlobalExceptionHandler() {
        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            if (isVirtualCrash(throwable)) {
                Log.e(TAG, "VirtualO Recoverable Crash Detected: ${throwable.message}")
                // In a production app, we would silently finish the activity or show a clean error UI
            }
            defaultHandler?.uncaughtException(thread, throwable)
        }
    }

    private fun isVirtualCrash(t: Throwable): Boolean {
        val stackTrace = Log.getStackTraceString(t)
        return stackTrace.contains("com.virtualo") || 
               stackTrace.contains("Resources\$NotFoundException") ||
               stackTrace.contains("Theme.AppCompat")
    }
}
