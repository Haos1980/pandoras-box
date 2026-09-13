# Pandora's Box

Dark, mobile-first **PWA** — local password vault (Most Autonomii spirit).  
Encrypted in the browser (**AES-GCM** + PBKDF2). Auth via **Firebase Email/Password** (optional until you paste web config). No plaintext secrets in the repo.

Nine languages on first launch: Polski, Deutsch, Русский, English, Français, Italiano, Español, 中文, 日本語.

## Open

- **GitHub Pages**: https://haos1980.github.io/pandoras-box/
- Locally:

```bash
cd pandoras-box
python3 -m http.server 8080
# → http://localhost:8080
```

On a phone: Chrome → Add to Home Screen.

## Firebase Auth

1. Follow **[FIREBASE-SETUP.md](./FIREBASE-SETUP.md)** (Polish step-by-step).
2. Paste your Firebase **web** config into `firebase-config.js` and set `configured: true`.
3. In Firebase Console → Authentication → Settings → **Authorized domains**, add:
   - `haos1980.github.io`
   - `localhost` (for local testing)

Email/Password only — no SMS Phone Auth. Optional phone on Register is stored in local meta for display.

**Important:** resetting the Firebase password does **not** decrypt an old local vault. Export the vault first, or remember the old vault password.

## How to use

1. Choose a language (flags). Change it later from the flag chip on lock or vault.
2. **Login** — email + password (Firebase), then unlock/create the local AES-GCM vault with the same password.
3. **Register** — email + password (+ optional phone in meta) → Firebase user + new local vault.
4. **Forgot password** — email → `sendPasswordResetEmail` (see vault warning on that screen).
5. Add entries (＋): service*, email, phone, password, URL, tag, notes, Login with Google.
6. Search, edit, delete; copy email / phone / password / URL.
7. ⬇ export / ⬆ import encrypted JSON · 🔒 lock (also signs out of Firebase).

Until Firebase is configured, the lock screen shows a friendly “Firebase not configured” hint.

## Files

`index.html` · `style.css` · `app.js` · `auth.js` · `firebase-config.js` · `manifest.json` · `sw.js` · `icons/` · `FIREBASE-SETUP.md`

## Security

- Random salt + IV; key from password (PBKDF2-SHA-256, 210k iterations).
- Firebase identifies the account (email). The vault ciphertext stays in `localStorage` on the device.
- Login email / optional phone live in local META (not the encryption key).
- Do not commit JSON exports that contain real data.
- Do not commit real secrets beyond the public Firebase web config.

Author: [Haos1980](https://github.com/Haos1980)
