package com.ratebuddies.app;

import android.graphics.Color;
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
 * v2.1.3: draw the app edge-to-edge under a transparent status bar so headers and trade covers
 * reach the very top (no grey band). The status-bar height is passed to the web layer as the CSS
 * variable --rb-sat, and the web layer picks light or dark status-bar icons per screen.
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
            setDarkIcons(true);

            final WebView webView = getBridge().getWebView();
            webView.addJavascriptInterface(new StatusBarBridge(), "RBStatusBar");
            ViewCompat.setOnApplyWindowInsetsListener(webView, (View v, WindowInsetsCompat insets) -> {
                Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                statusBarPx = bars.top;
                // keep the web view clear of the navigation bar at the bottom; top is handled in CSS
                v.setPadding(bars.left, 0, bars.right, bars.bottom);
                pushInset();
                return insets;
            });
            ViewCompat.requestApplyInsets(webView);
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
                "document.documentElement.classList.add('rb-native-edge');", null));
        } catch (Exception ignored) {
        }
    }

    private void setDarkIcons(boolean dark) {
        Window window = getWindow();
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(window, window.getDecorView());
        c.setAppearanceLightStatusBars(dark);
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
