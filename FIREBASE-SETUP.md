# Konfiguracja Firebase (Email/Password) — Pandora's Box

Krótki przewodnik: projekt Spark (darmowy), logowanie e-mailem i hasłem, domena GitHub Pages, wklejenie konfiguracji web.

## 1. Utwórz projekt Firebase

1. Wejdź na [Firebase Console](https://console.firebase.google.com/).
2. **Add project** / Dodaj projekt.
3. Podaj nazwę (np. `pandoras-box`) → dalej.
4. Google Analytics możesz wyłączyć (opcjonalnie) → **Create project**.
5. Plan **Spark** (darmowy) wystarczy do Auth Email/Password.

## 2. Włącz Authentication → Email/Password

1. W menu: **Build** → **Authentication**.
2. **Get started**.
3. Zakładka **Sign-in method**.
4. Wybierz **Email/Password** → **Enable** (włącz) → **Save**.
5. **Nie** włączaj Phone (SMS) — aplikacja tego nie używa.

## 3. Dodaj aplikację Web

1. Na stronie projektu kliknij ikonę **Web** (`</>`) lub **Project settings** → **Your apps** → Add app → Web.
2. Nickname np. `pandoras-box-web`.
3. Firebase Hosting możesz pominąć (używamy GitHub Pages).
4. **Register app**.
5. Skopiuj obiekt konfiguracji (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

## 4. Authorized domains (ważne dla GitHub Pages)

1. **Authentication** → **Settings** → **Authorized domains**.
2. Dodaj:
   - `haos1980.github.io`
   - `localhost` (już zwykle jest — potrzebne do testów lokalnych)
3. Bez `haos1980.github.io` logowanie na Pages się nie uda.

## 5. Wklej konfigurację do repozytorium

Otwórz plik `firebase-config.js` i zastąp placeholdery `REPLACE_ME` prawdziwymi wartościami z konsoli, potem ustaw `configured: true`:

```js
export const firebaseConfig = {
  apiKey: "AIza…",
  authDomain: "twoj-projekt.firebaseapp.com",
  projectId: "twoj-projekt",
  storageBucket: "twoj-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

export const configured = true;
```

To są **publiczne** klucze klienta web (OK w froncie). Nie wklejaj kluczy serwerowych / service account.

## 6. Wdróż (GitHub Pages)

```bash
git add firebase-config.js
git commit -m "chore: configure Firebase web app"
git push origin main
```

Po kilku minutach odśwież: https://haos1980.github.io/pandoras-box/  
(Hard refresh / wyczyść cache SW, jeśli widzisz starą wersję.)

## 7. Test

1. **Register** — e-mail + hasło (min. 6 znaków) → konto Firebase + lokalny sejf AES-GCM.
2. **Lock** → **Login** tym samym e-mailem i hasłem.
3. **Forgot password** — sprawdź skrzynkę (i spam); pamiętaj: nowe hasło Firebase **nie** odszyfruje starego sejfu lokalnego bez starego hasła / eksportu.

## Problemy

| Objaw | Co sprawdzić |
|--------|----------------|
| Baner „Firebase not configured” | `configured: true` i brak `REPLACE_ME` w `firebase-config.js` |
| `auth/unauthorized-domain` | Authorized domains → `haos1980.github.io` |
| Reset hasła nie dochodzi | Szablon e-mail w Authentication → Templates; folder spam |
| Sejf nie otwiera się po resecie Firebase | Eksport przed resetem / stare hasło sejfu — to zamierzone |

## Pliki w projekcie

- `firebase-config.js` — konfiguracja web + flaga `configured`
- `auth.js` — SDK Firebase (CDN v10+), login / register / reset / signOut
- `app.js` — UI trybów Login / Register / Forgot + sejf lokalny
