// ==========================
// 🔹 CONFIGURACIÓN GLOBAL
// ==========================
const API_URL = "http://localhost:8080";


// ==========================
// 🔹 INICIALIZACIÓN APP
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 App iniciada");
});


// ==========================
// 🔹 DIETA PRO (LÓGICA PRINCIPAL)
// ==========================
function generarDietaPRO(datos){
  let {nombre, peso, altura, edad, objetivo, sexo, nivel, tomaWhey, fase} = datos;

  if(altura > 3) altura = altura / 100;
  if(!fase) fase = Math.floor(Math.random()*4)+1;

  let esNino = edad < 14;
  let esMujerVolumen = (sexo==="mujer" && objetivo==="volumen");

  let imc = peso / (altura * altura);
  let tipoFisico = "fit";

  if(imc >= 35) tipoFisico = "obesidad_severa";
  else if(imc >= 30) tipoFisico = "obesidad";
  else if(imc >= 25) tipoFisico = "sobrepeso";

  let bmr = 10*peso + 6.25*(altura*100) - 5*edad + (sexo==="mujer"?-161:5);
  let calorias = Math.round(bmr * 1.5);

  if(fase===2) calorias -= 100;
  if(fase===3) calorias -= 200;
  if(fase===4) calorias += (objetivo==="volumen"?300:-100);

  if(tipoFisico==="obesidad_severa") calorias -= 900;
  else if(tipoFisico==="obesidad") calorias -= 700;
  else if(tipoFisico==="sobrepeso") calorias -= 400;

  if(esMujerVolumen) calorias += 150;

  let proteFactor = 2.2;
  if(sexo==="mujer") proteFactor = 1.8;
  if(esNino) proteFactor = 1.2;

  if(nivel==="competidor"){
    proteFactor = 2.5;
    if(fase>=3) proteFactor = 2.8;
    if(fase===4) proteFactor = 3;
  }

  if(esMujerVolumen) proteFactor = 1.7;

  let proteina = Math.round(peso * proteFactor);
  let grasa = Math.round((calorias * 0.25)/9);
  let carbos = Math.round((calorias - (proteina*4 + grasa*9)) / 4);

  let comidas = [];
  let protePorComida = Math.round(proteina / 5);

  function proteFuente(){
    return `
    <strong>🥩 ${protePorComida}g proteína (elige 1 opción):</strong>
    <ul>
      <li>${Math.round(protePorComida*4)}g pechuga de pollo</li>
      <li>${Math.round(protePorComida*4)}g carne magra</li>
      <li>${Math.round(protePorComida*4 + 20)}g pescado</li>
      <li>1 lata de atún en agua</li>
      <li>5 claras + 1 huevo</li>
    </ul>`;
  }

  function random(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function desayuno(){
    let opciones = [
      {proteina:`${esNino?"2 huevos + 2 claras":"5 claras + 2 huevos"}`,carbos:"2 rebanadas pan integral",grasa:"10 almendras",extra:"1 fruta"},
      {proteina:"200g yogurt griego",carbos:"½ taza avena",grasa:"10 nueces",extra:"frutos rojos"},
      {proteina:"4 claras + 1 huevo",carbos:"2 tortillas",grasa:"¼ aguacate",extra:"verduras"}
    ];

    if(esMujerVolumen){
      opciones.push({proteina:"4 claras + 1 huevo",carbos:"½ taza avena + fruta",grasa:"10 almendras",extra:"ideal para glúteo 🍑"});
    }

    return random(opciones);
  }

  function carb(tipo){
    let base = tipo==="alto" ? "1 taza arroz" : tipo==="medio" ? "¾ taza arroz" : "½ taza arroz";

    return `
    <strong>🍚 ${base} (elige 1 opción):</strong>
    <ul>
      <li>Arroz</li>
      <li>2 tortillas</li>
      <li>1 papa</li>
      <li>1 taza camote</li>
      <li>1 taza avena</li>
      <li>1 taza puré plátano</li>
      <li>1 taza pasta</li>
    </ul>`;
  }

  function ensalada(){
    return "2 tazas verduras";
  }

  function grasaReal(){
    return random(["10 almendras","10 nueces","¼ aguacate"]);
  }

  let d = desayuno();
  comidas.push({nombre:"Desayuno", ...d});

  comidas.push({nombre:"Media mañana",proteina:proteFuente(),carbos:carb("medio"),grasa:grasaReal(),extra:ensalada()});
  comidas.push({nombre:"Comida",proteina:proteFuente(),carbos:carb("alto"),grasa:"sin grasa",extra:"verduras"});
  comidas.push({nombre:"Post-entreno",proteina:(tomaWhey?"1 scoop whey":proteFuente()),carbos:"fruta + arroz",grasa:"0",extra:"recuperación"});
  comidas.push({nombre:"Cena",proteina:proteFuente(),carbos:carb("bajo"),grasa:"¼ aguacate",extra:ensalada()});

  return {calorias:`${calorias} kcal`,proteina:`${proteina} g`,carbos:`${carbos} g`,grasa:`${grasa} g`,comidas};
}


// ==========================
// 🔹 USAR PRO (BOTÓN PRINCIPAL)
// ==========================
function usarPro(){
  let datos = {
    nombre: document.getElementById("nombreCliente").value,
    peso: parseFloat(document.getElementById("peso").value),
    altura: parseFloat(document.getElementById("altura").value),
    edad: parseFloat(document.getElementById("edad").value),
    sexo: document.getElementById("sexo").value,
    objetivo: document.getElementById("objetivo").value,
    nivel: document.getElementById("nivel").value,
    tomaWhey: document.getElementById("tomaWhey").value==="true"
  };

  if(!datos.peso || !datos.altura || !datos.edad){
    alert("Completa datos bro 🔥");
    return;
  }

  let dieta = generarDietaPRO(datos);
  mostrarDieta(dieta);
  guardarPlanBackend(datos, dieta);
}


// ==========================
// 🔹 MOSTRAR DIETA
// ==========================
function mostrarDieta(dieta){
  let html = `<div class="dieta-card">`;

  dieta.comidas.forEach(c=>{
    html += `<div class="card-meal">
      <h4>${c.nombre}</h4>
      ${c.proteina}
    </div>`;
  });

  html += `</div>`;

  document.getElementById("resultadoPRO").innerHTML = html;
}


// ==========================
// 🔹 PDF
// ==========================
async function descargarPDF(){
  const { jsPDF } = window.jspdf;
  const elemento = document.getElementById("resultadoPRO");

  const canvas = await html2canvas(elemento);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  pdf.addImage(imgData,"PNG",0,0);
  pdf.save("dieta.pdf");
}


// ==========================
// 🔹 RUTINA
// ==========================
function generarRutina(){
  document.getElementById("resultadoPRO").innerHTML = "<h2>Rutina generada 🔥</h2>";
  guardarRutinaBackend();
}


// ==========================
// 🔹 BACKEND: GUARDAR PLAN
// ==========================
async function guardarPlanBackend(datos, dieta){
  try {
    let res = await fetch(`${API_URL}/api/guardar-plan`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({cliente:datos,dieta:dieta})
    });

    let data = await res.json();
    console.log("✅ Plan guardado", data);

  } catch(e){
    console.error("❌ Error", e);
  }
}


// ==========================
// 🔹 BACKEND: GUARDAR RUTINA
// ==========================
async function guardarRutinaBackend(){
  try {
    let res = await fetch(`${API_URL}/api/guardar-rutina`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({rutina:"ok"})
    });

    let data = await res.json();
    console.log("🏋️ Rutina guardada", data);

  } catch(e){
    console.error("❌ Error rutina", e);
  }
}
