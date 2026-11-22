#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/www"
rm -rf "$WWW"
mkdir -p "$WWW/vendor" "$WWW/fonts" "$WWW/assets"

# App + admin (admin is optional in the APK; members use index.html)
cp "$ROOT/index.html" "$WWW/index.html"
cp "$ROOT/admin.html" "$WWW/admin.html" 2>/dev/null || true

# Styles, scripts, vendor
shopt -s nullglob
cp "$ROOT"/*.css "$WWW/"
# JS modules used by the app/admin (skip tests)
for f in "$ROOT"/*.js; do
  base="$(basename "$f")"
  case "$base" in
    *.test.js) ;;
    *) cp "$f" "$WWW/" ;;
  esac
done
cp -R "$ROOT/vendor/." "$WWW/vendor/"
if [ -d "$ROOT/fonts" ]; then cp -R "$ROOT/fonts/." "$WWW/fonts/"; fi
if [ -d "$ROOT/assets" ]; then cp -R "$ROOT/assets/." "$WWW/assets/"; fi
# v2.2.2c: trade cover photos (v159.js covers/*.jpg) were missing from the APK
if [ -d "$ROOT/covers" ]; then mkdir -p "$WWW/covers"; cp -R "$ROOT/covers/." "$WWW/covers/"; fi
# icons
cp "$ROOT/favicon.ico" "$WWW/" 2>/dev/null || true
cp "$ROOT/apple-touch-icon.png" "$WWW/" 2>/dev/null || true

# Force full-screen app shell on the phone (studio chrome already hides under 480px)
# Add a helper so first paint is in shot mode inside the APK.
python3 - "$WWW/index.html" << 'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
t = p.read_text()
if "rb-native-shot" not in t:
    t = t.replace(
        "<head>",
        "<head>\n  <script>/* rb-native-shot: full-screen on device */\n  if (!/[?&]shot=/.test(location.search)) {\n    try {\n      if (window.Capacitor || window.matchMedia('(max-width: 480px)').matches) {\n        history.replaceState(null, '', location.pathname + (location.search ? location.search + '&' : '?') + 'shot=welcome' + location.hash);\n      }\n    } catch (e) {}\n  }\n  </script>",
        1,
    )
    p.write_text(t)
PY

echo "www ready: $(find "$WWW" -type f | wc -l) files, $(du -sh "$WWW" | cut -f1)"
