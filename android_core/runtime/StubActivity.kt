package com.virtualo.core.runtime

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.res.Resources
import android.content.res.AssetManager
import android.os.Bundle
import android.util.Log
import com.virtualo.core.container.VirtualContext
import com.virtualo.core.models.VirtualPackage
import dalvik.system.DexClassLoader
import java.io.File

/**
 * StubActivity
 * Acts as a placeholder in the host manifest. 
 * The actual guest activity instantiation is handled by VirtualInstrumentation.newActivity.
 */
class StubActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // If we reach here, it means the Instrumentation hook failed to swap the instance
        Log.e("VirtualO", "StubActivity execution: Instrumentation failed to swap instance!")
        finish()
    }
}
