package com.roklinn.virtualo.core.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.roklinn.virtualo.R
import com.roklinn.virtualo.core.CloneRegistry

/**
 * HomeAdapter
 * Displays currently installed clones on the main dashboard.
 */
class HomeAdapter(
    private var clones: List<CloneRegistry.CloneMeta>,
    private val onAppClick: (CloneRegistry.CloneMeta) -> Unit
) : RecyclerView.Adapter<HomeAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val name: TextView = view.findViewById(R.id.clone_name)
        val pkg: TextView = view.findViewById(R.id.clone_pkg)
        val iconPlaceholder: View = view.findViewById(R.id.clone_icon_bg)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_home_clone, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val clone = clones[position]
        holder.name.text = clone.name
        holder.pkg.text = clone.packageName
        holder.itemView.setOnClickListener { onAppClick(clone) }
    }

    override fun getItemCount() = clones.size

    fun updateData(newClones: List<CloneRegistry.CloneMeta>) {
        this.clones = newClones
        notifyDataSetChanged()
    }
}
