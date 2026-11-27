// ===== Mostrar u ocultar contraseña =====
document.querySelectorAll("[data-mostrar]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const campo = document.getElementById(boton.dataset.mostrar);
    campo.type = campo.type === "password" ? "text" : "password";
  });
});

// ===== Validar que las contraseñas coincidan =====
const confirmar = document.getElementById("confirmar");
const contrasena = document.getElementById("contrasena");

if (confirmar && contrasena) {
  confirmar.addEventListener("input", () => {
    const coinciden = confirmar.value === contrasena.value;
    confirmar.setCustomValidity(coinciden ? "" : "Las contraseñas no coinciden");
  });
}

// ===== Detalle: contador de sillas dañadas =====
const salida = document.getElementById("contador-sillas");
document.querySelectorAll("[data-contar]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const nuevo = Number(salida.textContent) + Number(boton.dataset.contar);
    salida.textContent = Math.max(0, nuevo);
  });
});

// ===== Detalle: "Me siento aquí" cambia el estado a Ocupado =====
const botonAqui = document.getElementById("boton-aqui");
const estado = document.querySelector(".estado");
if (botonAqui && estado) {
  botonAqui.addEventListener("click", () => {
    estado.textContent = "Ocupado";
    estado.classList.replace("estado--libre", "estado--ocupado");
    botonAqui.textContent = "Ya estás sentado aquí";
    botonAqui.disabled = true;
  });
}

// ===== Detalle: confirmar reporte =====
const botonReportar = document.getElementById("boton-reportar");
if (botonReportar) {
  botonReportar.addEventListener("click", () => {
    botonReportar.textContent = "Reportado ✓";
    botonReportar.disabled = true;
  });
}