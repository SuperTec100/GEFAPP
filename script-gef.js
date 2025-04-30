
import { auth, db, collection, getDocs } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("⚠️ Nenhum usuário autenticado.");
    return;
  }

  const uid = user.uid;
  console.log("✅ Usuário autenticado:", uid);

  try {
    const pacientesRef = collection(db, "users", uid, "pacientes");
    const snapshot = await getDocs(pacientesRef);

    if (snapshot.empty) {
      console.warn("⚠️ Nenhum paciente encontrado para este usuário.");
    } else {
      console.log("✅ Pacientes encontrados:");
      snapshot.forEach(doc => {
        console.log("📄", doc.id, doc.data());
      });
    }
  } catch (error) {
    if (error.code === "permission-denied") {
      console.error("❌ ERRO: Permissão negada para acessar /users/" + uid + "/pacientes");
      console.log("➡️ Verifique se as regras do Firestore estão assim:");
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /pacientes/{pacienteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
`);
    } else {
      console.error("❌ Erro desconhecido ao acessar pacientes:", error);
    }
  }
});
