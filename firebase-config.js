// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  setPersistence, 
  browserSessionPersistence,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-VBHoQW0b5y0lmxRkIAj-ciAbuwF3YW8",
  authDomain: "gef-app1.firebaseapp.com",
  projectId: "gef-app1",
  storageBucket: "gef-app1.appspot.com",
  messagingSenderId: "625530882269",
  appId: "1:625530882269:web:c47d79aa16508cb855b334"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configura persistência de sessão
setPersistence(auth, browserSessionPersistence)
  .then(() => console.log("Persistência de sessão configurada com sucesso"))
  .catch((error) => console.error("Erro ao configurar persistência:", error));

// Exporta todas as funcionalidades necessárias
export { 
  app,
  auth,
  db,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  // Exportações do Firestore
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc
};
