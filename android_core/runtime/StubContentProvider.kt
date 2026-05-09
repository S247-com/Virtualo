package com.virtualo.core.runtime

import android.content.*
import android.database.Cursor
import android.net.Uri
import android.util.Log

/**
 * StubContentProvider
 * Host provider that routes requests to virtualized guest providers.
 */
class StubContentProvider : ContentProvider() {
    private const val TAG = "StubContentProvider"

    /**
     * Authority of this stub provider.
     * Manifest entries should point to this.
     */
    companion object {
        const val STUB_AUTHORITY = "com.virtualo.core.stub_provider"
    }

    override fun onCreate(): Boolean {
        Log.d(TAG, "StubContentProvider Created")
        return true
    }

    private fun resolveGuestUr(uri: Uri): Pair<String, Uri>? {
        // Expected format: content://com.virtualo.core.stub_provider/com.guest.pkg/path
        val segments = uri.pathSegments
        if (segments.isEmpty()) return null
        
        val guestPackage = segments[0]
        val guestPath = segments.drop(1).joinToString("/")
        val guestUri = Uri.parse("content://$guestPackage/$guestPath")
        
        return guestPackage to guestUri
    }

    override fun query(
        uri: Uri, projection: Array<String>?, selection: String?,
        selectionArgs: Array<String>?, sortOrder: String?
    ): Cursor? {
        val (pkg, guestUri) = resolveGuestUr(uri) ?: return null
        val guestProvider = ProviderManager.getProvider(pkg) ?: return null
        return guestProvider.query(guestUri, projection, selection, selectionArgs, sortOrder)
    }

    override fun getType(uri: Uri): String? {
        val (pkg, guestUri) = resolveGuestUr(uri) ?: return null
        val guestProvider = ProviderManager.getProvider(pkg) ?: return null
        return guestProvider.getType(guestUri)
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        val (pkg, guestUri) = resolveGuestUr(uri) ?: return null
        val guestProvider = ProviderManager.getProvider(pkg) ?: return null
        return guestProvider.insert(guestUri, values)
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
        val (pkg, guestUri) = resolveGuestUr(uri) ?: return null
        val guestProvider = ProviderManager.getProvider(pkg) ?: return null
        return guestProvider.delete(guestUri, selection, selectionArgs)
    }

    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<String>?): Int {
        val (pkg, guestUri) = resolveGuestUr(uri) ?: return null
        val guestProvider = ProviderManager.getProvider(pkg) ?: return null
        return guestProvider.update(guestUri, values, selection, selectionArgs)
    }
}
