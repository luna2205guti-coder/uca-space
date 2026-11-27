// ===== Preguntas frecuentes: buscador =====
const buscador = document.getElementById("faq-buscar");
const preguntas = document.querySelectorAll(".faq__pregunta");

if (buscador) {
  buscador.addEventListener("input", () => {
    const texto = buscador.value.trim().toLowerCase();
    preguntas.forEach((pregunta) => {
      const coincide = pregunta.textContent.toLowerCase().includes(texto);
      pregunta.hidden = !coincide;
    });
  });
}

// ===== Preguntas frecuentes: categoría activa =====
document.querySelectorAll(".faq__categoria").forEach((boton) => {
  boton.addEventListener("click", () => {
    boton.classList.toggle("faq__categoria--activa");
  });
});