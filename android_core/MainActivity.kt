package com.virtualo.app

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.virtualo.core.AppScanManager
import com.virtualo.core.VirtualCore
import com.virtualo.core.pm.PackageParser
import com.virtualo.core.runtime.StubActivity
import com.virtualo.core.ui.AppListAdapter
import com.virtualo.core.ui.HomeAdapter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private lateinit var appAdapter: AppListAdapter
    private lateinit var homeAdapter: HomeAdapter
    private lateinit var progressBar: ProgressBar
    private lateinit var progressText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        VirtualCore.init(this)

        setupUI()
        loadInstalledApps()
        refreshHome()
    }

    private fun setupUI() {
        progressBar = findViewById(R.id.install_progress)
        progressText = findViewById(R.id.progress_text)
        
        // 1. Setup Cloner Recycler
        val clonerRecycler = findViewById<RecyclerView>(R.id.app_recycler)
        clonerRecycler.layoutManager = LinearLayoutManager(this)
        appAdapter = AppListAdapter(emptyList()) { selectedApp -> initiateClone(selectedApp) }
        clonerRecycler.adapter = appAdapter

        // 2. Setup Home Recycler
        val homeRecycler = findViewById<RecyclerView>(R.id.home_recycler)
        homeRecycler.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        homeAdapter = HomeAdapter(emptyList()) { clone -> launchApp(clone.packageName) }
        homeRecycler.adapter = homeAdapter

        // 3. Setup Refresh Button
        findViewById<ImageButton>(R.id.btn_refresh).setOnClickListener {
            loadInstalledApps()
            Toast.makeText(this, "Ilovalar ro'yxati yangilanmoqda...", Toast.LENGTH_SHORT).show()
        }
    }

    private fun refreshHome() {
        val registered = VirtualCore.registry.getRegisteredApps()
        homeAdapter.updateData(registered)
    }

    private fun loadInstalledApps() {
        lifecycleScope.launch {
            val progressLabel = findViewById<TextView>(R.id.list_label)
            progressLabel.text = "Ilovalar qidirilmoqda..."
            
            val scanner = AppScanManager(this@MainActivity)
            val apps = withContext(Dispatchers.IO) { scanner.getInstalledApps() }
            
            appAdapter.updateList(apps)
            progressLabel.text = "O'rnatilgan ilovalar (${apps.size})"
            
            if (apps.isEmpty()) {
                Toast.makeText(this@MainActivity, "Hech qanday ilova topilmadi. Ruxsatlarni tekshiring.", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun initiateClone(app: AppScanManager.AppInfo) {
        lifecycleScope.launch {
            progressBar.visibility = View.VISIBLE
            progressText.visibility = View.VISIBLE
            
            val success = VirtualCore.installClone(app) { progress ->
                lifecycleScope.launch(Dispatchers.Main) {
                    progressBar.progress = progress
                    progressText.text = "Cloning ${app.name}: $progress%"
                }
            }

            if (success) {
                Toast.makeText(this@MainActivity, "Clone Success!", Toast.LENGTH_SHORT).show()
                refreshHome()
            }
            
            progressBar.visibility = View.GONE
            progressText.visibility = View.GONE
        }
    }

    private fun launchApp(packageName: String) {
        val meta = VirtualCore.registry.getRegisteredApps().find { it.packageName == packageName } ?: return
        
        val parser = PackageParser(this)
        val info = parser.parse(meta.apkPath) ?: return
        val launcher = parser.getLauncherActivity(info) ?: return

        val intent = Intent(this, StubActivity::class.java).apply {
            putExtra("TARGET_ACTIVITY", launcher)
            putExtra("APK_PATH", meta.apkPath)
            putExtra("PKG_NAME", meta.packageName)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }
}
