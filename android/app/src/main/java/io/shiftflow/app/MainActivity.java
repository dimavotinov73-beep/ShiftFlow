package io.shiftflow.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
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
import android.webkit.RenderProcessGoneDetail;
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

import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;

/**
 * ShiftFlow: оболочка над веб-интерфейсом из assets/www.
 *
 * Безопасность:
 *  • интерфейс грузится с https://appassets.androidplatform.net/www/ — все запросы к этому адресу
 *    обслуживаются из APK, любые другие запросы WebView блокируются (никаких внешних страниц и скриптов);
 *  • ссылки наружу открываются только в браузере/почте, внутри приложения — никогда;
 *  • всё, что приходит из JavaScript, из виджетов и из сети, проверяется по формату и размеру;
 *  • сетевой запрос только один — проверка обновлений по HTTPS на адрес, зашитый в сборку.
 *
 * Мост window.AndroidApp: saveFile, setStatusBar, setCanGoBack, haptic,
 * setWidgetData, takeWidgetOps, checkUpdate, openUpdate.
 */
public class MainActivity extends Activity {

    static final String EXTRA_DAY = "io.shiftflow.app.DAY";
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/www/index.html";
    private static final int REQ_SAVE = 41;
    private static final int REQ_OPEN = 42;
    private static final int MAX_FILE = 30 * 1024 * 1024;
    private static final long UPDATE_INTERVAL = 12L * 60 * 60 * 1000;
    private static final String DONATE_URL = "https://www.donationalerts.com/r/shiftflow";
    private static final Pattern VERSION = Pattern.compile("^\\d{1,3}(\\.\\d{1,3}){0,3}$");
    private static final Set<String> SAVE_MIME = new HashSet<>();
    static {
        SAVE_MIME.add("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        SAVE_MIME.add("text/csv");
        SAVE_MIME.add("application/json");
        SAVE_MIME.add("application/octet-stream");
    }

    private static final Map<String, String> MIME = new HashMap<>();
    static {
        MIME.put("html", "text/html");
        MIME.put("js", "text/javascript");
        MIME.put("css", "text/css");
        MIME.put("json", "application/json");
        MIME.put("webmanifest", "application/manifest+json");
        MIME.put("svg", "image/svg+xml");
        MIME.put("png", "image/png");
        MIME.put("webp", "image/webp");
        MIME.put("woff2", "font/woff2");
        MIME.put("txt", "text/plain");
    }

    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private FrameLayout root;
    private WebView web;
    private boolean canGoBack = false;
    private boolean lightUi = false;
    private boolean pageReady = false;
    private int[] insetsDp = {0, 0, 0, 0};
    private String pendingDay;
    private volatile String updateApkUrl;

    private byte[] pendingBytes;
    private ValueCallback<Uri[]> fileCallback;
    private Object backCallback; // OnBackInvokedCallback (API 33+)
    private boolean backRegistered = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        lightUi = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) != Configuration.UI_MODE_NIGHT_YES;
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        root = new FrameLayout(this);
        createWebView();
        setContentView(root);
        setupWindow();

        if (Build.VERSION.SDK_INT >= 33) {
            backCallback = (OnBackInvokedCallback) this::dispatchBackToPage;
        }
        pendingDay = dayFrom(getIntent());
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        if (web.getUrl() == null) web.loadUrl(START_URL);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void createWebView() {
        web = new WebView(this);
        web.setBackgroundColor(lightUi ? 0xFFC3A57C : 0xFF17120E);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        root.addView(web, 0, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setGeolocationEnabled(false);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setSupportMultipleWindows(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= 26) s.setSafeBrowsingEnabled(false); // внешних страниц нет — проверять нечего

        web.addJavascriptInterface(new Bridge(), "AndroidApp");
        web.setWebViewClient(new LocalClient());
        web.setWebChromeClient(new ChromeClient());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        String day = dayFrom(intent);
        if (day != null) {
            pendingDay = day;
            if (pageReady) openPendingDay();
        }
    }

    /** День из виджета — только строго в формате ГГГГ-ММ-ДД. */
    private static String dayFrom(Intent intent) {
        if (intent == null) return null;
        String d = intent.getStringExtra(EXTRA_DAY);
        return d != null && WidgetStore.DATE.matcher(d).matches() ? d : null;
    }

    private void openPendingDay() {
        if (pendingDay == null || web == null) return;
        String js = "window.__openDay&&window.__openDay(" + JSONObject.quote(pendingDay) + ")";
        pendingDay = null;
        web.evaluateJavascript(js, null);
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
                v.setPadding(0, 0, 0, imeVisible ? ime.bottom : 0);   // клавиатура не закрывает поле ввода
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
            applyBarColors();
        }
        applyBarAppearance();
    }

    private void applyBarColors() {
        if (Build.VERSION.SDK_INT >= 30) return;
        int bg = lightUi ? 0xFFC3A57C : 0xFF17120E;
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
        if (web != null) web.setBackgroundColor(lightUi ? 0xFFC3A57C : 0xFF17120E);
    }

