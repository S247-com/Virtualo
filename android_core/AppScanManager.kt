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
        val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
        
        return apps.filter { 
            if (includeSystem) true 
            else (it.flags and ApplicationInfo.FLAG_SYSTEM) == 0 
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
                    size = "${sizeInMb}MB"
                )
            } catch (e: Exception) {
                null
            }
        }
    }
}
