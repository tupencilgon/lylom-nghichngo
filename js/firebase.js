// ═══════════════════════════════════════════════
// FIREBASE.JS — Firestore + Cloudinary (no Storage)
// Lỳ Lợm & Nghịch Ngợm
// ═══════════════════════════════════════════════

// ── 1. FIREBASE CONFIG ──────────────────────────
// Vào console.firebase.google.com → Project settings → copy vào đây
const firebaseConfig = {
  apiKey: "AIzaSyAeta2OpaREqXxqbf2-NQd1MMgP-SbotYc",
  authDomain: "lylom-nghichngom.firebaseapp.com",
  projectId: "lylom-nghichngom",
  messagingSenderId: "270721069522",
  appId: "1:270721069522:web:7e6ef1f8e6133b5667180b",
};

// ── 2. CLOUDINARY CONFIG ────────────────────────
// Vào cloudinary.com → Dashboard → copy 3 thứ này
const CLOUDINARY = {
  cloudName: "dimpfrkgf",       // vd: "lylom-nghichngo"
  uploadPreset: "lylom_upload", // tạo ở bước hướng dẫn bên dưới
};
// LƯU Ý: Không cần API Key/Secret ở frontend — chỉ cần cloudName + uploadPreset

// ── INIT FIREBASE ────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app  = initializeApp(FIREBASE_CONFIG);
const db   = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ── CHỈ 2 EMAIL NÀY ĐƯỢC UPLOAD ─────────────────
// Điền email Google thật của Lỳ Lợm & Nghịch Ngợm vào đây
const ALLOWED_EMAILS = [
  "lylomemail@gmail.com",
  "nghichngomemail@gmail.com",
];

// ── AUTH ─────────────────────────────────────────
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const email = result.user.email;
  if (!ALLOWED_EMAILS.includes(email)) {
    await signOut(auth);
    throw new Error("EMAIL_NOT_ALLOWED");
  }
  return result;
}

export async function logout() {
  return signOut(auth);
}
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── UPLOAD ẢNH (Cloudinary → Firestore) ─────────
/**
 * uploadPhoto(file, meta, onProgress)
 * meta: { caption, date, tags, uploadedBy }
 * onProgress: (percent 0-100) => {}
 */
export async function uploadPhoto(file, meta, onProgress) {
  // 1. Upload file lên Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY.uploadPreset);
  formData.append('folder', 'lylom-nghichngo');

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`;

  // Dùng XHR để có progress
  const cloudinaryResult = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) onProgress && onProgress(Math.round(e.loaded / e.total * 90));
    });
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
      else reject(new Error('Cloudinary upload failed: ' + xhr.responseText));
    });
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.open('POST', cloudinaryUrl);
    xhr.send(formData);
  });

  onProgress && onProgress(95);

  // 2. Lưu metadata vào Firestore
  const docRef = await addDoc(collection(db, 'photos'), {
    url:          cloudinaryResult.secure_url,
    publicId:     cloudinaryResult.public_id,  // dùng để xoá sau này
    width:        cloudinaryResult.width,
    height:       cloudinaryResult.height,
    caption:      meta.caption || '',
    date:         Timestamp.fromDate(new Date(meta.date)),
    tags:         meta.tags || [],
    uploadedBy:   meta.uploadedBy || '',
    createdAt:    Timestamp.now()
  });

  onProgress && onProgress(100);
  return { id: docRef.id, url: cloudinaryResult.secure_url, ...meta };
}

// ── LẤY ẢNH ─────────────────────────────────────
export async function getPhotos(filters = {}) {
  const q    = query(collection(db, 'photos'), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  let photos = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    date: d.data().date.toDate()
  }));
  if (filters.year)            photos = photos.filter(p => p.date.getFullYear() === filters.year);
  if (filters.month !== undefined) photos = photos.filter(p => p.date.getMonth() === filters.month);
  if (filters.tag)             photos = photos.filter(p => p.tags?.includes(filters.tag));
  return photos;
}

// ── XOÁ ẢNH ─────────────────────────────────────
// Xoá Firestore doc (Cloudinary cần xoá qua server/API riêng nếu cần)
export async function deletePhoto(photoId) {
  await deleteDoc(doc(db, 'photos', photoId));
}

// ── MILESTONES ───────────────────────────────────
export async function getMilestones() {
  const snap = await getDocs(query(collection(db, 'milestones'), orderBy('date', 'asc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date.toDate() }));
}
export async function addMilestone(data) {
  return addDoc(collection(db, 'milestones'), {
    ...data,
    date:      Timestamp.fromDate(new Date(data.date)),
    createdAt: Timestamp.now()
  });
}

export { db, auth };