    private void pushInsets() {
        if (!pageReady || web == null) return;
        web.evaluateJavascript(String.format(Locale.US, "window.__setInsets&&window.__setInsets(%d,%d,%d,%d)",
                insetsDp[0], insetsDp[1], insetsDp[2], insetsDp[3]), null);
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
     * Android 7–12. На Android 13+ этот метод не вызывается: «назад» (включая жест с предиктивной
     * анимацией) обрабатывает OnBackInvokedCallback, который регистрируется, только когда странице есть что закрыть.
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
        if (web != null) {
            web.onResume();
            // действия с виджетов, сделанные пока приложение было свёрнуто
            if (pageReady) web.evaluateJavascript("window.__widgetSync&&window.__widgetSync()", null);
        }
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            root.removeView(web);
            web.destroy();
            web = null;
        }
        io.shutdownNow();
        super.onDestroy();
    }

    // ───────────── Файлы: сохранение (Excel, CSV, резервная копия) и выбор файла ─────────────

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
            cb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
        }
    }

    @SuppressWarnings("deprecation")
    private void startSave(String filename, String mime, byte[] bytes) {
        pendingBytes = bytes;
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType(mime);
        i.putExtra(Intent.EXTRA_TITLE, filename);
        try {
            startActivityForResult(i, REQ_SAVE);
        } catch (ActivityNotFoundException e) {
            pendingBytes = null;
            Toast.makeText(this, R.string.save_failed, Toast.LENGTH_LONG).show();
        }
    }

    private static String safeFileName(String name) {
        String n = name == null ? "" : name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]+", " ").trim();
        if (n.isEmpty()) n = "shiftflow";
        return n.length() > 80 ? n.substring(0, 80) : n;
    }

    private void openExternal(Uri uri) {
        String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.US);
        Intent i;
        if (scheme.equals("mailto")) i = new Intent(Intent.ACTION_SENDTO, uri);
        else if (scheme.equals("https") || scheme.equals("market")) i = new Intent(Intent.ACTION_VIEW, uri);
        else return;
        try {
            startActivity(i);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show();
        }
    }

    // ───────────── Обновления ─────────────

    private void checkUpdate(boolean force) {
        if (!"site".equals(BuildConfig.UPDATE_CHANNEL) || BuildConfig.UPDATE_URL.isEmpty()) {
            deliverUpdate("{\"available\":false,\"channel\":\"store\"}");
            return;
        }
        SharedPreferences p = getSharedPreferences("sf_update", MODE_PRIVATE);
        String cached = p.getString("result", null);
        if (!force && cached != null && System.currentTimeMillis() - p.getLong("checkedAt", 0) < UPDATE_INTERVAL) {
            updateApkUrl = p.getString("apk", null);
            deliverUpdate(cached);
            return;
        }
        io.execute(() -> {
            String out;
            try {
                URL url = new URL(BuildConfig.UPDATE_URL);
                if (!"https".equals(url.getProtocol())) throw new IOException("https only");
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setConnectTimeout(7000);
                con.setReadTimeout(8000);
                con.setUseCaches(false);
                con.setInstanceFollowRedirects(false);
                con.setRequestProperty("Accept", "application/json");
                con.setRequestProperty("Cache-Control", "no-cache");
                if (con.getResponseCode() != 200) throw new IOException("HTTP " + con.getResponseCode());
                String body;
                try (InputStream in = con.getInputStream()) {
                    ByteArrayOutputStream buf = new ByteArrayOutputStream();
                    byte[] chunk = new byte[4096];
                    int n;
                    while ((n = in.read(chunk)) > 0) {
                        buf.write(chunk, 0, n);
                        if (buf.size() > 32 * 1024) throw new IOException("too big");
                    }
                    body = new String(buf.toByteArray(), StandardCharsets.UTF_8);
                } finally {
                    con.disconnect();
                }
                JSONObject m = new JSONObject(body);
                int code = m.getInt("code");
                String version = m.getString("version");
                if (!VERSION.matcher(version).matches()) throw new IOException("bad version");
                URL apk = new URL(url, m.getString("apk"));
                // скачивать разрешено только по HTTPS и только с того же сайта, что и файл версии
                if (!"https".equals(apk.getProtocol()) || !url.getHost().equalsIgnoreCase(apk.getHost())) throw new IOException("bad apk url");
                boolean available = code > BuildConfig.VERSION_CODE;
                JSONObject res = new JSONObject().put("available", available).put("version", version).put("channel", "site");
                Object notes = m.opt("notes");
                if (notes instanceof JSONObject || notes instanceof org.json.JSONArray) res.put("notes", notes);
                updateApkUrl = available ? apk.toString() : null;
                out = res.toString();
                p.edit().putLong("checkedAt", System.currentTimeMillis()).putString("result", out).putString("apk", updateApkUrl).apply();
            } catch (Exception e) {
                out = "{\"error\":true,\"channel\":\"site\"}";
            }
            deliverUpdate(out);
        });
    }

    private void deliverUpdate(String json) {
        main.post(() -> {
            if (web != null) web.evaluateJavascript("window.__onUpdate&&window.__onUpdate(" + json + ")", null);
        });
    }

    private void openUpdate() {
        String pkg = getPackageName();
        if ("site".equals(BuildConfig.UPDATE_CHANNEL)) {
            if (updateApkUrl != null) openExternal(Uri.parse(updateApkUrl));
            return;
        }
        if ("rustore".equals(BuildConfig.UPDATE_CHANNEL)) {
            openExternal(Uri.parse("https://apps.rustore.ru/app/" + pkg));
            return;
        }
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + pkg)));
        } catch (ActivityNotFoundException e) {
            openExternal(Uri.parse("https://play.google.com/store/apps/details?id=" + pkg));
        }
    }

    // ───────────── WebView ─────────────

    private final class LocalClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri u = request.getUrl();
            if (HOST.equals(u.getHost()) && "https".equals(u.getScheme())) return serveAsset(u.getPath());
            // Всё остальное запрещено: страница не может обратиться в сеть.
            return new WebResourceResponse("text/plain", "utf-8", 403, "Blocked", Collections.<String, String>emptyMap(),
                    new ByteArrayInputStream(new byte[0]));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri u = request.getUrl();
            if (HOST.equals(u.getHost()) && "https".equals(u.getScheme())) return false;
            if (request.hasGesture()) openExternal(u);   // наружу — только по нажатию пользователя
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            pageReady = true;
            pushInsets();
            view.evaluateJavascript("window.AndroidApp&&window.__canGoBack&&window.AndroidApp.setCanGoBack(window.__canGoBack())", null);
            openPendingDay();
        }

        @android.annotation.TargetApi(26)
        @Override
        public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
            // Слабое устройство выгрузило движок страницы — пересоздаём его вместо падения приложения.
            if (web == view) {
                root.removeView(web);
                web.destroy();
                pageReady = false;
                createWebView();
                web.loadUrl(START_URL);
            }
            return true;
        }
    }

    private WebResourceResponse serveAsset(String path) {
        if (path == null || path.equals("/") || path.isEmpty()) path = "/www/index.html";
        if (path.endsWith("/")) path += "index.html";
        String rel = path.startsWith("/") ? path.substring(1) : path;
        if (!rel.startsWith("www/") || rel.contains("..")) return notFound();
        String ext = rel.contains(".") ? rel.substring(rel.lastIndexOf('.') + 1).toLowerCase(Locale.US) : "";
        String mime = MIME.get(ext);
        if (mime == null) return notFound();
        try {
            InputStream in = getAssets().open(rel);
            Map<String, String> headers = new HashMap<>();
            headers.put("Cache-Control", "no-cache");
            headers.put("X-Content-Type-Options", "nosniff");
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
            i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "text/csv", "text/comma-separated-values",
                    "application/octet-stream", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip"});
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
            if (base64 == null || base64.length() > MAX_FILE * 4 / 3 + 8) {
                main.post(() -> Toast.makeText(MainActivity.this, R.string.save_failed, Toast.LENGTH_LONG).show());
                return;
            }
            final byte[] bytes;
            try {
                bytes = Base64.decode(base64, Base64.DEFAULT);
            } catch (IllegalArgumentException e) {
                main.post(() -> Toast.makeText(MainActivity.this, R.string.save_failed, Toast.LENGTH_LONG).show());
                return;
            }
            final String type = SAVE_MIME.contains(mime) ? mime : "application/octet-stream";
            final String name = safeFileName(filename);
            main.post(() -> startSave(name, type, bytes));
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

        @JavascriptInterface
        public void setWidgetData(String json) {
            io.execute(() -> {
                if (WidgetStore.saveSnapshot(MainActivity.this, json)) WidgetRenderer.updateAll(MainActivity.this);
            });
        }

        @JavascriptInterface
        public String takeWidgetOps() {
            return WidgetStore.takeOps(MainActivity.this);
        }

        @JavascriptInterface
        public void checkUpdate(boolean force) {
            main.post(() -> MainActivity.this.checkUpdate(force));
        }

        @JavascriptInterface
        public void openUpdate() {
            main.post(MainActivity.this::openUpdate);
        }

        /** Откуда установлено приложение: site, play или rustore — чтобы не показывать в магазинных сборках то, что запрещают их правила. */
        @JavascriptInterface
        public String channel() {
            String c = BuildConfig.UPDATE_CHANNEL;
            return "play".equals(c) || "rustore".equals(c) ? c : "site";
        }

        /** Страница пожертвований в браузере. Открывается только адрес из списка — произвольную ссылку из страницы сюда не передать. */
        @JavascriptInterface
        public void openDonate() {
            if (!"site".equals(channel())) return;
            main.post(() -> openExternal(Uri.parse(DONATE_URL)));
        }
    }
}
