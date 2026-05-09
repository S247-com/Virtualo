# VirtualO Android MVP

## 🚀 How to Run
1. Open **Android Studio**.
2. Create a new **Empty Activity** project with package `com.virtualo.app`.
3. Copy the contents of `/android_core` into your `app/src/main/kotlin` folder.
4. Update your `AndroidManifest.xml` with the provided snippet.
5. Build and Run on **Android 14 (API 34)** emulator or device.

## 🛠 Features Implemented
- **App Scanning**: Detects non-system apps on the host.
- **APK Redirection**: Copies APKs to a private sandbox directory.
- **Context Virtualization**: Rewrites `filesDir` and `cacheDir` to prevent guest apps from reading host data.
- **Activity Proxy**: Uses a `StubActivity` to launch guest activities that aren't in the system manifest.

## ⚠️ Important for Production
To make this "production-grade":
1. **Unseal Hidden APIs**: Use a library like `FreeReflection` or a native bypass to allow calling `Activity.attach()`.
2. **Native Hooking**: For apps using Native Libraries (`.so` files), you will need an `I/O Hook` (using PLT hooking or Substrate) to redirect `open()`, `stat()`, and `access()` calls at the C level.
3. **Instrumentation**: For full life-cycle sync, replace the `mInstrumentation` field in `ActivityThread` with a virtual one.

---
*Created by VirtualO Engine Team*
