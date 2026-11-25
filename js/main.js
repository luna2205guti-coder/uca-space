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