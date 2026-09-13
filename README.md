# Pandora's Box

Dark, mobile-first **PWA** — local password vault (Most Autonomii spirit).  
Encrypted in the browser (**AES-GCM** + PBKDF2). No plaintext secrets in the repo.

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

## How to use

1. Choose a language (flags). Change it later from the flag chip on lock or vault.
2. First visit: **login + password** → Create / Register.
3. Later: the same login + password → Unlock. Legacy vaults without a stored login still unlock with password only; the next save can store the login.
4. Add entries (＋): service*, email, phone, password, URL, tag, notes, Login with Google.
5. Search, edit, delete; copy email / phone / password / URL.
6. ⬇ export / ⬆ import encrypted JSON · 🔒 lock the vault.

**Note:** a forgotten password cannot be recovered (by design).

## Files

`index.html` · `style.css` · `app.js` · `manifest.json` · `sw.js` · `icons/`

## Security

- Random salt + IV; key from password (PBKDF2-SHA-256, 210k iterations).
- Login is stored in local META (not the encryption key). Vault ciphertext lives in `localStorage`.
- Do not commit JSON exports that contain real data.

Author: [Haos1980](https://github.com/Haos1980)
