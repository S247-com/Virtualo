package com.roklinn.virtualo.core

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

/**
 * CloneRegistry
 * Persists the list of cloned apps to private storage.
 */
class CloneRegistry(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("v_clone_registry", Context.MODE_PRIVATE)

    data class CloneMeta(
        val packageName: String,
        val name: String,
        val version: String,
        val installTime: Long,
        val apkPath: String
    )

    fun registerApp(meta: CloneMeta) {
        val apps = getRegisteredApps().toMutableList()
        // Remove existing if duplicate
        apps.removeAll { it.packageName == meta.packageName }
        apps.add(meta)
        saveApps(apps)
    }

    fun getRegisteredApps(): List<CloneMeta> {
        val data = prefs.getString("cloned_apps", "[]") ?: "[]"
        val array = JSONArray(data)
        val list = mutableListOf<CloneMeta>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(CloneMeta(
                obj.getString("pkg"),
                obj.getString("name"),
                obj.getString("ver"),
                obj.getLong("time"),
                obj.getString("path")
            ))
        }
        return list
    }

    private fun saveApps(apps: List<CloneMeta>) {
        val array = JSONArray()
        apps.forEach {
            val obj = JSONObject()
            obj.put("pkg", it.packageName)
            obj.put("name", it.name)
            obj.put("ver", it.version)
            obj.put("time", it.installTime)
            obj.put("path", it.apkPath)
            array.put(obj)
        }
        prefs.edit().putString("cloned_apps", array.toString()).apply()
    }
    
    fun isInstalled(packageName: String): Boolean {
        return getRegisteredApps().any { it.packageName == packageName }
    }
}
