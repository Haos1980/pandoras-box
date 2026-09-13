import {
  isFirebaseConfigured,
  firebaseRegister,
  firebaseSignIn,
  firebaseSendPasswordReset,
  firebaseSignOut,
  mapFirebaseError
} from "./auth.js";


  const STORAGE_KEY = "pandora.vault.v1";
  const META_KEY = "pandora.meta.v1";
  const LANG_KEY = "pandora.lang.v1";
  const PBKDF2_ITERS = 210000;
  const SALT_LEN = 16;
  const IV_LEN = 12;

  const FLAGS = {
    pl: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="20" fill="#fff"/><rect y="20" width="60" height="20" fill="#DC143C"/></svg>',
    de: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="13.34" fill="#000"/><rect y="13.33" width="60" height="13.34" fill="#DD0000"/><rect y="26.66" width="60" height="13.34" fill="#FFCE00"/></svg>',
    ru: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="13.34" fill="#fff"/><rect y="13.33" width="60" height="13.34" fill="#0039A6"/><rect y="26.66" width="60" height="13.34" fill="#D52B1E"/></svg>',
    en: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="10"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="6"/><rect x="22" width="16" height="40" fill="#fff"/><rect y="12" width="60" height="16" fill="#fff"/><rect x="25" width="10" height="40" fill="#C8102E"/><rect y="15" width="60" height="10" fill="#C8102E"/></svg>',
    fr: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="20" height="40" fill="#002395"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>',
    it: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>',
    es: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#C60B1E"/><rect y="10" width="60" height="20" fill="#FFC400"/></svg>',
    zh: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#DE2910"/><polygon points="12,6 13.76,11.53 8.18,8.15 15.82,8.15 10.24,11.53" fill="#FFDE00"/></svg>',
    ja: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="10" fill="#BC002D"/></svg>'
  };

  const LOCALES = [
    { code: "pl", name: "Polski" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
    { code: "es", name: "Español" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" }
  ];

  const I18N = {
    en: {
      appName: "Pandora's Box",
      vaultSubtitle: "Local password vault",
      metaDescription: "Pandora's Box — encrypted local password vault",
      authSubtitleCreate: "Create an account and encrypted vault",
      authSubtitleUnlock: "Sign in with email and password",
      authLogin: "Email",
      authLoginPlaceholder: "you@example.com",
      authPassword: "Password",
      authHint: "Min. 6 characters. Vault is encrypted in this browser.",
      authCreate: "Register",
      authUnlock: "Sign in",
      authTogglePw: "Show or hide",
      errorLoginRequired: "Enter your email.",
      errorPasswordShort: "At least 6 characters.",
      errorLoginMismatch: "Email does not match this vault.",
      errorCreateFailed: "Could not create the account or vault.",
      errorBadPassword: "Wrong password or damaged vault.",
      export: "Export",
      import: "Import",
      lock: "Lock",
      search: "Search",
      searchPlaceholder: "Search service, tag, email…",
      addEntry: "Add entry",
      emptyState: "No entries yet. Add your first one (＋).",
      edit: "Edit",
      copyEmail: "Email",
      copyPhone: "Phone",
      copyPassword: "Password",
      copyUrl: "URL",
      copied: "Copied: {label}",
      copyFailed: "Could not copy",
      labelEmail: "email",
      labelPhone: "phone",
      labelPassword: "password",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "New entry",
      editEntry: "Edit entry",
      close: "Close",
      service: "Service name *",
      servicePlaceholder: "e.g. Gmail, Netflix",
      email: "Login email",
      emailPlaceholder: "login@example.com",
      phone: "Login phone",
      phonePlaceholder: "+1 …",
      password: "Password",
      passwordOptional: "optional",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Project tag",
      tagPlaceholder: "e.g. work, personal",
      notes: "Notes",
      notesPlaceholder: "Extra info…",
      googleSignIn: "Login with Google",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      confirmDelete: "Delete this entry?",
      saved: "Saved",
      saveFailed: "Save failed",
      deleted: "Deleted",
      deleteFailed: "Delete failed",
      noData: "Nothing to export",
      exported: "Export (encrypted JSON)",
      imported: "Imported — unlock with the file password",
      importFailed: "Import failed",
      invalidFile: "Invalid file",
      authSubtitleLogin: "Log in with email and password",
      authSubtitleRegister: "Create an account",
      authSubtitleForgot: "Password recovery",
      authEmail: "Email",
      authEmailPlaceholder: "you@example.com",
      authPhoneOptional: "Phone (optional)",
      authPhonePlaceholder: "+48 …",
      authHintForgot: "Enter your account email. We send a reset link (no SMS).",
      authSubmitLogin: "Log in",
      authSubmitRegister: "Create account",
      authSubmitForgot: "Send reset link",
      authLinkRegister: "Create an account",
      authLinkLogin: "I have an account / Log in",
      authLinkForgot: "Forgot password?",
      authForgotSuccess: "If an account exists for that email, a reset link was sent. Check your inbox.",
      authResetVaultWarn: "After reset: if the local vault will not open, use “Clear local vault”.",
      firebaseNotConfigured: "Firebase is not configured. Paste your web config into firebase-config.js (see FIREBASE-SETUP.md).",
      errorEmailRequired: "Enter your email.",
      errorInvalidEmail: "Enter a valid email address.",
      errorAuthFailed: "Wrong email or password.",
      errorEmailInUse: "This email is already registered.",
      errorWeakPassword: "Password is too weak (min. 6 characters).",
      errorTooManyRequests: "Too many attempts. Try again later.",
      errorNetwork: "Network error. Check your connection.",
      authSubtitleRekey: "Local vault recovery",
      authRekeyExplain: "Account OK. The local vault is on a different password (e.g. after a reset).",
      authOldVaultPassword: "Old vault password",
      authRekeyHint: "The password that unlocked this vault before the reset.",
      authRekeySubmit: "Unlock & update vault",
      authResetLocalVault: "Clear local vault and enter",
      authResetLocalVaultConfirm: "Delete ALL local vault data on this device? Your online account stays. Entries on this device will be lost. Create an empty vault with your new password?",
      authWipeSuccess: "Local vault cleared. Empty vault ready.",
      errorBadOldPassword: "Wrong old vault password.",
      authRekeyCancel: "Back to log in",
      errorWrongPassword: "Wrong password.",

      errorUserNotFound: "No account with this email.",


      authRekeyChoiceOld: "Enter with old vault password",



      authRekeyBack: "Back",




      changeLanguage: "Language"
    },
    pl: {
      appName: "Puszka Pandory",
      vaultSubtitle: "Sejf haseł na urządzeniu",
      metaDescription: "Puszka Pandory — zaszyfrowany sejf haseł (PWA)",
      authSubtitleCreate: "Utwórz konto i zaszyfrowany sejf",
      authSubtitleUnlock: "Zaloguj się e-mailem i hasłem",
      authLogin: "E-mail",
      authLoginPlaceholder: "ty@example.com",
      authPassword: "Hasło",
      authHint: "Min. 6 znaków. Sejf szyfrowany w tej przeglądarce.",
      authCreate: "Zarejestruj",
      authUnlock: "Zaloguj",
      authTogglePw: "Pokaż lub ukryj",
      errorLoginRequired: "Podaj e-mail.",
      errorPasswordShort: "Min. 6 znaków.",
      errorLoginMismatch: "E-mail nie pasuje do tego sejfu.",
      errorCreateFailed: "Nie udało się utworzyć konta lub sejfu.",
      errorBadPassword: "Błędne hasło lub uszkodzony sejf.",
      export: "Eksport",
      import: "Import",
      lock: "Zablokuj",
      search: "Szukaj",
      searchPlaceholder: "Szukaj usługi, tagu, e-maila…",
      addEntry: "Dodaj wpis",
      emptyState: "Brak wpisów. Dodaj pierwszy (＋).",
      edit: "Edytuj",
      copyEmail: "E-mail",
      copyPhone: "Tel",
      copyPassword: "Hasło",
      copyUrl: "URL",
      copied: "Skopiowano: {label}",
      copyFailed: "Nie udało się skopiować",
      labelEmail: "e-mail",
      labelPhone: "telefon",
      labelPassword: "hasło",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "Nowy wpis",
      editEntry: "Edytuj wpis",
      close: "Zamknij",
      service: "Nazwa usługi *",
      servicePlaceholder: "np. Gmail, Allegro",
      email: "E-mail logowania",
      emailPlaceholder: "login@example.com",
      phone: "Telefon logowania",
      phonePlaceholder: "+48 …",
      password: "Hasło",
      passwordOptional: "opcjonalne",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Tag projektu",
      tagPlaceholder: "np. praca, prywatne",
      notes: "Notatki",
      notesPlaceholder: "Dodatkowe info…",
      googleSignIn: "Login with Google",
      delete: "Usuń",
      cancel: "Anuluj",
      save: "Zapisz",
      confirmDelete: "Usunąć ten wpis?",
      saved: "Zapisano",
      saveFailed: "Błąd zapisu",
      deleted: "Usunięto",
      deleteFailed: "Błąd usuwania",
      noData: "Brak danych",
      exported: "Eksport (szyfrowany JSON)",
      imported: "Zaimportowano — odblokuj hasłem pliku",
      importFailed: "Błąd importu",
      invalidFile: "Nieprawidłowy plik",
      authSubtitleLogin: "Zaloguj się e-mailem i hasłem",
      authSubtitleRegister: "Utwórz konto",
      authSubtitleForgot: "Odzyskiwanie hasła",
      authEmail: "E-mail",
      authEmailPlaceholder: "ty@example.com",
      authPhoneOptional: "Telefon (opcjonalnie)",
      authPhonePlaceholder: "+48 …",
      authHintForgot: "Podaj e-mail konta. Wyślemy link resetu (bez SMS).",
      authSubmitLogin: "Zaloguj",
      authSubmitRegister: "Utwórz konto",
      authSubmitForgot: "Wyślij link resetu",
      authLinkRegister: "Utwórz konto",
      authLinkLogin: "Mam już konto / Zaloguj",
      authLinkForgot: "Nie pamiętam hasła",
      authForgotSuccess: "Jeśli konto istnieje, wysłaliśmy link resetu. Sprawdź skrzynkę.",
      authResetVaultWarn: "Po resecie: jeśli lokalny sejf się nie otworzy, użyj „Usuń lokalny sejf”.",
      firebaseNotConfigured: "Firebase nie jest skonfigurowany. Wklej konfigurację web do firebase-config.js (patrz FIREBASE-SETUP.md).",
      errorEmailRequired: "Podaj e-mail.",
      errorInvalidEmail: "Podaj prawidłowy adres e-mail.",
      errorAuthFailed: "Błędny e-mail lub hasło.",
      errorEmailInUse: "Ten e-mail jest już zarejestrowany.",
      errorWeakPassword: "Hasło za słabe (min. 6 znaków).",
      errorTooManyRequests: "Za dużo prób. Spróbuj później.",
      errorNetwork: "Błąd sieci. Sprawdź połączenie.",
      authSubtitleRekey: "Odzyskiwanie lokalnego sejfu",
      authRekeyExplain: "Konto OK. Lokalny sejf jest na innym haśle (np. po resecie).",
      authOldVaultPassword: "Stare hasło sejfu",
      authRekeyHint: "Hasło, którym otwierałeś sejf przed resetem.",
      authRekeySubmit: "Odblokuj i zaktualizuj sejf",
      authResetLocalVault: "Usuń lokalny sejf i wejdź",
      authResetLocalVaultConfirm: "Usunąć CAŁY lokalny sejf na tym urządzeniu? Konto online zostaje. Wpisy na tym urządzeniu znikną. Utworzyć pusty sejf z nowym hasłem?",
      authWipeSuccess: "Lokalny sejf usunięty. Pusty sejf gotowy.",
      errorBadOldPassword: "Błędne stare hasło sejfu.",
      authRekeyCancel: "Wróć do logowania",
      errorWrongPassword: "Błędne hasło.",

      errorUserNotFound: "Brak konta z tym e-mailem.",


      authRekeyChoiceOld: "Wejdź ze starym hasłem sejfu",



      authRekeyBack: "Wstecz",




      changeLanguage: "Język"
    },
    de: {
      appName: "Pandoras Büchse",
      vaultSubtitle: "Lokaler Passworttresor",
      metaDescription: "Pandoras Büchse — verschlüsselter lokaler Passworttresor",
      authSubtitleCreate: "Konto und verschlüsselten Tresor anlegen",
      authSubtitleUnlock: "Mit E-Mail und Passwort anmelden",
      authLogin: "E-Mail",
      authLoginPlaceholder: "du@example.com",
      authPassword: "Passwort",
      authHint: "Mind. 6 Zeichen. Tresor wird in diesem Browser verschlüsselt.",
      authCreate: "Registrieren",
      authUnlock: "Anmelden",
      authTogglePw: "Ein- oder ausblenden",
      errorLoginRequired: "E-Mail eingeben.",
      errorPasswordShort: "Mind. 6 Zeichen.",
      errorLoginMismatch: "E-Mail stimmt nicht mit diesem Tresor überein.",
      errorCreateFailed: "Konto oder Tresor konnte nicht erstellt werden.",
      errorBadPassword: "Falsches Passwort oder beschädigter Tresor.",
      export: "Export",
      import: "Import",
      lock: "Sperren",
      search: "Suchen",
      searchPlaceholder: "Dienst, Tag, E-Mail suchen…",
      addEntry: "Eintrag hinzufügen",
      emptyState: "Noch keine Einträge. Ersten hinzufügen (＋).",
      edit: "Bearbeiten",
      copyEmail: "E-Mail",
      copyPhone: "Tel",
      copyPassword: "Passwort",
      copyUrl: "URL",
      copied: "Kopiert: {label}",
      copyFailed: "Kopieren fehlgeschlagen",
      labelEmail: "E-Mail",
      labelPhone: "Telefon",
      labelPassword: "Passwort",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "Neuer Eintrag",
      editEntry: "Eintrag bearbeiten",
      close: "Schließen",
      service: "Dienstname *",
      servicePlaceholder: "z. B. Gmail, Netflix",
      email: "Login-E-Mail",
      emailPlaceholder: "login@example.com",
      phone: "Login-Telefon",
      phonePlaceholder: "+49 …",
      password: "Passwort",
      passwordOptional: "optional",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Projekt-Tag",
      tagPlaceholder: "z. B. Arbeit, privat",
      notes: "Notizen",
      notesPlaceholder: "Zusatzinfos…",
      googleSignIn: "Login with Google",
      delete: "Löschen",
      cancel: "Abbrechen",
      save: "Speichern",
      confirmDelete: "Diesen Eintrag löschen?",
      saved: "Gespeichert",
      saveFailed: "Speichern fehlgeschlagen",
      deleted: "Gelöscht",
      deleteFailed: "Löschen fehlgeschlagen",
      noData: "Nichts zu exportieren",
      exported: "Export (verschlüsseltes JSON)",
      imported: "Importiert — mit Datei-Passwort entsperren",
      importFailed: "Import fehlgeschlagen",
      invalidFile: "Ungültige Datei",
      authSubtitleLogin: "Mit E-Mail und Passwort anmelden",
      authSubtitleRegister: "Konto erstellen",
      authSubtitleForgot: "Passwort wiederherstellen",
      authEmail: "E-Mail",
      authEmailPlaceholder: "du@example.com",
      authPhoneOptional: "Telefon (optional)",
      authPhonePlaceholder: "+49 …",
      authHintForgot: "Konto-E-Mail eingeben. Wir senden einen Reset-Link (kein SMS).",
      authSubmitLogin: "Anmelden",
      authSubmitRegister: "Konto erstellen",
      authSubmitForgot: "Reset-Link senden",
      authLinkRegister: "Konto erstellen",
      authLinkLogin: "Ich habe ein Konto / Anmelden",
      authLinkForgot: "Passwort vergessen?",
      authForgotSuccess: "Falls ein Konto existiert, wurde ein Reset-Link gesendet. Posteingang prüfen.",
      authResetVaultWarn: "Nach dem Reset: wenn der lokale Tresor nicht öffnet, „Lokalen Tresor löschen“ nutzen.",
      firebaseNotConfigured: "Firebase ist nicht konfiguriert. Web-Config in firebase-config.js einfügen (siehe FIREBASE-SETUP.md).",
      errorEmailRequired: "E-Mail eingeben.",
      errorInvalidEmail: "Gültige E-Mail-Adresse eingeben.",
      errorAuthFailed: "Falsche E-Mail oder Passwort.",
      errorEmailInUse: "Diese E-Mail ist bereits registriert.",
      errorWeakPassword: "Passwort zu schwach (mind. 6 Zeichen).",
      errorTooManyRequests: "Zu viele Versuche. Später erneut versuchen.",
      errorNetwork: "Netzwerkfehler. Verbindung prüfen.",
      authSubtitleRekey: "Lokaler Tresor — Wiederherstellung",
      authRekeyExplain: "Konto OK. Der lokale Tresor hat ein anderes Passwort (z. B. nach Reset).",
      authOldVaultPassword: "Altes Tresor-Passwort",
      authRekeyHint: "Das Passwort, mit dem der Tresor vor dem Reset geöffnet wurde.",
      authRekeySubmit: "Freischalten & Tresor aktualisieren",
      authResetLocalVault: "Lokalen Tresor löschen und eintreten",
      authResetLocalVaultConfirm: "ALLE lokalen Tresordaten auf diesem Gerät löschen? Online-Konto bleibt. Einträge auf diesem Gerät gehen verloren. Leeren Tresor mit neuem Passwort erstellen?",
      authWipeSuccess: "Lokaler Tresor gelöscht. Leerer Tresor bereit.",
      errorBadOldPassword: "Falsches altes Tresor-Passwort.",
      authRekeyCancel: "Zurück zur Anmeldung",
      errorWrongPassword: "Falsches Passwort.",

      errorUserNotFound: "Kein Konto mit dieser E-Mail.",


      authRekeyChoiceOld: "Mit altem Tresor-Passwort eintreten",



      authRekeyBack: "Zurück",




      changeLanguage: "Sprache"
    },
    ru: {
      appName: "Ящик Пандоры",
      vaultSubtitle: "Локальный сейф паролей",
      metaDescription: "Ящик Пандоры — зашифрованный локальный сейф паролей",
      authSubtitleCreate: "Создайте аккаунт и зашифрованный сейф",
      authSubtitleUnlock: "Войдите по email и паролю",
      authLogin: "Email",
      authLoginPlaceholder: "you@example.com",
      authPassword: "Пароль",
      authHint: "Не менее 6 символов. Сейф шифруется в этом браузере.",
      authCreate: "Регистрация",
      authUnlock: "Войти",
      authTogglePw: "Показать или скрыть",
      errorLoginRequired: "Введите email.",
      errorPasswordShort: "Не менее 6 символов.",
      errorLoginMismatch: "Email не совпадает с этим сейфом.",
      errorCreateFailed: "Не удалось создать аккаунт или сейф.",
      errorBadPassword: "Неверный пароль или повреждённый сейф.",
      export: "Экспорт",
      import: "Импорт",
      lock: "Заблокировать",
      search: "Поиск",
      searchPlaceholder: "Поиск сервиса, тега, почты…",
      addEntry: "Добавить запись",
      emptyState: "Пока пусто. Добавьте первую запись (＋).",
      edit: "Изменить",
      copyEmail: "Почта",
      copyPhone: "Тел",
      copyPassword: "Пароль",
      copyUrl: "URL",
      copied: "Скопировано: {label}",
      copyFailed: "Не удалось скопировать",
      labelEmail: "почта",
      labelPhone: "телефон",
      labelPassword: "пароль",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "Новая запись",
      editEntry: "Изменить запись",
      close: "Закрыть",
      service: "Название сервиса *",
      servicePlaceholder: "напр. Gmail, Netflix",
      email: "Email для входа",
      emailPlaceholder: "login@example.com",
      phone: "Телефон для входа",
      phonePlaceholder: "+7 …",
      password: "Пароль",
      passwordOptional: "необязательно",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Тег проекта",
      tagPlaceholder: "напр. работа, личное",
      notes: "Заметки",
      notesPlaceholder: "Дополнительно…",
      googleSignIn: "Вход через Google",
      delete: "Удалить",
      cancel: "Отмена",
      save: "Сохранить",
      confirmDelete: "Удалить эту запись?",
      saved: "Сохранено",
      saveFailed: "Ошибка сохранения",
      deleted: "Удалено",
      deleteFailed: "Ошибка удаления",
      noData: "Нет данных",
      exported: "Экспорт (шифрованный JSON)",
      imported: "Импортировано — откройте паролем файла",
      importFailed: "Ошибка импорта",
      invalidFile: "Неверный файл",
      authSubtitleLogin: "Войдите по email и паролю",
      authSubtitleRegister: "Создать аккаунт",
      authSubtitleForgot: "Восстановление пароля",
      authEmail: "Email",
      authEmailPlaceholder: "you@example.com",
      authPhoneOptional: "Телефон (необязательно)",
      authPhonePlaceholder: "+7 …",
      authHintForgot: "Введите email аккаунта. Отправим ссылку сброса (без SMS).",
      authSubmitLogin: "Войти",
      authSubmitRegister: "Создать аккаунт",
      authSubmitForgot: "Отправить ссылку",
      authLinkRegister: "Создать аккаунт",
      authLinkLogin: "У меня есть аккаунт / Войти",
      authLinkForgot: "Забыли пароль?",
      authForgotSuccess: "Если аккаунт существует, ссылка отправлена. Проверьте почту.",
      authResetVaultWarn: "После сброса: если локальный сейф не откроется, используйте «Удалить локальный сейф».",
      firebaseNotConfigured: "Firebase не настроен. Вставьте web-конфиг в firebase-config.js (см. FIREBASE-SETUP.md).",
      errorEmailRequired: "Введите email.",
      errorInvalidEmail: "Введите корректный email.",
      errorAuthFailed: "Неверный email или пароль.",
      errorEmailInUse: "Этот email уже зарегистрирован.",
      errorWeakPassword: "Слишком слабый пароль (мин. 6 символов).",
      errorTooManyRequests: "Слишком много попыток. Попробуйте позже.",
      errorNetwork: "Ошибка сети. Проверьте соединение.",
      authSubtitleRekey: "Восстановление локального сейфа",
      authRekeyExplain: "Аккаунт OK. Локальный сейф на другом пароле (например, после сброса).",
      authOldVaultPassword: "Старый пароль сейфа",
      authRekeyHint: "Пароль, которым открывали сейф до сброса.",
      authRekeySubmit: "Разблокировать и обновить сейф",
      authResetLocalVault: "Удалить локальный сейф и войти",
      authResetLocalVaultConfirm: "Удалить ВСЕ данные локального сейфа на этом устройстве? Онлайн-аккаунт остаётся. Записи на устройстве будут потеряны. Создать пустой сейф с новым паролем?",
      authWipeSuccess: "Локальный сейф удалён. Пустой сейф готов.",
      errorBadOldPassword: "Неверный старый пароль сейфа.",
      authRekeyCancel: "Назад ко входу",
      errorWrongPassword: "Неверный пароль.",

      errorUserNotFound: "Нет аккаунта с этим email.",


      authRekeyChoiceOld: "Войти со старым паролем сейфа",



      authRekeyBack: "Назад",




      changeLanguage: "Язык"
    },
    fr: {
      appName: "Boîte de Pandore",
      vaultSubtitle: "Coffre-fort local",
      metaDescription: "Boîte de Pandore — coffre-fort de mots de passe chiffré",
      authSubtitleCreate: "Créez un compte et un coffre chiffré",
      authSubtitleUnlock: "Connectez-vous avec e-mail et mot de passe",
      authLogin: "E-mail",
      authLoginPlaceholder: "vous@example.com",
      authPassword: "Mot de passe",
      authHint: "Min. 6 caractères. Coffre chiffré dans ce navigateur.",
      authCreate: "S'inscrire",
      authUnlock: "Se connecter",
      authTogglePw: "Afficher ou masquer",
      errorLoginRequired: "Saisissez votre e-mail.",
      errorPasswordShort: "Min. 6 caractères.",
      errorLoginMismatch: "L'e-mail ne correspond pas à ce coffre.",
      errorCreateFailed: "Impossible de créer le compte ou le coffre.",
      errorBadPassword: "Mot de passe incorrect ou coffre endommagé.",
      export: "Exporter",
      import: "Importer",
      lock: "Verrouiller",
      search: "Rechercher",
      searchPlaceholder: "Rechercher un service, tag, e-mail…",
      addEntry: "Ajouter une entrée",
      emptyState: "Aucune entrée. Ajoutez la première (＋).",
      edit: "Modifier",
      copyEmail: "E-mail",
      copyPhone: "Tél",
      copyPassword: "Mot de passe",
      copyUrl: "URL",
      copied: "Copié : {label}",
      copyFailed: "Copie impossible",
      labelEmail: "e-mail",
      labelPhone: "téléphone",
      labelPassword: "mot de passe",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "Nouvelle entrée",
      editEntry: "Modifier l'entrée",
      close: "Fermer",
      service: "Nom du service *",
      servicePlaceholder: "ex. Gmail, Netflix",
      email: "E-mail de connexion",
      emailPlaceholder: "login@example.com",
      phone: "Téléphone de connexion",
      phonePlaceholder: "+33 …",
      password: "Mot de passe",
      passwordOptional: "facultatif",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Tag projet",
      tagPlaceholder: "ex. travail, perso",
      notes: "Notes",
      notesPlaceholder: "Infos supplémentaires…",
      googleSignIn: "Connexion avec Google",
      delete: "Supprimer",
      cancel: "Annuler",
      save: "Enregistrer",
      confirmDelete: "Supprimer cette entrée ?",
      saved: "Enregistré",
      saveFailed: "Échec de l'enregistrement",
      deleted: "Supprimé",
      deleteFailed: "Échec de la suppression",
      noData: "Rien à exporter",
      exported: "Export (JSON chiffré)",
      imported: "Importé — déverrouillez avec le mot de passe du fichier",
      importFailed: "Échec de l'import",
      invalidFile: "Fichier invalide",
      authSubtitleLogin: "Connexion avec e-mail et mot de passe",
      authSubtitleRegister: "Créer un compte",
      authSubtitleForgot: "Récupération du mot de passe",
      authEmail: "E-mail",
      authEmailPlaceholder: "vous@example.com",
      authPhoneOptional: "Téléphone (facultatif)",
      authPhonePlaceholder: "+33 …",
      authHintForgot: "Saisissez l'e-mail du compte. Lien de reset (pas de SMS).",
      authSubmitLogin: "Se connecter",
      authSubmitRegister: "Créer un compte",
      authSubmitForgot: "Envoyer le lien",
      authLinkRegister: "Créer un compte",
      authLinkLogin: "J'ai un compte / Se connecter",
      authLinkForgot: "Mot de passe oublié ?",
      authForgotSuccess: "Si un compte existe, un lien a été envoyé. Vérifiez votre boîte mail.",
      authResetVaultWarn: "Après reset : si le coffre local ne s'ouvre pas, utilisez « Effacer le coffre local ».",
      firebaseNotConfigured: "Firebase n'est pas configuré. Collez la config web dans firebase-config.js (voir FIREBASE-SETUP.md).",
      errorEmailRequired: "Saisissez votre e-mail.",
      errorInvalidEmail: "Saisissez une adresse e-mail valide.",
      errorAuthFailed: "E-mail ou mot de passe incorrect.",
      errorEmailInUse: "Cet e-mail est déjà enregistré.",
      errorWeakPassword: "Mot de passe trop faible (min. 6 caractères).",
      errorTooManyRequests: "Trop de tentatives. Réessayez plus tard.",
      errorNetwork: "Erreur réseau. Vérifiez la connexion.",
      authSubtitleRekey: "Récupération du coffre local",
      authRekeyExplain: "Compte OK. Le coffre local utilise un autre mot de passe (p. ex. après reset).",
      authOldVaultPassword: "Ancien mot de passe du coffre",
      authRekeyHint: "Le mot de passe qui ouvrait ce coffre avant le reset.",
      authRekeySubmit: "Déverrouiller et mettre à jour",
      authResetLocalVault: "Effacer le coffre local et entrer",
      authResetLocalVaultConfirm: "Supprimer TOUTES les données du coffre local sur cet appareil ? Le compte en ligne reste. Les entrées sur cet appareil seront perdues. Créer un coffre vide avec le nouveau mot de passe ?",
      authWipeSuccess: "Coffre local effacé. Coffre vide prêt.",
      errorBadOldPassword: "Ancien mot de passe incorrect.",
      authRekeyCancel: "Retour à la connexion",
      errorWrongPassword: "Mot de passe incorrect.",

      errorUserNotFound: "Aucun compte avec cet e-mail.",


      authRekeyChoiceOld: "Entrer avec l'ancien mot de passe",



      authRekeyBack: "Retour",




      changeLanguage: "Langue"
    },
    it: {
      appName: "Scatola di Pandora",
      vaultSubtitle: "Cassaforte locale",
      metaDescription: "Scatola di Pandora — cassaforte password crittografata",
      authSubtitleCreate: "Crea un account e una cassaforte crittografata",
      authSubtitleUnlock: "Accedi con email e password",
      authLogin: "Email",
      authLoginPlaceholder: "tu@example.com",
      authPassword: "Password",
      authHint: "Min. 6 caratteri. Cassaforte cifrata in questo browser.",
      authCreate: "Registrati",
      authUnlock: "Accedi",
      authTogglePw: "Mostra o nascondi",
      errorLoginRequired: "Inserisci l'email.",
      errorPasswordShort: "Min. 6 caratteri.",
      errorLoginMismatch: "L'email non corrisponde a questa cassaforte.",
      errorCreateFailed: "Impossibile creare l'account o la cassaforte.",
      errorBadPassword: "Password errata o cassaforte danneggiata.",
      export: "Esporta",
      import: "Importa",
      lock: "Blocca",
      search: "Cerca",
      searchPlaceholder: "Cerca servizio, tag, e-mail…",
      addEntry: "Aggiungi voce",
      emptyState: "Nessuna voce. Aggiungi la prima (＋).",
      edit: "Modifica",
      copyEmail: "E-mail",
      copyPhone: "Tel",
      copyPassword: "Password",
      copyUrl: "URL",
      copied: "Copiato: {label}",
      copyFailed: "Copia non riuscita",
      labelEmail: "e-mail",
      labelPhone: "telefono",
      labelPassword: "password",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "Nuova voce",
      editEntry: "Modifica voce",
      close: "Chiudi",
      service: "Nome servizio *",
      servicePlaceholder: "es. Gmail, Netflix",
      email: "E-mail di accesso",
      emailPlaceholder: "login@example.com",
      phone: "Telefono di accesso",
      phonePlaceholder: "+39 …",
      password: "Password",
      passwordOptional: "opzionale",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Tag progetto",
      tagPlaceholder: "es. lavoro, privato",
      notes: "Note",
      notesPlaceholder: "Altre info…",
      googleSignIn: "Accedi con Google",
      delete: "Elimina",
      cancel: "Annulla",
      save: "Salva",
      confirmDelete: "Eliminare questa voce?",
      saved: "Salvato",
      saveFailed: "Salvataggio non riuscito",
      deleted: "Eliminato",
      deleteFailed: "Eliminazione non riuscita",
      noData: "Niente da esportare",
      exported: "Esportazione (JSON cifrato)",
      imported: "Importato — sblocca con la password del file",
      importFailed: "Importazione non riuscita",
      invalidFile: "File non valido",
      authSubtitleLogin: "Accedi con email e password",
      authSubtitleRegister: "Crea un account",
      authSubtitleForgot: "Recupero password",
      authEmail: "Email",
      authEmailPlaceholder: "tu@example.com",
      authPhoneOptional: "Telefono (opzionale)",
      authPhonePlaceholder: "+39 …",
      authHintForgot: "Inserisci l'email dell'account. Inviamo un link di reset (niente SMS).",
      authSubmitLogin: "Accedi",
      authSubmitRegister: "Crea account",
      authSubmitForgot: "Invia link di reset",
      authLinkRegister: "Crea un account",
      authLinkLogin: "Ho già un account / Accedi",
      authLinkForgot: "Password dimenticata?",
      authForgotSuccess: "Se l'account esiste, è stato inviato un link. Controlla la posta.",
      authResetVaultWarn: "Dopo il reset: se la cassaforte locale non si apre, usa «Elimina cassaforte locale».",
      firebaseNotConfigured: "Firebase non è configurato. Incolla la config web in firebase-config.js (vedi FIREBASE-SETUP.md).",
      errorEmailRequired: "Inserisci l'email.",
      errorInvalidEmail: "Inserisci un indirizzo email valido.",
      errorAuthFailed: "Email o password errati.",
      errorEmailInUse: "Questa email è già registrata.",
      errorWeakPassword: "Password troppo debole (min. 6 caratteri).",
      errorTooManyRequests: "Troppi tentativi. Riprova più tardi.",
      errorNetwork: "Errore di rete. Controlla la connessione.",
      authSubtitleRekey: "Recupero cassaforte locale",
      authRekeyExplain: "Account OK. La cassaforte locale ha una password diversa (es. dopo reset).",
      authOldVaultPassword: "Vecchia password della cassaforte",
      authRekeyHint: "La password con cui aprivi la cassaforte prima del reset.",
      authRekeySubmit: "Sblocca e aggiorna",
      authResetLocalVault: "Elimina cassaforte locale e entra",
      authResetLocalVaultConfirm: "Eliminare TUTTI i dati della cassaforte locale su questo dispositivo? L'account online resta. Le voci su questo dispositivo andranno perse. Creare una cassaforte vuota con la nuova password?",
      authWipeSuccess: "Cassaforte locale eliminata. Cassaforte vuota pronta.",
      errorBadOldPassword: "Vecchia password errata.",
      authRekeyCancel: "Torna all'accesso",
      errorWrongPassword: "Password errata.",

      errorUserNotFound: "Nessun account con questa email.",


      authRekeyChoiceOld: "Entra con la vecchia password",



      authRekeyBack: "Indietro",




      changeLanguage: "Lingua"
    },
    es: {
      appName: "Caja de Pandora",
      vaultSubtitle: "Caja fuerte local",
      metaDescription: "Caja de Pandora — caja fuerte de contraseñas cifrada",
      authSubtitleCreate: "Crea una cuenta y una caja fuerte cifrada",
      authSubtitleUnlock: "Inicia sesión con correo y contraseña",
      authLogin: "Correo",
      authLoginPlaceholder: "tu@example.com",
      authPassword: "Contraseña",
      authHint: "Mín. 6 caracteres. Caja cifrada en este navegador.",
      authCreate: "Registrarse",
      authUnlock: "Iniciar sesión",
      authTogglePw: "Mostrar u ocultar",
      errorLoginRequired: "Introduce tu correo.",
      errorPasswordShort: "Mín. 6 caracteres.",
      errorLoginMismatch: "El correo no coincide con esta caja fuerte.",
      errorCreateFailed: "No se pudo crear la cuenta o la caja fuerte.",
      errorBadPassword: "Contraseña incorrecta o caja fuerte dañada.",
      export: "Exportar",
      import: "Importar",
      lock: "Bloquear",
      search: "Buscar",
      searchPlaceholder: "Buscar servicio, etiqueta, e-mail…",
      addEntry: "Añadir entrada",
      emptyState: "Sin entradas. Añade la primera (＋).",
      edit: "Editar",
      copyEmail: "E-mail",
      copyPhone: "Tel",
      copyPassword: "Contraseña",
      copyUrl: "URL",
      copied: "Copiado: {label}",
      copyFailed: "No se pudo copiar",
      labelEmail: "e-mail",
      labelPhone: "teléfono",
      labelPassword: "contraseña",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "Nueva entrada",
      editEntry: "Editar entrada",
      close: "Cerrar",
      service: "Nombre del servicio *",
      servicePlaceholder: "p. ej. Gmail, Netflix",
      email: "E-mail de acceso",
      emailPlaceholder: "login@example.com",
      phone: "Teléfono de acceso",
      phonePlaceholder: "+34 …",
      password: "Contraseña",
      passwordOptional: "opcional",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "Etiqueta de proyecto",
      tagPlaceholder: "p. ej. trabajo, personal",
      notes: "Notas",
      notesPlaceholder: "Info extra…",
      googleSignIn: "Iniciar sesión con Google",
      delete: "Eliminar",
      cancel: "Cancelar",
      save: "Guardar",
      confirmDelete: "¿Eliminar esta entrada?",
      saved: "Guardado",
      saveFailed: "Error al guardar",
      deleted: "Eliminado",
      deleteFailed: "Error al eliminar",
      noData: "Nada que exportar",
      exported: "Exportación (JSON cifrado)",
      imported: "Importado — desbloquea con la contraseña del archivo",
      importFailed: "Error al importar",
      invalidFile: "Archivo no válido",
      authSubtitleLogin: "Inicia sesión con email y contraseña",
      authSubtitleRegister: "Crear una cuenta",
      authSubtitleForgot: "Recuperar contraseña",
      authEmail: "Email",
      authEmailPlaceholder: "tu@example.com",
      authPhoneOptional: "Teléfono (opcional)",
      authPhonePlaceholder: "+34 …",
      authHintForgot: "Introduce el email de la cuenta. Enviamos un enlace de restablecimiento (sin SMS).",
      authSubmitLogin: "Iniciar sesión",
      authSubmitRegister: "Crear cuenta",
      authSubmitForgot: "Enviar enlace",
      authLinkRegister: "Crear una cuenta",
      authLinkLogin: "Ya tengo cuenta / Iniciar sesión",
      authLinkForgot: "¿Olvidé la contraseña?",
      authForgotSuccess: "Si la cuenta existe, se envió un enlace. Revisa tu correo.",
      authResetVaultWarn: "Tras el restablecimiento: si la caja local no abre, usa «Borrar caja local».",
      firebaseNotConfigured: "Firebase no está configurado. Pega la config web en firebase-config.js (ver FIREBASE-SETUP.md).",
      errorEmailRequired: "Introduce tu correo.",
      errorInvalidEmail: "Introduce un correo válido.",
      errorAuthFailed: "Email o contraseña incorrectos.",
      errorEmailInUse: "Este correo ya está registrado.",
      errorWeakPassword: "Contraseña demasiado débil (mín. 6 caracteres).",
      errorTooManyRequests: "Demasiados intentos. Inténtalo más tarde.",
      errorNetwork: "Error de red. Comprueba la conexión.",
      authSubtitleRekey: "Recuperación de la caja local",
      authRekeyExplain: "Cuenta OK. La caja local tiene otra contraseña (p. ej. tras un restablecimiento).",
      authOldVaultPassword: "Contraseña antigua de la caja",
      authRekeyHint: "La contraseña con la que abrías la caja antes del restablecimiento.",
      authRekeySubmit: "Desbloquear y actualizar",
      authResetLocalVault: "Borrar caja local y entrar",
      authResetLocalVaultConfirm: "¿Eliminar TODOS los datos de la caja local en este dispositivo? La cuenta online permanece. Se perderán las entradas de este dispositivo. ¿Crear una caja vacía con la nueva contraseña?",
      authWipeSuccess: "Caja local borrada. Caja vacía lista.",
      errorBadOldPassword: "Contraseña antigua incorrecta.",
      authRekeyCancel: "Volver al inicio de sesión",
      errorWrongPassword: "Contraseña incorrecta.",

      errorUserNotFound: "No hay cuenta con este email.",


      authRekeyChoiceOld: "Entrar con la contraseña antigua",



      authRekeyBack: "Atrás",




      changeLanguage: "Idioma"
    },
    zh: {
      appName: "潘多拉魔盒",
      vaultSubtitle: "本地密码库",
      metaDescription: "潘多拉魔盒 — 加密的本地密码库",
      authSubtitleCreate: "创建账户和加密保险库",
      authSubtitleUnlock: "使用邮箱和密码登录",
      authLogin: "邮箱",
      authLoginPlaceholder: "you@example.com",
      authPassword: "密码",
      authHint: "至少 6 个字符。保险库在本浏览器中加密。",
      authCreate: "注册",
      authUnlock: "登录",
      authTogglePw: "显示或隐藏",
      errorLoginRequired: "请输入邮箱。",
      errorPasswordShort: "至少 6 个字符。",
      errorLoginMismatch: "邮箱与此保险库不匹配。",
      errorCreateFailed: "无法创建账户或保险库。",
      errorBadPassword: "密码错误或保险库已损坏。",
      export: "导出",
      import: "导入",
      lock: "锁定",
      search: "搜索",
      searchPlaceholder: "搜索服务、标签、邮箱…",
      addEntry: "添加条目",
      emptyState: "暂无条目。添加第一条（＋）。",
      edit: "编辑",
      copyEmail: "邮箱",
      copyPhone: "电话",
      copyPassword: "密码",
      copyUrl: "URL",
      copied: "已复制：{label}",
      copyFailed: "无法复制",
      labelEmail: "邮箱",
      labelPhone: "电话",
      labelPassword: "密码",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "新条目",
      editEntry: "编辑条目",
      close: "关闭",
      service: "服务名称 *",
      servicePlaceholder: "例如 Gmail、Netflix",
      email: "登录邮箱",
      emailPlaceholder: "login@example.com",
      phone: "登录电话",
      phonePlaceholder: "+86 …",
      password: "密码",
      passwordOptional: "可选",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "项目标签",
      tagPlaceholder: "例如 工作、私人",
      notes: "备注",
      notesPlaceholder: "补充信息…",
      googleSignIn: "使用 Google 登录",
      delete: "删除",
      cancel: "取消",
      save: "保存",
      confirmDelete: "删除此条目？",
      saved: "已保存",
      saveFailed: "保存失败",
      deleted: "已删除",
      deleteFailed: "删除失败",
      noData: "没有可导出的数据",
      exported: "导出（加密 JSON）",
      imported: "已导入 — 请用文件密码解锁",
      importFailed: "导入失败",
      invalidFile: "文件无效",
      authSubtitleLogin: "使用邮箱和密码登录",
      authSubtitleRegister: "创建账户",
      authSubtitleForgot: "找回密码",
      authEmail: "邮箱",
      authEmailPlaceholder: "you@example.com",
      authPhoneOptional: "电话（可选）",
      authPhonePlaceholder: "+86 …",
      authHintForgot: "输入账户邮箱。我们会发送重置链接（无短信）。",
      authSubmitLogin: "登录",
      authSubmitRegister: "创建账户",
      authSubmitForgot: "发送重置链接",
      authLinkRegister: "创建账户",
      authLinkLogin: "已有账户 / 登录",
      authLinkForgot: "忘记密码？",
      authForgotSuccess: "如果该邮箱有账户，已发送重置链接。请查收邮件。",
      authResetVaultWarn: "重置后：若本地保险库打不开，请使用“清除本地保险库”。",
      firebaseNotConfigured: "未配置 Firebase。请将 web 配置粘贴到 firebase-config.js（见 FIREBASE-SETUP.md）。",
      errorEmailRequired: "请输入邮箱。",
      errorInvalidEmail: "请输入有效的邮箱地址。",
      errorAuthFailed: "邮箱或密码错误。",
      errorEmailInUse: "该邮箱已注册。",
      errorWeakPassword: "密码太弱（至少 6 个字符）。",
      errorTooManyRequests: "尝试次数过多。请稍后再试。",
      errorNetwork: "网络错误。请检查连接。",
      authSubtitleRekey: "本地保险库恢复",
      authRekeyExplain: "账户正常。本地保险库使用了另一个密码（例如重置后）。",
      authOldVaultPassword: "旧保险库密码",
      authRekeyHint: "重置前用于打开此保险库的密码。",
      authRekeySubmit: "解锁并更新保险库",
      authResetLocalVault: "清除本地保险库并进入",
      authResetLocalVaultConfirm: "删除此设备上的全部本地保险库数据？在线账户保留。此设备上的条目将丢失。用新密码创建空保险库？",
      authWipeSuccess: "本地保险库已清除。空保险库已就绪。",
      errorBadOldPassword: "旧保险库密码错误。",
      authRekeyCancel: "返回登录",
      errorWrongPassword: "密码错误。",

      errorUserNotFound: "没有使用此邮箱的账户。",


      authRekeyChoiceOld: "使用旧保险库密码进入",



      authRekeyBack: "返回",




      changeLanguage: "语言"
    },
    ja: {
      appName: "パンドラの箱",
      vaultSubtitle: "ローカルパスワード保管庫",
      metaDescription: "パンドラの箱 — 暗号化されたローカルパスワード保管庫",
      authSubtitleCreate: "アカウントと暗号化保管庫を作成",
      authSubtitleUnlock: "メールとパスワードでサインイン",
      authLogin: "メール",
      authLoginPlaceholder: "you@example.com",
      authPassword: "パスワード",
      authHint: "6文字以上。保管庫はこのブラウザで暗号化されます。",
      authCreate: "登録",
      authUnlock: "サインイン",
      authTogglePw: "表示 / 非表示",
      errorLoginRequired: "メールを入力してください。",
      errorPasswordShort: "最低6文字。",
      errorLoginMismatch: "メールがこの保管庫と一致しません。",
      errorCreateFailed: "アカウントまたは保管庫を作成できませんでした。",
      errorBadPassword: "パスワードが違うか保管庫が破損しています。",
      export: "エクスポート",
      import: "インポート",
      lock: "ロック",
      search: "検索",
      searchPlaceholder: "サービス、タグ、メールを検索…",
      addEntry: "エントリを追加",
      emptyState: "まだありません。最初のエントリを追加（＋）。",
      edit: "編集",
      copyEmail: "メール",
      copyPhone: "電話",
      copyPassword: "パスワード",
      copyUrl: "URL",
      copied: "コピーしました: {label}",
      copyFailed: "コピーできませんでした",
      labelEmail: "メール",
      labelPhone: "電話",
      labelPassword: "パスワード",
      labelUrl: "URL",
      loginWithGoogle: "Login with Google",
      newEntry: "新規エントリ",
      editEntry: "エントリを編集",
      close: "閉じる",
      service: "サービス名 *",
      servicePlaceholder: "例: Gmail、Netflix",
      email: "ログイン用メール",
      emailPlaceholder: "login@example.com",
      phone: "ログイン用電話",
      phonePlaceholder: "+81 …",
      password: "パスワード",
      passwordOptional: "任意",
      url: "URL",
      urlPlaceholder: "https://",
      tag: "プロジェクトタグ",
      tagPlaceholder: "例: 仕事、プライベート",
      notes: "メモ",
      notesPlaceholder: "補足…",
      googleSignIn: "Googleでログイン",
      delete: "削除",
      cancel: "キャンセル",
      save: "保存",
      confirmDelete: "このエントリを削除しますか？",
      saved: "保存しました",
      saveFailed: "保存に失敗しました",
      deleted: "削除しました",
      deleteFailed: "削除に失敗しました",
      noData: "データがありません",
      exported: "エクスポート（暗号化JSON）",
      imported: "インポート済み — ファイルのパスワードで解除",
      importFailed: "インポートに失敗しました",
      invalidFile: "無効なファイル",
      authSubtitleLogin: "メールとパスワードでログイン",
      authSubtitleRegister: "アカウント作成",
      authSubtitleForgot: "パスワード再設定",
      authEmail: "メール",
      authEmailPlaceholder: "you@example.com",
      authPhoneOptional: "電話（任意）",
      authPhonePlaceholder: "+81 …",
      authHintForgot: "アカウントのメールを入力。再設定リンクを送ります（SMSなし）。",
      authSubmitLogin: "ログイン",
      authSubmitRegister: "アカウント作成",
      authSubmitForgot: "再設定リンクを送る",
      authLinkRegister: "アカウント作成",
      authLinkLogin: "アカウントがある / ログイン",
      authLinkForgot: "パスワードを忘れた",
      authForgotSuccess: "アカウントがあれば再設定リンクを送りました。メールを確認してください。",
      authResetVaultWarn: "再設定後：ローカル保管庫が開かない場合は「ローカル保管庫を消去」を使ってください。",
      firebaseNotConfigured: "Firebaseが未設定です。web設定をfirebase-config.jsに貼り付けてください（FIREBASE-SETUP.md参照）。",
      errorEmailRequired: "メールを入力してください。",
      errorInvalidEmail: "有効なメールアドレスを入力してください。",
      errorAuthFailed: "メールまたはパスワードが違います。",
      errorEmailInUse: "このメールは既に登録されています。",
      errorWeakPassword: "パスワードが弱すぎます（最低6文字）。",
      errorTooManyRequests: "試行回数が多すぎます。後でもう一度お試しください。",
      errorNetwork: "ネットワークエラー。接続を確認してください。",
      authSubtitleRekey: "ローカル保管庫の復旧",
      authRekeyExplain: "アカウントはOK。ローカル保管庫は別のパスワードです（再設定後など）。",
      authOldVaultPassword: "古い保管庫パスワード",
      authRekeyHint: "再設定前に保管庫を開けていたパスワード。",
      authRekeySubmit: "解除して保管庫を更新",
      authResetLocalVault: "ローカル保管庫を消去して入る",
      authResetLocalVaultConfirm: "この端末のローカル保管庫データをすべて削除しますか？オンラインアカウントは残ります。この端末のエントリは失われます。新しいパスワードで空の保管庫を作成しますか？",
      authWipeSuccess: "ローカル保管庫を消去しました。空の保管庫の準備完了。",
      errorBadOldPassword: "古い保管庫パスワードが違います。",
      authRekeyCancel: "ログインに戻る",
      errorWrongPassword: "パスワードが違います。",

      errorUserNotFound: "このメールのアカウントはありません。",


      authRekeyChoiceOld: "古い保管庫パスワードで入る",



      authRekeyBack: "戻る",




      changeLanguage: "言語"
    }
  };

  /** @type {CryptoKey|null} */
  let sessionKey = null;
  /** @type {Array<Entry>} */
  let entries = [];
  let editingId = null;
  let lang = "en";
  let pendingLogin = "";
  /** In-memory only during re-key; never written to storage. */
  let pendingNewPassword = "";
  /** @type {"login"|"register"|"forgot"|"rekey"} */
  let authMode = "login";

  /**
   * @typedef {Object} Entry
   * @property {string} id
   * @property {string} service
   * @property {string} [email]
   * @property {string} [phone]
   * @property {string} [password]
   * @property {string} [url]
   * @property {string} [tag]
   * @property {string} [notes]
   * @property {boolean} googleSignIn
   * @property {number} updatedAt
   */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const langScreen = $("#lang-screen");
  const lockScreen = $("#lock-screen");
  const vaultScreen = $("#vault-screen");
  const lockForm = $("#lock-form");
  const loginEl = $("#login");
  const passphraseEl = $("#passphrase");
  const fieldPassword = $("#field-password");
  const lockSubtitle = $("#lock-subtitle");
  const lockSubmit = $("#lock-submit");
  const lockError = $("#lock-error");
  const lockSuccess = $("#lock-success");
  const lockHint = $("#lock-hint");
  const resetWarn = $("#reset-warn");
  const firebaseBanner = $("#firebase-banner");
  const linkToRegister = $("#link-to-register");
  const linkToForgot = $("#link-to-forgot");
  const linkToLogin = $("#link-to-login");
  const rekeyPanel = $("#rekey-panel");
  const rekeyChoice = $("#rekey-choice");
  const rekeyOldForm = $("#rekey-old-form");
  const rekeyOldPassEl = $("#rekey-old-pass");
  const rekeyError = $("#rekey-error");
  const rekeySubmit = $("#rekey-submit");
  const rekeyWipe = $("#rekey-wipe");
  const rekeyCancel = $("#rekey-cancel");
  const rekeyChooseOld = $("#rekey-choose-old");
  const rekeyBack = $("#rekey-back");
  const searchEl = $("#search");
  const listEl = $("#entry-list");
  const emptyEl = $("#empty-state");
  const modal = $("#modal");
  const entryForm = $("#entry-form");
  const modalTitle = $("#modal-title");
  const btnDelete = $("#btn-delete");
  const toastEl = $("#toast");
  const importFile = $("#import-file");
  const langPopover = $("#lang-popover");
  const flagGrid = $("#flag-grid");

  function t(key, vars) {
    const dict = I18N[lang] || I18N.en;
    let s = dict[key] ?? I18N.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
    }
    return s;
  }

  function flagMarkup(code) {
    return `<span class="flag-icon">${FLAGS[code] || ""}</span>`;
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toastEl.hidden = true; }, 1800);
  }

  function uid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  function bufToB64(buf) {
    const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
    let s = "";
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function b64ToBuf(b64) {
    const s = atob(b64);
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out.buffer;
  }

  function hasVault() {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  function getMeta() {
    try {
      return JSON.parse(localStorage.getItem(META_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  function setMeta(partial) {
    const meta = { ...getMeta(), ...partial };
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    return meta;
  }

  function storedLogin() {
    const login = (getMeta().login || "").toString().trim();
    return login;
  }

  function loginsMatch(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }

  async function deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: PBKDF2_ITERS, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptPayload(key, obj) {
    const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
    const plain = new TextEncoder().encode(JSON.stringify(obj));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
    return { iv: bufToB64(iv), data: bufToB64(cipher) };
  }

  async function decryptPayload(key, ivB64, dataB64) {
    const iv = new Uint8Array(b64ToBuf(ivB64));
    const data = b64ToBuf(dataB64);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.parse(new TextDecoder().decode(plain));
  }

  async function saveVault() {
    if (!sessionKey) throw new Error("no-session");
    const meta = getMeta();
    if (!meta.salt) throw new Error("no-salt");
    if (pendingLogin && !meta.login) {
      meta.login = pendingLogin;
      setMeta({ login: pendingLogin });
    }
    const { iv, data } = await encryptPayload(sessionKey, { entries, version: 1 });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        salt: meta.salt,
        iv,
        data,
        savedAt: Date.now(),
        login: meta.login || pendingLogin || undefined
      })
    );
  }

  async function loadVault(passphrase) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no-vault");
    const blob = JSON.parse(raw);
    const salt = new Uint8Array(b64ToBuf(blob.salt));
    const key = await deriveKey(passphrase, salt);
    const payload = await decryptPayload(key, blob.iv, blob.data);
    sessionKey = key;
    entries = Array.isArray(payload.entries) ? payload.entries : [];
    const prev = getMeta();
    const login = prev.login || blob.login || "";
    setMeta({ salt: blob.salt, ...(login ? { login } : {}) });
  }

  async function createVault(passphrase, login) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
    const key = await deriveKey(passphrase, salt);
    sessionKey = key;
    entries = [];
    pendingLogin = login;
    const saltB64 = bufToB64(salt);
    setMeta({ salt: saltB64, login });
    const { iv, data } = await encryptPayload(key, { entries: [], version: 1 });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: 1, salt: saltB64, iv, data, savedAt: Date.now(), login })
    );
  }

  /** Decrypt with old passphrase, re-encrypt with new (fresh salt). Keeps entries. */
  async function rekeyVault(oldPassphrase, newPassphrase) {
    await loadVault(oldPassphrase);
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
    const key = await deriveKey(newPassphrase, salt);
    sessionKey = key;
    const saltB64 = bufToB64(salt);
    const login = pendingLogin || getMeta().login || "";
    setMeta({ salt: saltB64, ...(login ? { login } : {}) });
    await saveVault();
  }

  /** Wipe local vault ciphertext + salt; keep login meta only. */
  function wipeLocalVaultData() {
    localStorage.removeItem(STORAGE_KEY);
    const meta = getMeta();
    const next = {};
    if (meta.login) next.login = meta.login;
    localStorage.setItem(META_KEY, JSON.stringify(next));
    sessionKey = null;
    entries = [];
  }

  function clearPendingSecrets() {
    pendingNewPassword = "";
  }

  function showRekeyChoice() {
    if (rekeyChoice) rekeyChoice.hidden = false;
    if (rekeyOldForm) rekeyOldForm.hidden = true;
    if (rekeyOldPassEl) rekeyOldPassEl.value = "";
    if (rekeyError) {
      rekeyError.hidden = true;
      rekeyError.textContent = "";
    }
  }

  function showRekeyOldPassword() {
    if (rekeyChoice) rekeyChoice.hidden = true;
    if (rekeyOldForm) rekeyOldForm.hidden = false;
    if (rekeyError) {
      rekeyError.hidden = true;
      rekeyError.textContent = "";
    }
    if (rekeyOldPassEl) rekeyOldPassEl.value = "";
    setTimeout(() => rekeyOldPassEl && rekeyOldPassEl.focus(), 50);
  }

  /**
   * Firebase sign-in succeeded but local AES vault does not open with the new password.
   * Keep newPassword in memory only until rekey or wipe completes.
   */
  function enterRekeyMode(email, newPassword) {
    pendingLogin = email;
    pendingNewPassword = newPassword;
    authMode = "rekey";
    lockError.hidden = true;
    if (lockSuccess) {
      lockSuccess.hidden = true;
      lockSuccess.textContent = "";
    }
    showRekeyChoice();
    refreshLockCopy();
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.title = `${t("appName")} · Pandora's Box`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("metaDescription"));
    $$("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    $$("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    $$("[data-i18n-title]").forEach((el) => {
      el.title = t(el.getAttribute("data-i18n-title"));
    });
    refreshLockCopy();
    updateLangChips();
    highlightFlags();
    if (!modal.hidden) {
      modalTitle.textContent = editingId ? t("editEntry") : t("newEntry");
    }
    if (vaultScreen.classList.contains("active")) renderList();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setAuthMode(mode) {
    if (mode !== "rekey") clearPendingSecrets();
    authMode = mode;
    lockError.hidden = true;
    if (lockSuccess) {
      lockSuccess.hidden = true;
      lockSuccess.textContent = "";
    }
    if (rekeyError) {
      rekeyError.hidden = true;
      rekeyError.textContent = "";
    }
    if (rekeyOldPassEl && mode !== "rekey") rekeyOldPassEl.value = "";
    if (mode !== "rekey") showRekeyChoice();
    refreshLockCopy();
  }

  function refreshLockCopy() {
    const configured = isFirebaseConfigured();
    if (firebaseBanner) {
      if (!configured) {
        firebaseBanner.textContent = t("firebaseNotConfigured");
        firebaseBanner.hidden = false;
      } else {
        firebaseBanner.hidden = true;
      }
    }

    const isForgot = authMode === "forgot";
    const isRegister = authMode === "register";
    const isRekey = authMode === "rekey";

    if (lockForm) lockForm.hidden = isRekey;
    if (rekeyPanel) rekeyPanel.hidden = !isRekey;

    if (fieldPassword) fieldPassword.hidden = isForgot || isRekey;
    if (resetWarn) resetWarn.hidden = !isForgot || isRekey;

    if (isRekey) {
      lockSubtitle.textContent = t("authSubtitleRekey");
      if (lockHint) lockHint.textContent = "";
      loginEl.required = false;
      passphraseEl.required = false;
    } else if (isForgot) {
      lockSubtitle.textContent = t("authSubtitleForgot");
      lockSubmit.textContent = t("authSubmitForgot");
      if (lockHint) lockHint.textContent = t("authHintForgot");
      passphraseEl.required = false;
      passphraseEl.value = "";
      loginEl.required = true;
    } else if (isRegister) {
      lockSubtitle.textContent = t("authSubtitleRegister");
      lockSubmit.textContent = t("authSubmitRegister");
      if (lockHint) lockHint.textContent = t("authHint");
      passphraseEl.required = true;
      passphraseEl.autocomplete = "new-password";
      passphraseEl.minLength = 6;
      loginEl.required = true;
    } else {
      lockSubtitle.textContent = t("authSubtitleLogin");
      lockSubmit.textContent = t("authSubmitLogin");
      if (lockHint) lockHint.textContent = t("authHint");
      passphraseEl.required = true;
      passphraseEl.autocomplete = "current-password";
      passphraseEl.minLength = 6;
      loginEl.required = true;
    }

    loginEl.type = "email";

    if (linkToRegister) linkToRegister.hidden = authMode !== "login";
    if (linkToForgot) linkToForgot.hidden = authMode !== "login";
    if (linkToLogin) linkToLogin.hidden = authMode === "login" || isRekey;
  }

  function updateLangChips() {
    $$("[data-current-flag]").forEach((el) => {
      el.innerHTML = flagMarkup(lang);
    });
  }

  function highlightFlags() {
    $$("[data-lang]", flagGrid).forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    $$("[data-lang]", langPopover).forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function setLang(code) {
    if (!I18N[code]) return;
    lang = code;
    localStorage.setItem(LANG_KEY, code);
    applyI18n();
  }

  function showScreen(id) {
    langScreen.classList.toggle("active", id === "lang");
    lockScreen.classList.toggle("active", id === "lock");
    vaultScreen.classList.toggle("active", id === "vault");
    closeLangPopover();
  }

  function showLang() {
    showScreen("lang");
  }

  function showLock() {
    sessionKey = null;
    entries = [];
    pendingLogin = "";
    clearPendingSecrets();
    showScreen("lock");
    closeModal();
    lockError.hidden = true;
    if (lockSuccess) {
      lockSuccess.hidden = true;
      lockSuccess.textContent = "";
    }
    if (rekeyError) {
      rekeyError.hidden = true;
      rekeyError.textContent = "";
    }
    lockForm.reset();
    if (rekeyOldPassEl) rekeyOldPassEl.value = "";
    showRekeyChoice();
    authMode = "login";
    const existing = storedLogin();
    if (existing) loginEl.value = existing;
    refreshLockCopy();
    firebaseSignOut().catch(() => {});
    setTimeout(() => (existing && authMode === "login" ? passphraseEl : loginEl).focus(), 50);
  }

  function showVault() {
    showScreen("vault");
    renderList();
    searchEl.focus();
  }

  function normalize(s) {
    return (s || "").toString().toLowerCase().trim();
  }

  function filteredEntries() {
    const q = normalize(searchEl.value);
    if (!q) return [...entries].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return entries
      .filter((e) =>
        [e.service, e.email, e.phone, e.tag, e.url, e.notes]
          .map(normalize)
          .some((x) => x.includes(q))
      )
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function copyText(text, label) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copied", { label }));
    } catch {
      toast(t("copyFailed"));
    }
  }

  function renderList() {
    const items = filteredEntries();
    listEl.innerHTML = "";
    emptyEl.hidden = items.length > 0;
    for (const e of items) {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("role", "listitem");
      const metaBits = [];
      if (e.email) metaBits.push(esc(e.email));
      if (e.phone) metaBits.push(esc(e.phone));
      card.innerHTML = `
        <div class="card-head">
          <div>
            <h3 class="card-title">${esc(e.service)}</h3>
            ${e.tag ? `<span class="card-tag">${esc(e.tag)}</span>` : ""}
            ${e.googleSignIn ? `<span class="badge-google">G Google</span>` : ""}
          </div>
          <button type="button" class="card-edit" data-edit="${esc(e.id)}" aria-label="${esc(t("edit"))}">✎</button>
        </div>
        ${metaBits.length ? `<p class="card-meta">${metaBits.join(" · ")}</p>` : `<p class="card-meta">${e.googleSignIn ? t("loginWithGoogle") : "—"}</p>`}
        <div class="copy-row">
          <button type="button" class="copy-btn" data-copy="email" ${e.email ? "" : "disabled"}>${esc(t("copyEmail"))}</button>
          <button type="button" class="copy-btn" data-copy="phone" ${e.phone ? "" : "disabled"}>${esc(t("copyPhone"))}</button>
          <button type="button" class="copy-btn" data-copy="password" ${e.password ? "" : "disabled"}>${esc(t("copyPassword"))}</button>
          <button type="button" class="copy-btn" data-copy="url" ${e.url ? "" : "disabled"}>${esc(t("copyUrl"))}</button>
        </div>
      `;
      card.querySelector("[data-edit]").addEventListener("click", () => openEdit(e.id));
      card.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const k = btn.getAttribute("data-copy");
          const labels = {
            email: t("labelEmail"),
            phone: t("labelPhone"),
            password: t("labelPassword"),
            url: t("labelUrl")
          };
          copyText(e[k], labels[k] || k);
        });
      });
      listEl.appendChild(card);
    }
  }

  function openAdd() {
    editingId = null;
    entryForm.reset();
    $("#entry-id").value = "";
    $("#f-google").checked = false;
    modalTitle.textContent = t("newEntry");
    btnDelete.hidden = true;
    modal.hidden = false;
    $("#f-service").focus();
  }

  function openEdit(id) {
    const e = entries.find((x) => x.id === id);
    if (!e) return;
    editingId = id;
    $("#entry-id").value = id;
    $("#f-service").value = e.service || "";
    $("#f-email").value = e.email || "";
    $("#f-phone").value = e.phone || "";
    $("#f-password").value = e.password || "";
    $("#f-url").value = e.url || "";
    $("#f-tag").value = e.tag || "";
    $("#f-notes").value = e.notes || "";
    $("#f-google").checked = !!e.googleSignIn;
    modalTitle.textContent = t("editEntry");
    btnDelete.hidden = false;
    modal.hidden = false;
    $("#f-service").focus();
  }

  function closeModal() {
    modal.hidden = true;
    editingId = null;
  }

  async function persistAndRender() {
    await saveVault();
    renderList();
  }

  function buildFlagButton(locale, extraClass) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = extraClass;
    btn.setAttribute("data-lang", locale.code);
    btn.setAttribute("role", "option");
    btn.innerHTML = `${flagMarkup(locale.code)}<span class="flag-name">${esc(locale.name)}</span>`;
    return btn;
  }

  function renderFlagGrid() {
    flagGrid.innerHTML = "";
    for (const loc of LOCALES) {
      const btn = buildFlagButton(loc, "flag-btn");
      btn.addEventListener("click", () => {
        setLang(loc.code);
        showLock();
      });
      flagGrid.appendChild(btn);
    }
    highlightFlags();
  }

  function renderLangPopover() {
    langPopover.innerHTML = "";
    for (const loc of LOCALES) {
      const btn = buildFlagButton(loc, "lang-pop-btn");
      btn.addEventListener("click", () => {
        setLang(loc.code);
        closeLangPopover();
      });
      langPopover.appendChild(btn);
    }
  }

  function closeLangPopover() {
    langPopover.hidden = true;
    ["lock-lang-btn", "vault-lang-btn"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("aria-expanded", "false");
    });
  }

  function openLangPopover(anchor) {
    highlightFlags();
    langPopover.hidden = false;
    const r = anchor.getBoundingClientRect();
    const pad = 8;
    const width = langPopover.offsetWidth || 196;
    let left = r.right - width;
    if (left < pad) left = pad;
    if (left + width > window.innerWidth - pad) left = window.innerWidth - width - pad;
    let top = r.bottom + 6;
    const h = langPopover.offsetHeight || 160;
    if (top + h > window.innerHeight - pad) top = Math.max(pad, r.top - h - 6);
    langPopover.style.left = `${left}px`;
    langPopover.style.right = "auto";
    langPopover.style.top = `${top}px`;
    anchor.setAttribute("aria-expanded", "true");
  }

  function toggleLangPopover(anchor) {
    const open = !langPopover.hidden && langPopover.dataset.anchor === anchor.id;
    if (open) {
      closeLangPopover();
      return;
    }
    langPopover.dataset.anchor = anchor.id;
    openLangPopover(anchor);
  }

  $$("[data-toggle-pw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $(btn.getAttribute("data-toggle-pw"));
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  function showLockError(msg) {
    lockError.textContent = msg;
    lockError.hidden = false;
    if (lockSuccess) lockSuccess.hidden = true;
  }

  function showLockSuccess(msg) {
    if (lockSuccess) {
      lockSuccess.textContent = msg;
      lockSuccess.hidden = false;
    }
    lockError.hidden = true;
  }

  /**
   * After Firebase auth succeeds:
   * - no local vault → createVault(newPassword) and enter
   * - vault exists → loadVault(newPassword); on fail → recovery (rekey or wipe)
   */
  async function enterAppAfterFirebase(email, pw) {
    pendingLogin = email;
    setMeta({ login: email });
    if (!hasVault()) {
      await createVault(pw, email);
      clearPendingSecrets();
      showVault();
      return;
    }
    try {
      await loadVault(pw);
      clearPendingSecrets();
      showVault();
    } catch {
      // Keep pw only in memory for rekey/wipe — never write it to storage
      enterRekeyMode(email, pw);
    }
  }

  lockForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    lockError.hidden = true;
    if (lockSuccess) {
      lockSuccess.hidden = true;
      lockSuccess.textContent = "";
    }

    const email = loginEl.value.trim();
    const pw = passphraseEl.value;

    if (!email) {
      showLockError(t("errorEmailRequired"));
      return;
    }
    if (!isValidEmail(email)) {
      showLockError(t("errorInvalidEmail"));
      return;
    }

    if (!isFirebaseConfigured()) {
      showLockError(t("firebaseNotConfigured"));
      return;
    }

    try {
      lockSubmit.disabled = true;

      if (authMode === "forgot") {
        await firebaseSendPasswordReset(email);
        showLockSuccess(t("authForgotSuccess"));
        return;
      }

      if (pw.length < 6) {
        showLockError(t("errorPasswordShort"));
        return;
      }

      if (authMode === "register") {
        await firebaseRegister(email, pw);
        await enterAppAfterFirebase(email, pw);
        return;
      }

      // login — Firebase first; only then touch local vault
      await firebaseSignIn(email, pw);
      await enterAppAfterFirebase(email, pw);
    } catch (err) {
      const code = (err && (err.code || err.message)) || "";
      const key = mapFirebaseError(code);
      if (authMode === "register" && (key === "errorAuthFailed" || key === "errorWrongPassword")) {
        showLockError(t("errorCreateFailed"));
      } else {
        showLockError(t(key));
      }
    } finally {
      lockSubmit.disabled = false;
      // Clear the password field always after attempt; pendingNewPassword already copied if rekey
      if (authMode !== "forgot") passphraseEl.value = "";
    }
  });

  if (linkToRegister) {
    linkToRegister.addEventListener("click", () => setAuthMode("register"));
  }
  if (linkToForgot) {
    linkToForgot.addEventListener("click", () => setAuthMode("forgot"));
  }
  if (linkToLogin) {
    linkToLogin.addEventListener("click", () => setAuthMode("login"));
  }

  function showRekeyError(msg) {
    if (!rekeyError) return;
    rekeyError.textContent = msg;
    rekeyError.hidden = false;
  }

  function setRecoveryBusy(busy) {
    if (rekeySubmit) rekeySubmit.disabled = busy;
    if (rekeyWipe) rekeyWipe.disabled = busy;
    if (rekeyChooseOld) rekeyChooseOld.disabled = busy;
    if (rekeyCancel) rekeyCancel.disabled = busy;
    if (rekeyBack) rekeyBack.disabled = busy;
  }

  if (rekeyChooseOld) {
    rekeyChooseOld.addEventListener("click", () => {
      if (authMode !== "rekey" || !pendingNewPassword) {
        showLock();
        return;
      }
      showRekeyOldPassword();
    });
  }

  if (rekeyBack) {
    rekeyBack.addEventListener("click", () => {
      showRekeyChoice();
    });
  }

  if (rekeySubmit) {
    rekeySubmit.addEventListener("click", async () => {
      if (authMode !== "rekey" || !pendingNewPassword) {
        showLock();
        return;
      }
      const oldPw = (rekeyOldPassEl && rekeyOldPassEl.value) || "";
      if (oldPw.length < 6) {
        showRekeyError(t("errorPasswordShort"));
        return;
      }
      const newPw = pendingNewPassword;
      try {
        setRecoveryBusy(true);
        if (rekeyError) rekeyError.hidden = true;
        await rekeyVault(oldPw, newPw);
        pendingLogin = pendingLogin || storedLogin() || loginEl.value.trim();
        if (pendingLogin) setMeta({ login: pendingLogin });
        clearPendingSecrets();
        if (rekeyOldPassEl) rekeyOldPassEl.value = "";
        showVault();
      } catch {
        showRekeyError(t("errorBadOldPassword"));
        if (rekeyOldPassEl) rekeyOldPassEl.value = "";
      } finally {
        setRecoveryBusy(false);
      }
    });
  }

  if (rekeyWipe) {
    rekeyWipe.addEventListener("click", async () => {
      // Snapshot secrets first — must survive even if UI state flickers
      const newPw = pendingNewPassword;
      const email = (pendingLogin || loginEl.value.trim() || storedLogin() || "").trim();
      if (authMode !== "rekey" || !newPw) {
        // Never leave user stuck: fall back to login
        showLock();
        return;
      }
      if (!confirm(t("authResetLocalVaultConfirm"))) return;
      try {
        setRecoveryBusy(true);
        if (rekeyError) rekeyError.hidden = true;
        wipeLocalVaultData();
        // createVault must succeed after wipe — retry once if needed
        try {
          await createVault(newPw, email || "user");
        } catch (e1) {
          wipeLocalVaultData();
          await createVault(newPw, email || "user");
        }
        clearPendingSecrets();
        if (rekeyOldPassEl) rekeyOldPassEl.value = "";
        toast(t("authWipeSuccess"));
        showVault();
      } catch (err) {
        // Keep pendingNewPassword so user can retry wipe — never stuck
        showRekeyError(t("errorCreateFailed"));
        showRekeyChoice();
      } finally {
        setRecoveryBusy(false);
      }
    });
  }

  if (rekeyCancel) {
    rekeyCancel.addEventListener("click", () => {
      clearPendingSecrets();
      showLock();
    });
  }

  if (rekeyOldPassEl) {
    rekeyOldPassEl.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        if (rekeySubmit) rekeySubmit.click();
      }
    });
  }

  $("#btn-lock").addEventListener("click", () => {
    showLock();
  });

  $("#btn-add").addEventListener("click", openAdd);
  searchEl.addEventListener("input", renderList);

  $$("[data-close-modal]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );

  entryForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const service = $("#f-service").value.trim();
    if (!service) return;
    const data = {
      service,
      email: $("#f-email").value.trim(),
      phone: $("#f-phone").value.trim(),
      password: $("#f-password").value,
      url: $("#f-url").value.trim(),
      tag: $("#f-tag").value.trim(),
      notes: $("#f-notes").value.trim(),
      googleSignIn: $("#f-google").checked,
      updatedAt: Date.now()
    };
    if (editingId) {
      const i = entries.findIndex((x) => x.id === editingId);
      if (i >= 0) entries[i] = { ...entries[i], ...data };
    } else {
      entries.push({ id: uid(), ...data });
    }
    try {
      await persistAndRender();
      closeModal();
      toast(t("saved"));
    } catch {
      toast(t("saveFailed"));
    }
  });

  btnDelete.addEventListener("click", async () => {
    if (!editingId) return;
    if (!confirm(t("confirmDelete"))) return;
    entries = entries.filter((x) => x.id !== editingId);
    try {
      await persistAndRender();
      closeModal();
      toast(t("deleted"));
    } catch {
      toast(t("deleteFailed"));
    }
  });

  $("#btn-export").addEventListener("click", () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      toast(t("noData"));
      return;
    }
    const blob = new Blob([raw], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pandora-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(t("exported"));
  });

  $("#btn-import").addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async () => {
    const file = importFile.files && importFile.files[0];
    importFile.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const blob = JSON.parse(text);
      if (!blob.salt || !blob.iv || !blob.data) throw new Error("invalid");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
      setMeta({ salt: blob.salt, ...(blob.login ? { login: blob.login } : { login: undefined }) });
      if (!blob.login) {
        const meta = getMeta();
        delete meta.login;
        localStorage.setItem(META_KEY, JSON.stringify(meta));
      }
      sessionKey = null;
      entries = [];
      pendingLogin = "";
      showLock();
      toast(t("imported"));
    } catch {
      toast(t("importFailed"));
    }
  });

  $("#lock-lang-btn").addEventListener("click", (ev) => {
    ev.stopPropagation();
    toggleLangPopover($("#lock-lang-btn"));
  });
  $("#vault-lang-btn").addEventListener("click", (ev) => {
    ev.stopPropagation();
    toggleLangPopover($("#vault-lang-btn"));
  });
  langPopover.addEventListener("click", (ev) => ev.stopPropagation());
  document.addEventListener("click", () => closeLangPopover());
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      if (!langPopover.hidden) closeLangPopover();
      else if (!modal.hidden) closeModal();
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").then((reg) => {
        reg.update().catch(() => {});
        if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              nw.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      }).catch(() => {});
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        // Soft hint only — avoid forced reload loops while typing passwords
      });
    });
  }

  renderFlagGrid();
  renderLangPopover();

  const storedLang = localStorage.getItem(LANG_KEY);
  if (storedLang && I18N[storedLang]) {
    lang = storedLang;
    applyI18n();
    showLock();
  } else {
    lang = "en";
    applyI18n();
    showLang();
  }
