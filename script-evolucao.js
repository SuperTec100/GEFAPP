// script-evolucao.js COMPLETO E FUNCIONAL

import { auth, db } from './firebase-config.js'; import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'; import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

let currentUser;

onAuthStateChanged(auth, async (user) => { if (!user) { alert("Usuário não autenticado."); window.location.href = "index.html"; return; } currentUser = user; await carregarDadosSalvos(); });

document.addEventListener("DOMContentLoaded", () => { const btnSalvar = document.getElementById("btnSalvarEvolucao"); if (btnSalvar) btnSalvar.addEventListener("click", salvarEvolucao); });

function coletarCampos() { const data = {};

document.querySelectorAll("input[id], textarea[id], select[id]").forEach(el => { if (el.type !== 'checkbox' && el.type !== 'radio') { data[el.id] = el.value; } });

document.querySelectorAll("input[type=radio]").forEach(el => { if (el.checked) data[el.name] = el.value; });

const checkGroups = {}; document.querySelectorAll("input[type=checkbox]").forEach(el => { if (!el.name) return; if (!checkGroups[el.name]) checkGroups[el.name] = []; if (el.checked) checkGroups[el.name].push(el.value); }); Object.assign(data, checkGroups);

document.querySelectorAll("select[name]").forEach(el => { data[el.name] = el.value; });

return data; }

async function salvarEvolucao() { const hospital = sessionStorage.getItem("evolucao.hospital"); const unidade = sessionStorage.getItem("evolucao.unidade"); const leito = sessionStorage.getItem("evolucao.leito");

if (!hospital || !unidade || !leito) { alert("Hospital, unidade ou leito não selecionado."); return; }

const docRef = doc(db, "users", currentUser.uid, "pacientes", ${hospital}_${unidade}_${leito}); const dados = coletarCampos();

try { await setDoc(docRef, { hospital, unidade, leito, ...dados }); alert("Evolução salva com sucesso."); } catch (error) { console.error("Erro ao salvar evolução:", error); alert("Erro ao salvar evolução."); } }

async function carregarDadosSalvos() { const hospital = sessionStorage.getItem("evolucao.hospital"); const unidade = sessionStorage.getItem("evolucao.unidade"); const leito = sessionStorage.getItem("evolucao.leito");

if (!hospital || !unidade || !leito) return;

const docRef = doc(db, "users", currentUser.uid, "pacientes", ${hospital}_${unidade}_${leito}); const snap = await getDoc(docRef);

if (!snap.exists()) return; const data = snap.data();

Object.entries(data).forEach(([key, value]) => { const el = document.getElementById(key); if (el && el.type !== 'radio' && el.type !== 'checkbox') el.value = value;

const radios = document.querySelectorAll(`input[type=radio][name="${key}"]`);
radios.forEach(r => {
  if (r.value === value) {
    r.checked = true;
    r.dispatchEvent(new Event('click'));
  }
});

if (Array.isArray(value)) {
  value.forEach(v => {
    const cbs = document.querySelectorAll(`input[type=checkbox][name="${key}"][value="${v}"]`);
    cbs.forEach(cb => cb.checked = true);
  });
}

const selects = document.querySelectorAll(`select[name="${key}"]`);
selects.forEach(s => s.value = value);

}); }

