package com.roklinn.virtualo.core

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream

/**
 * ApkInstaller
 * Handles the physical copying of APKs into the virtual container.
 */
object ApkInstaller {
    private const val TAG = "ApkInstaller"

    suspend fun install(sourcePath: String, targetDir: File, onProgress: (Int) -> Unit): Boolean = withContext(Dispatchers.IO) {
        try {
            if (!targetDir.exists()) targetDir.mkdirs()
            val targetFile = File(targetDir, "base.apk")
            
            val sourceFile = File(sourcePath)
            val totalSize = sourceFile.length()
            var bytesCopied = 0L

            FileInputStream(sourceFile).use { input ->
                FileOutputStream(targetFile).use { output ->
                    val buffer = ByteArray(8192)
                    var bytes = input.read(buffer)
                    while (bytes >= 0) {
                        output.write(buffer, 0, bytes)
                        bytesCopied += bytes
                        val progress = ((bytesCopied * 100) / totalSize).toInt()
                        onProgress(progress)
                        bytes = input.read(buffer)
                    }
                }
            }
            Log.d(TAG, "Install success: ${targetFile.absolutePath}")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Install failed: ${e.message}")
            false
        }
    }
}
