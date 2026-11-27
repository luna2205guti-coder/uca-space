// ===== Mapa: filtros =====
document.querySelectorAll("button.filtro").forEach((boton) => {
  boton.addEventListener("click", () => boton.classList.toggle("activo"));
});

// ===== Mapa: zoom =====
const imagenMapa = document.getElementById("imagen-mapa");
let escala = 1;

function aplicarZoom(cambio) {
  escala = Math.min(2, Math.max(1, escala + cambio));
  imagenMapa.style.transform = `scale(${escala})`;
}

document.getElementById("acercar").addEventListener("click", () => aplicarZoom(0.25));
document.getElementById("alejar").addEventListener("click", () => aplicarZoom(-0.25));