package com.virtualo.core.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.virtualo.app.R
import com.virtualo.core.AppScanManager

/**
 * AppListAdapter
 * Displays the list of host apps available for cloning.
 */
class AppListAdapter(
    private var apps: List<AppScanManager.AppInfo>,
    private val onCloneClick: (AppScanManager.AppInfo) -> Unit
) : RecyclerView.Adapter<AppListAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val icon: ImageView = view.findViewById(R.id.app_icon)
        val name: TextView = view.findViewById(R.id.app_name)
        val meta: TextView = view.findViewById(R.id.app_meta)
        val btnClone: View = view.findViewById(R.id.btn_clone)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_app_list, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val app = apps[position]
        holder.icon.setImageDrawable(app.icon)
        holder.name.text = app.name
        holder.meta.text = "${app.version} • ${app.size}"
        holder.btnClone.setOnClickListener { onCloneClick(app) }
    }

    override fun getItemCount() = apps.size

    fun updateList(newApps: List<AppScanManager.AppInfo>) {
        this.apps = newApps
        notifyDataSetChanged()
    }
}
