/* v2.2.2 b16 QA #17: keep a password-reset link (#access_token=...&type=recovery) before the app router rewrites the hash. Loaded first. */
try { if (/type=recovery/.test(location.hash) && /access_token=/.test(location.hash)) window.__rbAuthHash = String(location.hash); } catch (e) {}
