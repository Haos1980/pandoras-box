# Puszka Pandory · Pandora's Box

Polski, ciemny, mobile-first **PWA** — lokalny sejf haseł (duch Most Autonomii).  
Dane szyfrowane w przeglądarce (**AES-GCM** + PBKDF2). Brak plaintextu haseł w repozytorium.

Polish-first dark mobile PWA password vault. Ciphertext only in `localStorage`; export/import is encrypted JSON.

## Otwórz / Open

- **GitHub Pages** (jeśli włączone): https://haos1980.github.io/pandoras-box/
- Lokalnie:

```bash
cd pandoras-box
python3 -m http.server 8080
# → http://localhost:8080
```

Na telefonie: Chrome → Dodaj do ekranu głównego.

## Jak używać / How to unlock

1. Przy pierwszym starcie ustaw **hasło główne** (min. 4 znaki) i potwierdź.
2. Odblokuj tym samym hasłem przy kolejnych wizytach.
3. Dodaj wpisy (＋): usługa*, e-mail, telefon, hasło, URL, tag, notatki, Login with Google.
4. Szukaj, edytuj, usuwaj; kopiuj e-mail / tel / hasło / URL.
5. ⬇ eksport / ⬆ import zaszyfrowanego JSON · 🔒 blokada sejfu.

**Uwaga:** zapomniane hasło główne = brak odzyskania danych (to zamierzone).

## Pliki

`index.html` · `style.css` · `app.js` · `manifest.json` · `sw.js` · `icons/`

## Bezpieczeństwo

- Sól + IV losowe; klucz z hasła (PBKDF2-SHA-256, 210k iteracji).
- Sejf = ciphertext w `localStorage` — UI może być publiczny (Pages).
- Nie commituj eksportów JSON z prawdziwymi danymi.

Autor: [Haos1980](https://github.com/Haos1980)
