package com.virtualo.core.runtime

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log

/**
 * StubService
 * Host service that proxies lifecycle events to virtualized services.
 */
class StubService : Service() {
    private const val TAG = "StubService"
    private var guestService: Service? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val targetService = intent?.getStringExtra("TARGET_SERVICE")
        val pkgName = intent?.getStringExtra("PKG_NAME")
        
        if (targetService != null && pkgName != null) {
            try {
                val vPkg = VirtualRuntime.getPackage(pkgName)
                if (vPkg != null) {
                    val serviceClass = vPkg.classLoader!!.loadClass(targetService)
                    guestService = serviceClass.newInstance() as Service
                    
                    // In a full implementation, we would call attach() on guestService
                    // For now, we just log and simulate start
                    Log.i(TAG, "Proxying service: $targetService")
                    guestService?.onStartCommand(intent, flags, startId)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to proxy service: ${e.message}")
            }
        }
        
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onDestroy() {
        guestService?.onDestroy()
        super.onDestroy()
    }
}
