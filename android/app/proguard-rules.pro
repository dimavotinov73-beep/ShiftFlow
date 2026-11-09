# Методы моста, которые вызывает JavaScript (window.AndroidApp.*), не должны переименовываться.
-keepclassmembers class io.shiftflow.app.MainActivity$Bridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
