document.addEventListener('DOMContentLoaded', () => {
  // 1. Cargar datos del perfil y preferencias guardadas
  const datosUsuario = JSON.parse(localStorage.getItem('uca_space_usuario') || 'null');
  const prefs = JSON.parse(localStorage.getItem('uca_space_preferencias') || '{}');

  if (datosUsuario && datosUsuario.nombre) {
    document.getElementById('perfil-nombre').textContent = datosUsuario.nombre;
    document.getElementById('avatar-inicial').textContent = datosUsuario.nombre.trim().charAt(0).toUpperCase();
  }
  if (datosUsuario && datosUsuario.correo) {
    document.getElementById('perfil-correo').textContent = datosUsuario.correo;
  }

  const selectZona = document.getElementById('select-zona');
  const toggleAvisos = document.getElementById('toggle-avisos');
  const toggleUbicacion = document.getElementById('toggle-ubicacion');

  if (prefs.zona) selectZona.value = prefs.zona;
  if (typeof prefs.avisos === 'boolean') toggleAvisos.checked = prefs.avisos;
  if (typeof prefs.ubicacion === 'boolean') toggleUbicacion.checked = prefs.ubicacion;

  // Toast informativo
  const toastEl = document.getElementById('toast-perfil');
  let toastTimer = null;

  function mostrarToast(mensaje) {
    if (!toastEl) return;
    toastEl.textContent = mensaje;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('visible');
    }, 2200);
  }

  function guardarPreferencias(mensaje) {
    localStorage.setItem('uca_space_preferencias', JSON.stringify({
      zona: selectZona.value,
      avisos: toggleAvisos.checked,
      ubicacion: toggleUbicacion.checked
    }));
    mostrarToast(mensaje);
  }

  selectZona.addEventListener('change', () => {
    const textoOpcion = selectZona.options[selectZona.selectedIndex].text;
    guardarPreferencias(`Zona preferida: ${textoOpcion}`);
  });

  toggleAvisos.addEventListener('change', () => {
    guardarPreferencias(toggleAvisos.checked ? 'Avisos de mesas activados' : 'Avisos desactivados');
  });

  toggleUbicacion.addEventListener('change', () => {
    guardarPreferencias(toggleUbicacion.checked ? 'Ubicación activada' : 'Ubicación oculta');
  });

  // 2. Modal reutilizable
  const modal = document.getElementById('modal-perfil');
  const modalTitulo = document.getElementById('modal-perfil-titulo');
  const modalContenido = document.getElementById('modal-perfil-contenido');
  const btnPrimario = document.getElementById('btn-modal-primario');
  const btnSecundario = document.getElementById('btn-modal-secundario');
  let accionConfirmarActual = null;

  function abrirModal({ titulo, html, textoPrimario = 'Aceptar', textoSecundario = 'Cerrar', peligro = false, onConfirmar = null }) {
    modalTitulo.textContent = titulo;
    modalContenido.innerHTML = html;
    btnPrimario.textContent = textoPrimario;
    btnSecundario.textContent = textoSecundario;
    btnPrimario.classList.toggle('peligro', peligro);
    accionConfirmarActual = onConfirmar;
    modal.classList.add('abierto');
    modal.setAttribute('aria-hidden', 'false');
  }

  function cerrarModal() {
    modal.classList.remove('abierto');
    modal.setAttribute('aria-hidden', 'true');
    accionConfirmarActual = null;
  }

  btnPrimario.addEventListener('click', () => {
    const fn = accionConfirmarActual;
    cerrarModal();
    if (typeof fn === 'function') fn();
  });

  btnSecundario.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('abierto')) cerrarModal();
  });

  // 3. Estadísticas superiores
  document.querySelectorAll('.stat-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.stat;
      if (tipo === 'guardados') {
        sessionStorage.setItem('uca_space_origen', 'perfil.html');
        window.location.href = 'opiniones-calificaciones.html';
      } else if (tipo === 'reportes') {
        abrirModal({
          titulo: 'Mis reportes (3)',
          html: 'Tienes 3 reportes recientes enviados sobre disponibilidad y estado de mesas en el campus.',
          textoPrimario: 'Ver en mapa',
          onConfirmar: () => {
            sessionStorage.setItem('uca_space_origen', 'perfil.html');
            window.location.href = 'mapa.html';
          }
        });
      } else if (tipo === 'opiniones') {
        abrirModal({
          titulo: 'Mis opiniones (2)',
          html: 'Has compartido 2 valoraciones sobre espacios de estudio en Biblioteca y Bosque.',
          textoPrimario: 'Entendido'
        });
      }
    });
  });

  // 4. Opciones de Cuenta y ayuda conectadas a sus respectivas pantallas
  const rutasCuentaAyuda = {
    contrasena: 'nueva-contrasena.html',
    faq: 'preguntas-frecuentes.html',
    soporte: 'soporte.html',
    privacidad: 'privacidad-condiciones.html'
  };

  document.querySelectorAll('.opcion-fila').forEach((btn) => {
    btn.addEventListener('click', () => {
      const accion = btn.dataset.accion;
      const destino = rutasCuentaAyuda[accion];
      if (!destino) return;

      sessionStorage.setItem('uca_space_origen', 'perfil.html');
      window.location.href = destino;
    });
  });

  // 5. Cerrar sesión -> inicio-sesion.html
  document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
    abrirModal({
      titulo: 'Cerrar sesión',
      html: '¿Seguro que deseas cerrar tu sesión en UCA Space?',
      textoPrimario: 'Cerrar sesión',
      textoSecundario: 'Cancelar',
      peligro: true,
      onConfirmar: () => {
        sessionStorage.clear();
        window.location.href = 'inicio-sesion.html';
      }
    });
  });

  // 6. Barra inferior
  document.querySelectorAll('.barra-inferior .nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const destino = btn.dataset.destino;
      if (destino && destino !== 'perfil.html') {
        sessionStorage.setItem('uca_space_origen', 'perfil.html');
        window.location.href = destino;
      }
    });
  });
});