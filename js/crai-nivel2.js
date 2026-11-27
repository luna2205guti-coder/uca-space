// ===== CRAI: cambiar de nivel =====
const botonesNivel = document.querySelectorAll(".niveles__boton");
const imagenPlano = document.getElementById("imagen-plano");
const tituloPlano = document.getElementById("titulo-plano");
const infoTitulo = document.getElementById("info-titulo");

botonesNivel.forEach((boton) => {
  boton.addEventListener("click", () => {
    const nivel = boton.dataset.nivel;

    botonesNivel.forEach((b) => b.classList.remove("niveles__boton--activo"));
    boton.classList.add("niveles__boton--activo");

    imagenPlano.src = `../img/plano-nivel-${nivel}.png`;
    imagenPlano.alt = `Plano del nivel ${nivel} de la biblioteca`;
    tituloPlano.textContent = `Plano nivel ${nivel}`;
    infoTitulo.textContent = `Nivel ${nivel} - Biblioteca UCA`;
  });
});