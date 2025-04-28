
import { app } from './firebase-config.js';
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const db = getFirestore(app);

async function inicializarDados() {
  try {
    // Cria Hospital Teste
    await setDoc(doc(db, "hospitais", "Hospital Teste"), {});

    // Cria Unidade dentro do Hospital
    await setDoc(doc(db, "hospitais", "Hospital Teste", "unidades", "UTI 1"), {});

    // Cria alguns Leitos na Unidade
    await setDoc(doc(db, "hospitais", "Hospital Teste", "unidades", "UTI 1", "leitos", "101"), {
      nome: "João Silva"
    });

    await setDoc(doc(db, "hospitais", "Hospital Teste", "unidades", "UTI 1", "leitos", "102"), {
      nome: "Maria Souza"
    });

    alert('Dados de teste criados com sucesso! Agora o sistema GEF deve funcionar corretamente.');
  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
    alert('Erro ao criar dados de teste. Verifique o console.');
  }
}

inicializarDados();
