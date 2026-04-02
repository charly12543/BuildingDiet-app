// ==========================
// 🔹 CONFIGURACIÓN GLOBAL
// ==========================
const API_URL = "http://localhost:8080";


// ==========================
// 🔹 INICIALIZACIÓN
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 App iniciada");

    // Inicializa eventos o funciones necesarias
    inicializarEventos();
});


// ==========================
// 🔹 EVENTOS
// ==========================
function inicializarEventos() {
    const btnPDF = document.getElementById("btn-pdf");

    if (btnPDF) {
        btnPDF.addEventListener("click", generarPDF);
    }
}


// ==========================
// 🔹 GENERAR PDF
// ==========================
async function generarPDF() {
    try {
        const { jsPDF } = window.jspdf;

        const elemento = document.querySelector(".dieta-card");

        if (!elemento) {
            alert("No se encontró el contenido para generar PDF");
            return;
        }

        const canvas = await html2canvas(elemento, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Primera página
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Páginas extra si se necesita
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("dieta.pdf");

    } catch (error) {
        console.error("Error generando PDF:", error);
    }
}


// ==========================
// 🔹 PETICIÓN: GUARDAR PLAN
// ==========================
function guardarPlan(payload) {
    fetch(`${API_URL}/guardar-plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ Plan guardado:", data);
        alert("Plan guardado correctamente");
    })
    .catch(err => {
        console.error("❌ Error al guardar:", err);
    });
}


// ==========================
// 🔹 UTILIDAD: OBTENER HTML
// ==========================
function obtenerHTMLDieta() {
    const elemento = document.querySelector(".dieta-card");
    return elemento ? elemento.outerHTML : "";
}


// ==========================
// 🔹 UTILIDAD: OBTENER JSON
// ==========================
function obtenerJSONDieta(data) {
    // Aquí puedes transformar tu objeto si lo necesitas
    return JSON.stringify(data);
}
