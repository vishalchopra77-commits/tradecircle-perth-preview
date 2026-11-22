/* v2.2.2 b16 QA #14: scripts/prepare-www.sh rewrites this in www/ (true only when android/app/google-services.json exists).
   Push registration without Firebase config crashes Android, so the app never calls register() while this is false. */
window.RB_PUSH_READY = false;
