package com.ratebuddies.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * v2.2.0: text zoom capped at 115% (design spec v2.2).
 * v2.1.4: system bars.
 * - Top: the app draws under a transparent status bar (headers and trade covers reach the top). The status-bar
 *   height is passed to the web layer as the CSS variable --rb-sat, which the headers add as top padding.
 * - Bottom / sides: the CONTENT VIEW that holds the WebView is padded by the navigation bar (and display cutout,
 *   and the keyboard when it is open), so the WebView itself ends above the Android nav bar. v2.1.3 padded the
 *   WebView, which a WebView ignores for its page, so bottom buttons sat behind the nav bar.
 * - The insets are consumed here, so the page's env(safe-area-inset-*) is 0 and nothing is padded twice.
 *   --rb-sab is also published (0px) for the web QA.
 */
public class MainActivity extends BridgeActivity {
    private int statusBarPx = 0;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            final Window window = getWindow();
            WindowCompat.setDecorFitsSystemWindows(window, false);
            window.setStatusBarColor(Color.TRANSPARENT);
            // area behind the gesture / 3-button nav bar: app background, dark icons
            window.setNavigationBarColor(Color.parseColor("#F4F6FB"));
            final View content = findViewById(android.R.id.content);
            content.setBackgroundColor(Color.parseColor("#F4F6FB"));
            setDarkIcons(true);
            WindowInsetsControllerCompat c = WindowCompat.getInsetsController(window, window.getDecorView());
            c.setAppearanceLightNavigationBars(true);

            final WebView webView = getBridge().getWebView();
            // v2.2.0: follow the phone's text size, but cap it at 115% so large system fonts cannot clip buttons and titles
            try {
                float fontScale = getResources().getConfiguration().fontScale;
                int zoom = Math.round(fontScale * 100f);
                webView.getSettings().setTextZoom(Math.max(85, Math.min(115, zoom)));
            } catch (Exception ignoredZoom) {
            }
            webView.addJavascriptInterface(new StatusBarBridge(), "RBStatusBar");
            webView.addJavascriptInterface(new OpenBridge(), "RBOpenNative"); // v2.2.2 b18: Facebook / Google Maps links open in those apps
            ViewCompat.setOnApplyWindowInsetsListener(content, (View v, WindowInsetsCompat insets) -> {
                Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
                Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
                statusBarPx = bars.top;
                int bottom = Math.max(bars.bottom, ime.bottom);
                v.setPadding(bars.left, 0, bars.right, bottom);
                pushInset();
                return WindowInsetsCompat.CONSUMED;
            });
            ViewCompat.requestApplyInsets(content);
        } catch (Exception ignored) {
        }
    }

    private void pushInset() {
        try {
            final WebView webView = getBridge().getWebView();
            float density = getResources().getDisplayMetrics().density;
            final int cssPx = Math.round(statusBarPx / density);
            webView.post(() -> webView.evaluateJavascript(
                "document.documentElement.style.setProperty('--rb-sat','" + cssPx + "px');" +
                "document.documentElement.style.setProperty('--rb-sab','0px');" +
                "document.documentElement.classList.add('rb-native-edge');", null));
        } catch (Exception ignored) {
        }
    }

    private void setDarkIcons(boolean dark) {
        Window window = getWindow();
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(window, window.getDecorView());
        c.setAppearanceLightStatusBars(dark);
    }

    /**
     * v2.2.2 b18 (Vishal: "make sure all links open in Facebook and Google Maps itself").
     * open(url, pkg): opens an http(s) or fb:// link in the named app (only Facebook, Facebook Lite or Google Maps),
     * never inside the WebView. If that app is not installed, the link opens in the phone's browser instead.
     * Returns "app", "browser" or "error".
     */
    public class OpenBridge {
        private boolean allowedPkg(String pkg) {
            return "com.facebook.katana".equals(pkg) || "com.facebook.lite".equals(pkg) || "com.google.android.apps.maps".equals(pkg);
        }
        private boolean installed(String pkg) {
            try { getPackageManager().getPackageInfo(pkg, 0); return true; } catch (PackageManager.NameNotFoundException e) { return false; }
        }
        @JavascriptInterface
        public boolean has(String pkg) { return pkg != null && allowedPkg(pkg) && installed(pkg); }

        @JavascriptInterface
        public String open(String url, String pkg) {
            try {
                Uri u = Uri.parse(url);
                String scheme = u.getScheme() == null ? "" : u.getScheme().toLowerCase();
                boolean web = scheme.equals("https") || scheme.equals("http");
                if (!web && !scheme.equals("fb")) return "error";
                if (pkg != null && allowedPkg(pkg) && installed(pkg)) {
                    try {
                        Intent i = new Intent(Intent.ACTION_VIEW, u);
                        i.setPackage(pkg);
                        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(i);
                        return "app";
                    } catch (ActivityNotFoundException e) { /* fall through to the browser */ }
                }
                if (!web) return "error";
                Intent b = new Intent(Intent.ACTION_VIEW, u);
                b.addCategory(Intent.CATEGORY_BROWSABLE);
                b.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(b);
                return "browser";
            } catch (Exception e) {
                return "error";
            }
        }
    }

    public class StatusBarBridge {
        /** dark = true for dark icons (light headers), false for white icons (dark covers). */
        @JavascriptInterface
        public void setDarkIcons(final boolean dark) {
            runOnUiThread(() -> MainActivity.this.setDarkIcons(dark));
        }

        @JavascriptInterface
        public void refreshInset() {
            runOnUiThread(MainActivity.this::pushInset);
        }
    }
}
