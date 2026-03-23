import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm-bB0QJHW5zCR_Ay4y63p2vkv3TxjCvU",
  authDomain: "arunsbackupdata.firebaseapp.com",
  databaseURL: "https://arunsbackupdata-default-rtdb.firebaseio.com",
  projectId: "arunsbackupdata",
  storageBucket: "arunsbackupdata.firebasestorage.app",
  messagingSenderId: "194456809993",
  appId: "1:194456809993:web:613238d4983988de0c3ed8",
  measurementId: "G-JMBTWSXMP3"
};

let db;

export async function initFirebase() {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  return db;
}

export async function saveKey(key, value) {
  if (!db) return;
  await set(ref(db, 'data/' + key), value);
}

export async function loadKey(key) {
  if (!db) return null;
  const snapshot = await get(ref(db, 'data/' + key));
  return snapshot.exists() ? snapshot.val() : null;
}

export function subscribeKey(key, callback) {
  if (!db) return;
  const keyRef = ref(db, 'data/' + key);
  onValue(keyRef, (snapshot) => {
    callback(snapshot.val());
  });
}