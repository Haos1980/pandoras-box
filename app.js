(() => {
  "use strict";

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
      authSubtitleCreate: "Create a login and password for your vault",
      authSubtitleUnlock: "Enter your login and password to unlock",
      authLogin: "Login",
      authLoginPlaceholder: "Username",
      authPassword: "Password",
      authHint: "Min. 4 characters. Encrypted in your browser (AES-GCM).",
      authCreate: "Create / Register",
      authUnlock: "Unlock",
      authTogglePw: "Show or hide",
      errorLoginRequired: "Enter a login.",
      errorPasswordShort: "At least 4 characters.",
      errorLoginMismatch: "Login does not match this vault.",
      errorCreateFailed: "Could not create the vault.",
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
      changeLanguage: "Language"
    },
    pl: {
      appName: "Puszka Pandory",
      vaultSubtitle: "Sejf haseł na urządzeniu",
      metaDescription: "Puszka Pandory — zaszyfrowany sejf haseł (PWA)",
      authSubtitleCreate: "Ustaw login i hasło, aby utworzyć sejf",
      authSubtitleUnlock: "Wpisz login i hasło, aby odblokować",
      authLogin: "Login",
      authLoginPlaceholder: "Nazwa użytkownika",
      authPassword: "Hasło",
      authHint: "Min. 4 znaki. Dane szyfrowane AES-GCM w przeglądarce.",
      authCreate: "Utwórz / Zarejestruj",
      authUnlock: "Odblokuj",
      authTogglePw: "Pokaż lub ukryj",
      errorLoginRequired: "Podaj login.",
      errorPasswordShort: "Min. 4 znaki.",
      errorLoginMismatch: "Login nie pasuje do tego sejfu.",
      errorCreateFailed: "Nie udało się utworzyć sejfu.",
      errorBadPassword: "Złe hasło lub uszkodzony sejf.",
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
      changeLanguage: "Język"
    },
    de: {
      appName: "Pandoras Büchse",
      vaultSubtitle: "Lokaler Passworttresor",
      metaDescription: "Pandoras Büchse — verschlüsselter lokaler Passworttresor",
      authSubtitleCreate: "Login und Passwort festlegen, um den Tresor anzulegen",
      authSubtitleUnlock: "Login und Passwort eingeben, um zu entsperren",
      authLogin: "Login",
      authLoginPlaceholder: "Benutzername",
      authPassword: "Passwort",
      authHint: "Mind. 4 Zeichen. Verschlüsselt im Browser (AES-GCM).",
      authCreate: "Erstellen / Registrieren",
      authUnlock: "Entsperren",
      authTogglePw: "Ein- oder ausblenden",
      errorLoginRequired: "Bitte Login eingeben.",
      errorPasswordShort: "Mindestens 4 Zeichen.",
      errorLoginMismatch: "Login passt nicht zu diesem Tresor.",
      errorCreateFailed: "Tresor konnte nicht erstellt werden.",
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
      changeLanguage: "Sprache"
    },
    ru: {
      appName: "Ящик Пандоры",
      vaultSubtitle: "Локальный сейф паролей",
      metaDescription: "Ящик Пандоры — зашифрованный локальный сейф паролей",
      authSubtitleCreate: "Задайте логин и пароль, чтобы создать сейф",
      authSubtitleUnlock: "Введите логин и пароль, чтобы открыть",
      authLogin: "Логин",
      authLoginPlaceholder: "Имя пользователя",
      authPassword: "Пароль",
      authHint: "Не менее 4 символов. Шифрование AES-GCM в браузере.",
      authCreate: "Создать / Регистрация",
      authUnlock: "Открыть",
      authTogglePw: "Показать или скрыть",
      errorLoginRequired: "Введите логин.",
      errorPasswordShort: "Не менее 4 символов.",
      errorLoginMismatch: "Логин не подходит к этому сейфу.",
      errorCreateFailed: "Не удалось создать сейф.",
      errorBadPassword: "Неверный пароль или сейф повреждён.",
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
      changeLanguage: "Язык"
    },
    fr: {
      appName: "Boîte de Pandore",
      vaultSubtitle: "Coffre-fort local",
      metaDescription: "Boîte de Pandore — coffre-fort de mots de passe chiffré",
      authSubtitleCreate: "Créez un identifiant et un mot de passe pour le coffre",
      authSubtitleUnlock: "Entrez identifiant et mot de passe pour déverrouiller",
      authLogin: "Identifiant",
      authLoginPlaceholder: "Nom d'utilisateur",
      authPassword: "Mot de passe",
      authHint: "Min. 4 caractères. Chiffré dans le navigateur (AES-GCM).",
      authCreate: "Créer / S'inscrire",
      authUnlock: "Déverrouiller",
      authTogglePw: "Afficher ou masquer",
      errorLoginRequired: "Saisissez un identifiant.",
      errorPasswordShort: "Au moins 4 caractères.",
      errorLoginMismatch: "L'identifiant ne correspond pas à ce coffre.",
      errorCreateFailed: "Impossible de créer le coffre.",
      errorBadPassword: "Mauvais mot de passe ou coffre endommagé.",
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
      changeLanguage: "Langue"
    },
    it: {
      appName: "Scatola di Pandora",
      vaultSubtitle: "Cassaforte locale",
      metaDescription: "Scatola di Pandora — cassaforte password crittografata",
      authSubtitleCreate: "Crea login e password per la cassaforte",
      authSubtitleUnlock: "Inserisci login e password per sbloccare",
      authLogin: "Login",
      authLoginPlaceholder: "Nome utente",
      authPassword: "Password",
      authHint: "Min. 4 caratteri. Crittografia AES-GCM nel browser.",
      authCreate: "Crea / Registrati",
      authUnlock: "Sblocca",
      authTogglePw: "Mostra o nascondi",
      errorLoginRequired: "Inserisci un login.",
      errorPasswordShort: "Almeno 4 caratteri.",
      errorLoginMismatch: "Il login non corrisponde a questa cassaforte.",
      errorCreateFailed: "Impossibile creare la cassaforte.",
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
      changeLanguage: "Lingua"
    },
    es: {
      appName: "Caja de Pandora",
      vaultSubtitle: "Caja fuerte local",
      metaDescription: "Caja de Pandora — caja fuerte de contraseñas cifrada",
      authSubtitleCreate: "Crea un usuario y una contraseña para la caja",
      authSubtitleUnlock: "Introduce usuario y contraseña para desbloquear",
      authLogin: "Usuario",
      authLoginPlaceholder: "Nombre de usuario",
      authPassword: "Contraseña",
      authHint: "Mín. 4 caracteres. Cifrado en el navegador (AES-GCM).",
      authCreate: "Crear / Registrarse",
      authUnlock: "Desbloquear",
      authTogglePw: "Mostrar u ocultar",
      errorLoginRequired: "Introduce un usuario.",
      errorPasswordShort: "Al menos 4 caracteres.",
      errorLoginMismatch: "El usuario no coincide con esta caja.",
      errorCreateFailed: "No se pudo crear la caja.",
      errorBadPassword: "Contraseña incorrecta o caja dañada.",
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
      changeLanguage: "Idioma"
    },
    zh: {
      appName: "潘多拉魔盒",
      vaultSubtitle: "本地密码库",
      metaDescription: "潘多拉魔盒 — 加密的本地密码库",
      authSubtitleCreate: "设置登录名和密码以创建保险库",
      authSubtitleUnlock: "输入登录名和密码以解锁",
      authLogin: "登录名",
      authLoginPlaceholder: "用户名",
      authPassword: "密码",
      authHint: "至少 4 个字符。浏览器内 AES-GCM 加密。",
      authCreate: "创建 / 注册",
      authUnlock: "解锁",
      authTogglePw: "显示或隐藏",
      errorLoginRequired: "请输入登录名。",
      errorPasswordShort: "至少 4 个字符。",
      errorLoginMismatch: "登录名与此保险库不匹配。",
      errorCreateFailed: "无法创建保险库。",
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
      changeLanguage: "语言"
    },
    ja: {
      appName: "パンドラの箱",
      vaultSubtitle: "ローカルパスワード保管庫",
      metaDescription: "パンドラの箱 — 暗号化されたローカルパスワード保管庫",
      authSubtitleCreate: "ログイン名とパスワードを設定して保管庫を作成",
      authSubtitleUnlock: "ログイン名とパスワードを入力して解除",
      authLogin: "ログイン",
      authLoginPlaceholder: "ユーザー名",
      authPassword: "パスワード",
      authHint: "4文字以上。ブラウザ内で AES-GCM 暗号化。",
      authCreate: "作成 / 登録",
      authUnlock: "ロック解除",
      authTogglePw: "表示 / 非表示",
      errorLoginRequired: "ログイン名を入力してください。",
      errorPasswordShort: "4文字以上にしてください。",
      errorLoginMismatch: "ログイン名がこの保管庫と一致しません。",
      errorCreateFailed: "保管庫を作成できませんでした。",
      errorBadPassword: "パスワードが違うか、保管庫が破損しています。",
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
  const lockSubtitle = $("#lock-subtitle");
  const lockSubmit = $("#lock-submit");
  const lockError = $("#lock-error");
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

  function refreshLockCopy() {
    const setup = !hasVault();
    lockSubtitle.textContent = setup ? t("authSubtitleCreate") : t("authSubtitleUnlock");
    lockSubmit.textContent = setup ? t("authCreate") : t("authUnlock");
    passphraseEl.autocomplete = setup ? "new-password" : "current-password";
    loginEl.required = setup || !!storedLogin();
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
    showScreen("lock");
    closeModal();
    lockError.hidden = true;
    lockForm.reset();
    const existing = storedLogin();
    if (existing) loginEl.value = existing;
    refreshLockCopy();
    setTimeout(() => (existing ? passphraseEl : loginEl).focus(), 50);
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

  lockForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    lockError.hidden = true;
    const pw = passphraseEl.value;
    const login = loginEl.value.trim();
    const setup = !hasVault();
    const expected = storedLogin();
    try {
      if (setup) {
        if (!login) {
          lockError.textContent = t("errorLoginRequired");
          lockError.hidden = false;
          return;
        }
        if (pw.length < 4) {
          lockError.textContent = t("errorPasswordShort");
          lockError.hidden = false;
          return;
        }
        lockSubmit.disabled = true;
        await createVault(pw, login);
      } else {
        if (expected && !loginsMatch(login, expected)) {
          lockError.textContent = t("errorLoginMismatch");
          lockError.hidden = false;
          return;
        }
        lockSubmit.disabled = true;
        await loadVault(pw);
        if (!expected && login) {
          pendingLogin = login;
          setMeta({ login });
        }
      }
      showVault();
    } catch {
      lockError.textContent = setup ? t("errorCreateFailed") : t("errorBadPassword");
      lockError.hidden = false;
    } finally {
      lockSubmit.disabled = false;
      passphraseEl.value = "";
    }
  });

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
      navigator.serviceWorker.register("./sw.js").catch(() => {});
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
})();
