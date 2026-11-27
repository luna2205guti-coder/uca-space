// ===== Contactar soporte: nombre del archivo adjunto =====
const entradaFoto = document.getElementById("foto");
const textoFoto = document.getElementById("texto-foto");

if (entradaFoto) {
  entradaFoto.addEventListener("change", () => {
    textoFoto.textContent = entradaFoto.files.length
      ? entradaFoto.files[0].name
      : "Toca para adjuntar una imagen";
  });
}

// ===== Contactar soporte: confirmar envío =====
const formulario = document.getElementById("formulario-soporte");

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const boton = formulario.querySelector(".soporte__boton");
    boton.textContent = "Mensaje enviado ✓";
    boton.disabled = true;
  });
}