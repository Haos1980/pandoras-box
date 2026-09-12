(() => {
  "use strict";

  const STORAGE_KEY = "pandora.vault.v1";
  const META_KEY = "pandora.meta.v1";
  const PBKDF2_ITERS = 210000;
  const SALT_LEN = 16;
  const IV_LEN = 12;

  /** @type {CryptoKey|null} */
  let sessionKey = null;
  /** @type {Array<Entry>} */
  let entries = [];
  let editingId = null;

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

  const lockScreen = $("#lock-screen");
  const vaultScreen = $("#vault-screen");
  const lockForm = $("#lock-form");
  const passphraseEl = $("#passphrase");
  const confirmWrap = $("#passphrase-confirm-wrap");
  const confirmEl = $("#passphrase-confirm");
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
    if (!sessionKey) throw new Error("Brak klucza sesji");
    const meta = JSON.parse(localStorage.getItem(META_KEY) || "{}");
    if (!meta.salt) throw new Error("Brak soli");
    const { iv, data } = await encryptPayload(sessionKey, { entries, version: 1 });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: 1, salt: meta.salt, iv, data, savedAt: Date.now() })
    );
  }

  async function loadVault(passphrase) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("Brak sejfu");
    const blob = JSON.parse(raw);
    const salt = new Uint8Array(b64ToBuf(blob.salt));
    const key = await deriveKey(passphrase, salt);
    const payload = await decryptPayload(key, blob.iv, blob.data);
    sessionKey = key;
    entries = Array.isArray(payload.entries) ? payload.entries : [];
    localStorage.setItem(META_KEY, JSON.stringify({ salt: blob.salt }));
  }

  async function createVault(passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
    const key = await deriveKey(passphrase, salt);
    sessionKey = key;
    entries = [];
    const saltB64 = bufToB64(salt);
    localStorage.setItem(META_KEY, JSON.stringify({ salt: saltB64 }));
    const { iv, data } = await encryptPayload(key, { entries: [], version: 1 });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: 1, salt: saltB64, iv, data, savedAt: Date.now() })
    );
  }

  function showLock(setup) {
    sessionKey = null;
    entries = [];
    lockScreen.classList.add("active");
    vaultScreen.classList.remove("active");
    closeModal();
    lockError.hidden = true;
    lockForm.reset();
    if (setup) {
      confirmWrap.hidden = false;
      confirmEl.required = true;
      lockSubtitle.textContent = "Ustaw hasło główne, aby utworzyć sejf";
      lockSubmit.textContent = "Utwórz sejf";
    } else {
      confirmWrap.hidden = true;
      confirmEl.required = false;
      lockSubtitle.textContent = "Wpisz hasło główne, aby odblokować";
      lockSubmit.textContent = "Odblokuj";
    }
    setTimeout(() => passphraseEl.focus(), 50);
  }

  function showVault() {
    lockScreen.classList.remove("active");
    vaultScreen.classList.add("active");
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
          .some((t) => t.includes(q))
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
      toast(`Skopiowano: ${label}`);
    } catch {
      toast("Nie udało się skopiować");
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
          <button type="button" class="card-edit" data-edit="${esc(e.id)}" aria-label="Edytuj">✎</button>
        </div>
        ${metaBits.length ? `<p class="card-meta">${metaBits.join(" · ")}</p>` : `<p class="card-meta">${e.googleSignIn ? "Login with Google" : "—"}</p>`}
        <div class="copy-row">
          <button type="button" class="copy-btn" data-copy="email" ${e.email ? "" : "disabled"}>E-mail</button>
          <button type="button" class="copy-btn" data-copy="phone" ${e.phone ? "" : "disabled"}>Tel</button>
          <button type="button" class="copy-btn" data-copy="password" ${e.password ? "" : "disabled"}>Hasło</button>
          <button type="button" class="copy-btn" data-copy="url" ${e.url ? "" : "disabled"}>URL</button>
        </div>
      `;
      card.querySelector("[data-edit]").addEventListener("click", () => openEdit(e.id));
      card.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const k = btn.getAttribute("data-copy");
          const labels = { email: "e-mail", phone: "telefon", password: "hasło", url: "URL" };
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
    modalTitle.textContent = "Nowy wpis";
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
    modalTitle.textContent = "Edytuj wpis";
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

  // --- Events ---
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
    const setup = !hasVault();
    try {
      if (setup) {
        if (pw !== confirmEl.value) {
          lockError.textContent = "Hasła się nie zgadzają.";
          lockError.hidden = false;
          return;
        }
        if (pw.length < 4) {
          lockError.textContent = "Min. 4 znaki.";
          lockError.hidden = false;
          return;
        }
        lockSubmit.disabled = true;
        await createVault(pw);
      } else {
        lockSubmit.disabled = true;
        await loadVault(pw);
      }
      showVault();
    } catch (err) {
      console.error(err);
      lockError.textContent = setup
        ? "Nie udało się utworzyć sejfu."
        : "Złe hasło lub uszkodzony sejf.";
      lockError.hidden = false;
    } finally {
      lockSubmit.disabled = false;
      passphraseEl.value = "";
      confirmEl.value = "";
    }
  });

  $("#btn-lock").addEventListener("click", () => {
    showLock(false);
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
      updatedAt: Date.now(),
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
      toast("Zapisano");
    } catch (err) {
      console.error(err);
      toast("Błąd zapisu");
    }
  });

  btnDelete.addEventListener("click", async () => {
    if (!editingId) return;
    if (!confirm("Usunąć ten wpis?")) return;
    entries = entries.filter((x) => x.id !== editingId);
    try {
      await persistAndRender();
      closeModal();
      toast("Usunięto");
    } catch (err) {
      console.error(err);
      toast("Błąd usuwania");
    }
  });

  $("#btn-export").addEventListener("click", () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      toast("Brak danych");
      return;
    }
    const blob = new Blob([raw], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pandora-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Eksport (szyfrowany JSON)");
  });

  $("#btn-import").addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async () => {
    const file = importFile.files && importFile.files[0];
    importFile.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const blob = JSON.parse(text);
      if (!blob.salt || !blob.iv || !blob.data) throw new Error("Nieprawidłowy plik");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
      localStorage.setItem(META_KEY, JSON.stringify({ salt: blob.salt }));
      sessionKey = null;
      entries = [];
      showLock(false);
      toast("Zaimportowano — odblokuj hasłem pliku");
    } catch (err) {
      console.error(err);
      toast("Błąd importu");
    }
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && !modal.hidden) closeModal();
  });

  // PWA SW
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  // Boot
  showLock(!hasVault());
})();
