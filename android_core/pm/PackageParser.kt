package com.virtualo.core.pm

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.util.Log

/**
 * PackageParser
 * Extracts metadata, icons, and entry points from APK files.
 */
class PackageParser(private val context: Context) {

    fun parse(apkPath: String): PackageInfo? {
        return try {
            // Android 14+ public API for parsing APK archives
            context.packageManager.getPackageArchiveInfo(
                apkPath,
                PackageManager.GET_ACTIVITIES or 
                PackageManager.GET_SERVICES or 
                PackageManager.GET_RECEIVERS or
                PackageManager.GET_PROVIDERS or
                PackageManager.GET_META_DATA
            )
        } catch (e: Exception) {
            Log.e("PackageParser", "Failed to parse APK: ${e.message}")
            null
        }
    }

    fun getLauncherActivity(info: PackageInfo): String? {
        // 1. Check for activity with MAIN and LAUNCHER intent filters
        // In a real framework, we'd parse the XML directly, 
        // but getPackageArchiveInfo provides activity info.
        val launcher = info.activities?.find { activity ->
            // Heuristic for MVP: most apps name their launcher "MainActivity" or "Launcher"
            // or it's simply the first activity defined.
            activity.name.contains("Launcher", ignoreCase = true) || 
            activity.name.contains("Main", ignoreCase = true)
        }
        
        return launcher?.name ?: info.activities?.firstOrNull()?.name
    }
}
