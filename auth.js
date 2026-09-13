/**
 * Firebase Auth helpers (email/password + password reset).
 * Loads the Firebase JS SDK only when config is ready.
 */
import { firebaseConfig, configured } from "./firebase-config.js";

const FB_VER = "10.14.1";
const FB_APP = `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-app.js`;
const FB_AUTH = `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-auth.js`;

let _auth = null;
let _api = null;

export function isFirebaseConfigured() {
  if (!configured) return false;
  const key = (firebaseConfig && firebaseConfig.apiKey) || "";
  if (!key || key.includes("REPLACE_ME") || key.includes("YOUR_")) return false;
  const projectId = (firebaseConfig && firebaseConfig.projectId) || "";
  if (!projectId || projectId.includes("REPLACE_ME")) return false;
  return true;
}

async function ensureAuth() {
  if (!isFirebaseConfigured()) {
    const err = new Error("firebase-not-configured");
    err.code = "firebase-not-configured";
    throw err;
  }
  if (_auth && _api) return { auth: _auth, api: _api };

  const [{ initializeApp }, api] = await Promise.all([
    import(FB_APP),
    import(FB_AUTH)
  ]);
  const app = initializeApp(firebaseConfig);
  _auth = api.getAuth(app);
  _api = api;
  return { auth: _auth, api: _api };
}

export async function firebaseRegister(email, password) {
  const { auth, api } = await ensureAuth();
  return api.createUserWithEmailAndPassword(auth, email, password);
}

export async function firebaseSignIn(email, password) {
  const { auth, api } = await ensureAuth();
  return api.signInWithEmailAndPassword(auth, email, password);
}

export async function firebaseSendPasswordReset(email) {
  const { auth, api } = await ensureAuth();
  return api.sendPasswordResetEmail(auth, email);
}

export async function firebaseSignOut() {
  if (!isFirebaseConfigured()) return;
  if (!_auth) {
    try {
      await ensureAuth();
    } catch {
      return;
    }
  }
  if (!_auth || !_api) return;
  try {
    await _api.signOut(_auth);
  } catch {
    /* ignore */
  }
}

export function mapFirebaseError(code) {
  switch (code) {
    case "firebase-not-configured":
      return "firebaseNotConfigured";
    case "auth/email-already-in-use":
      return "errorEmailInUse";
    case "auth/invalid-email":
      return "errorInvalidEmail";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "errorAuthFailed";
    case "auth/weak-password":
      return "errorWeakPassword";
    case "auth/too-many-requests":
      return "errorTooManyRequests";
    case "auth/network-request-failed":
      return "errorNetwork";
    default:
      return "errorAuthFailed";
  }
}
