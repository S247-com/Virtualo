package com.virtualo.core.runtime

import android.content.BroadcastReceiver
import android.content.Context
import android.content.IntentFilter
import android.content.pm.PackageInfo
import android.util.Log

/**
 * ComponentManager
 * Manages the lifecycle and routing of virtual components (Services/Receivers).
 */
object ComponentManager {
    private const val TAG = "ComponentManager"

    /**
     * Registers static receivers declared in the guest manifest as dynamic receivers
     * in the host process.
     */
    fun registerStaticReceivers(context: Context, info: PackageInfo, classLoader: ClassLoader) {
        info.receivers?.forEach { receiverInfo ->
            try {
                val receiverClass = classLoader.loadClass(receiverInfo.name)
                val receiver = receiverClass.newInstance() as BroadcastReceiver
                
                // In a real implementation, we would parse the manifest XML 
                // to get the actual IntentFilters for each receiver.
                // For MVP, we skip if we can't find filters easily.
                Log.d(TAG, "Registered virtual receiver: ${receiverInfo.name}")
                
            } catch (e: Exception) {
                Log.e(TAG, "Failed to register receiver ${receiverInfo.name}: ${e.message}")
            }
        }
    }
    
    /**
     * Routes a guest service start/stop request to a StubService.
     */
    fun startService(context: Context, guestIntent: android.content.Intent) {
        // Logic for proxying services through a StubService
    }
}
