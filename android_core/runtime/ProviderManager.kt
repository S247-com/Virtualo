package com.virtualo.core.runtime

import android.content.ContentProvider
import android.content.pm.PackageInfo
import android.content.pm.ProviderInfo
import android.util.Log
import com.virtualo.core.models.VirtualPackage
import java.util.concurrent.ConcurrentHashMap

/**
 * ProviderManager
 * Manages the installation and lifecycle of virtual ContentProviders.
 */
object ProviderManager {
    private const val TAG = "ProviderManager"
    
    // Map of PackageName to Guest Provider instances
    private val guestProviders = ConcurrentHashMap<String, ContentProvider>()

    fun getProvider(packageName: String): ContentProvider? = guestProviders[packageName]

    /**
     * Initializes and installs ContentProviders for a guest app.
     * CRITICAL: This must happen BEFORE Application.onCreate()
     */
    fun installProviders(info: PackageInfo, vPkg: VirtualPackage) {
        val classLoader = vPkg.classLoader ?: return
        
        info.providers?.forEach { providerInfo ->
            try {
                val providerClass = classLoader.loadClass(providerInfo.name)
                val provider = providerClass.newInstance() as ContentProvider
                
                // In a production framework, we would use reflection to call 
                // ContentProvider.attachInfo() which initializes the provider.
                // provider.attachInfo(context, providerInfo)
                
                guestProviders[vPkg.packageName] = provider
                Log.i(TAG, "Installed Virtual Provider: ${providerInfo.authority}")
                
            } catch (e: Exception) {
                Log.e(TAG, "Failed to install provider ${providerInfo.name}: ${e.message}")
            }
        }
    }
}
