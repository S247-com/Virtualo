package com.roklinn.virtualo.core.models

import android.content.res.Resources
import dalvik.system.DexClassLoader

/**
 * VirtualPackage
 * Represents a loaded virtual application instance in memory.
 */
data class VirtualPackage(
    val packageName: String,
    val apkPath: String,
    val launcherActivity: String,
    var classLoader: DexClassLoader? = null,
    var resources: Resources? = null
)
