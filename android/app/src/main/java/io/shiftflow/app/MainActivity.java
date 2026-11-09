package io.shiftflow.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * ShiftFlow: оболочка над веб-интерфейсом из assets/www.
 *
 * Интерфейс загружается с https://appassets.androidplatform.net/www/ — это зарезервированный
 * для локальных файлов адрес: все запросы к нему обслуживаются из APK, а любые другие
 * запросы WebView блокируются, поэтому приложение работает без сети и ничего не отправляет.
 *
 * Мост window.AndroidApp: saveFile, setStatusBar, setCanGoBack, haptic.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/www/index.html";
    private static final int REQ_SAVE = 41;
    private static final int REQ_OPEN = 42;

    private static final Map<String, String> MIME = new HashMap<>();
    static {
        MIME.put("html", "text/html");
        MIME.put("js", "text/javascript");
        MIME.put("css", "text/css");
        MIME.put("json", "application/json");
        MIME.put("webmanifest", "application/manifest+json");
        MIME.put("svg", "image/svg+xml");
        MIME.put("png", "image/png");
        MIME.put("jpg", "image/jpeg");
        MIME.put("webp", "image/webp");
        MIME.put("ico", "image/x-icon");
        MIME.put("woff2", "font/woff2");
        MIME.put("txt", "text/plain");
    }

    private final Handler main = new Handler(Looper.getMainLooper());
    private FrameLayout root;
    private WebView web;
    private boolean canGoBack = false;
    private boolean lightUi = false;
    private boolean pageReady = false;
    private int[] insetsDp = {0, 0, 0, 0};

    private byte[] pendingBytes;
    private ValueCallback<Uri[]> fileCallback;
    private Object backCallback; // OnBackInvokedCallback (API 33+)
    private boolean backRegistered = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        lightUi = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) != Configuration.UI_MODE_NIGHT_YES;

        root = new FrameLayout(this);
        web = new WebView(this);
        web.setBackgroundColor(lightUi ? 0xFFF3F5F4 : 0xFF08090B);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        root.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        setupWindow();

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= 26) s.setSafeBrowsingEnabled(false); // нет внешних страниц — нечего проверять

        web.addJavascriptInterface(new Bridge(), "AndroidApp");
        web.setWebViewClient(new LocalClient());
        web.setWebChromeClient(new ChromeClient());

        if (Build.VERSION.SDK_INT >= 33) {
            backCallback = (OnBackInvokedCallback) this::dispatchBackToPage;
        }

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        if (web.getUrl() == null) web.loadUrl(START_URL);
    }

    // ───────────── Окно: от края до края, системные отступы → CSS ─────────────

    private void setupWindow() {
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
            w.setStatusBarColor(Color.TRANSPARENT);
            w.setNavigationBarColor(Color.TRANSPARENT);
            w.setNavigationBarContrastEnforced(false);
            w.setStatusBarContrastEnforced(false);
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                Insets ime = insets.getInsets(WindowInsets.Type.ime());
                boolean imeVisible = ime.bottom > 0;
                // Клавиатура: сжимаем область WebView, чтобы поле ввода оставалось видимым.
                v.setPadding(0, 0, 0, imeVisible ? ime.bottom : 0);
                float d = getResources().getDisplayMetrics().density;
                insetsDp = new int[]{
                        Math.round(bars.top / d),
                        Math.round(bars.right / d),
                        imeVisible ? 0 : Math.round(bars.bottom / d),
                        Math.round(bars.left / d)
                };
                pushInsets();
                return WindowInsets.CONSUMED;
            });
        } else {
            // Android 7–10: обычная раскладка без «от края до края», цвета панелей совпадают с фоном.
            applyBarColors();
        }
        applyBarAppearance();
    }

    private void applyBarColors() {
        if (Build.VERSION.SDK_INT >= 30) return;
        int bg = lightUi ? 0xFFF3F5F4 : 0xFF08090B;
        Window w = getWindow();
        w.setStatusBarColor(bg);
        w.setNavigationBarColor(bg);
    }

    @SuppressWarnings("deprecation")
    private void applyBarAppearance() {
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                c.setSystemBarsAppearance(lightUi ? mask : 0, mask);
            }
        } else {
            View decor = w.getDecorView();
            int flags = decor.getSystemUiVisibility();
            flags = lightUi ? (flags | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR) : (flags & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            if (Build.VERSION.SDK_INT >= 26) {
                flags = lightUi ? (flags | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR) : (flags & ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
            }
            decor.setSystemUiVisibility(flags);
            applyBarColors();
        }
        web.setBackgroundColor(lightUi ? 0xFFF3F5F4 : 0xFF08090B);
    }

    private void pushInsets() {
        if (!pageReady || web == null) return;
        String js = String.format(Locale.US, "window.__setInsets&&window.__setInsets(%d,%d,%d,%d)",
                insetsDp[0], insetsDp[1], insetsDp[2], insetsDp[3]);
        web.evaluateJavascript(js, null);
    }

    // ───────────── «Назад» ─────────────

    private void dispatchBackToPage() {
        if (web != null) web.evaluateJavascript("window.__back&&window.__back()", null);
    }

    private void updateBackCallback() {
        if (Build.VERSION.SDK_INT < 33 || backCallback == null) return;
        OnBackInvokedDispatcher d = getOnBackInvokedDispatcher();
        if (canGoBack && !backRegistered) {
            d.registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, (OnBackInvokedCallback) backCallback);
            backRegistered = true;
        } else if (!canGoBack && backRegistered) {
            d.unregisterOnBackInvokedCallback((OnBackInvokedCallback) backCallback);
            backRegistered = false;
        }
    }

    /*
     * Android 7–12. На Android 13+ этот метод не вызывается: там «назад» (включая жест
     * с предиктивной анимацией) обрабатывает OnBackInvokedCallback из updateBackCallback(),
     * который регистрируется только когда странице есть что закрыть.
     */
    @SuppressLint("GestureBackNavigation")
    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (canGoBack) dispatchBackToPage();
        else super.onBackPressed();
    }

    // ───────────── Жизненный цикл ─────────────

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (web != null) web.saveState(outState);
    }

    @Override
    protected void onPause() {
        if (web != null) {
            web.evaluateJavascript("window.__save&&window.__save()", null);
            web.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            root.removeView(web);
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }

    // ───────────── Файлы: сохранение (Excel, резервная копия) и выбор файла ─────────────

    @SuppressWarnings("deprecation")
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_SAVE) {
            byte[] bytes = pendingBytes;
            pendingBytes = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null || bytes == null) return;
            try (OutputStream os = getContentResolver().openOutputStream(data.getData(), "wt")) {
                if (os == null) throw new IOException("no stream");
                os.write(bytes);
                Toast.makeText(this, R.string.saved, Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Toast.makeText(this, R.string.save_failed, Toast.LENGTH_LONG).show();
            }
        } else if (requestCode == REQ_OPEN) {
            ValueCallback<Uri[]> cb = fileCallback;
            fileCallback = null;
            if (cb == null) return;
            Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
            cb.onReceiveValue(result);
        }
    }

    @SuppressWarnings("deprecation")
    private void startSave(String filename, String mime, byte[] bytes) {
        pendingBytes = bytes;
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType(mime == null || mime.isEmpty() ? "application/octet-stream" : mime);
        i.putExtra(Intent.EXTRA_TITLE, filename == null ? "shiftflow" : filename);
        try {
            startActivityForResult(i, REQ_SAVE);
        } catch (ActivityNotFoundException e) {
            pendingBytes = null;
            Toast.makeText(this, R.string.save_failed, Toast.LENGTH_LONG).show();
        }
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show();
        }
    }

    // ───────────── WebView ─────────────

    private final class LocalClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri u = request.getUrl();
            if (HOST.equals(u.getHost())) return serveAsset(u.getPath());
            // Всё остальное — запрещено: приложение не ходит в сеть.
            return new WebResourceResponse("text/plain", "utf-8", 403, "Blocked", Collections.<String, String>emptyMap(),
                    new ByteArrayInputStream(new byte[0]));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri u = request.getUrl();
            if (HOST.equals(u.getHost())) return false;
            String scheme = u.getScheme() == null ? "" : u.getScheme();
            if (scheme.equals("http") || scheme.equals("https") || scheme.equals("mailto") || scheme.equals("tel")) {
                openExternal(u);
            }
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            pageReady = true;
            pushInsets();
            view.evaluateJavascript("window.AndroidApp&&window.__canGoBack&&window.AndroidApp.setCanGoBack(window.__canGoBack())", null);
        }
    }

    private WebResourceResponse serveAsset(String path) {
        if (path == null || path.equals("/") || path.isEmpty()) path = "/www/index.html";
        if (path.endsWith("/")) path += "index.html";
        String rel = path.startsWith("/") ? path.substring(1) : path;
        if (rel.contains("..")) return notFound();
        String ext = rel.contains(".") ? rel.substring(rel.lastIndexOf('.') + 1).toLowerCase(Locale.US) : "";
        String mime = MIME.containsKey(ext) ? MIME.get(ext) : "application/octet-stream";
        try {
            InputStream in = getAssets().open(rel);
            Map<String, String> headers = new HashMap<>();
            headers.put("Cache-Control", "no-cache");
            headers.put("Access-Control-Allow-Origin", "https://" + HOST);
            boolean text = mime.startsWith("text/") || mime.contains("json") || mime.contains("svg");
            return new WebResourceResponse(mime, text ? "utf-8" : null, 200, "OK", headers, in);
        } catch (IOException e) {
            return notFound();
        }
    }

    private static WebResourceResponse notFound() {
        return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", Collections.<String, String>emptyMap(),
                new ByteArrayInputStream(new byte[0]));
    }

    private final class ChromeClient extends WebChromeClient {
        @SuppressWarnings("deprecation")
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = callback;
            Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("*/*");
            i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"});
            try {
                startActivityForResult(i, REQ_OPEN);
                return true;
            } catch (ActivityNotFoundException e) {
                fileCallback = null;
                return false;
            }
        }
    }

    // ───────────── Мост для JavaScript ─────────────

    final class Bridge {
        @JavascriptInterface
        public void saveFile(String filename, String mime, String base64) {
            final byte[] bytes;
            try {
                bytes = Base64.decode(base64 == null ? "" : base64, Base64.DEFAULT);
            } catch (IllegalArgumentException e) {
                main.post(() -> Toast.makeText(MainActivity.this, R.string.save_failed, Toast.LENGTH_LONG).show());
                return;
            }
            main.post(() -> startSave(filename, mime, bytes));
        }

        @JavascriptInterface
        public void setStatusBar(boolean light) {
            main.post(() -> {
                lightUi = light;
                applyBarAppearance();
            });
        }

        @JavascriptInterface
        public void setCanGoBack(boolean value) {
            main.post(() -> {
                canGoBack = value;
                updateBackCallback();
            });
        }

        @JavascriptInterface
        public void haptic(String kind) {
            main.post(() -> {
                if (web == null) return;
                int c;
                if ("heavy".equals(kind)) c = Build.VERSION.SDK_INT >= 30 ? HapticFeedbackConstants.CONFIRM : HapticFeedbackConstants.LONG_PRESS;
                else if ("tick".equals(kind)) c = HapticFeedbackConstants.CLOCK_TICK;
                else c = HapticFeedbackConstants.VIRTUAL_KEY;
                web.performHapticFeedback(c);
            });
        }
    }
}
