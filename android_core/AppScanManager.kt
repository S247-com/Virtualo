package com.virtualo.core

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable
import java.io.File

/**
 * AppScanManager
 * Scans the host system for installed applications to be cloned.
 */
class AppScanManager(private val context: Context) {

    data class AppInfo(
        val name: String,
        val packageName: String,
        val icon: Drawable,
        val apkPath: String,
        val version: String,
        val size: String
    )

    fun getInstalledApps(includeSystem: Boolean = false): List<AppInfo> {
        val pm = context.packageManager
        // GET_INSTALLED_APPLICATIONS o'rniga GET_META_DATA bilan barcha paketlarni olamiz
        val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
        
        Log.d("AppScan", "Jami topilgan ilovalar: ${apps.size}")

        return apps.filter { appInfo ->
            val isSystem = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
            val isUpdatedSystem = (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
            
            // Agar foydalanuvchi tizim ilovalarini xohlamasa, faqat user ilovalarni qoldiramiz
            if (includeSystem) true 
            else (!isSystem || isUpdatedSystem)
        }.filter { 
            // O'zimizni (host appni) ro'yxatdan olib tashlaymiz
            it.packageName != context.packageName 
        }.mapNotNull { appInfo ->
            try {
                val packageInfo = pm.getPackageInfo(appInfo.packageName, 0)
                val file = File(appInfo.sourceDir)
                val sizeInMb = file.length() / (1024 * 1024)
                
                AppInfo(
                    name = appInfo.loadLabel(pm).toString(),
                    packageName = appInfo.packageName,
                    icon = appInfo.loadIcon(pm),
                    apkPath = appInfo.sourceDir,
                    version = packageInfo.versionName ?: "1.0",
                    size = if (sizeInMb > 0) "${sizeInMb}MB" else "<1MB"
                )
            } catch (e: Exception) {
                null
            }
        }.sortedBy { it.name.lowercase() } // Alifbo bo'yicha saralash
    }
}
