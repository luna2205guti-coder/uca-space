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

  // 2. Estadísticas superiores
  document.querySelectorAll('.stat-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.stat;
      if (tipo === 'guardados') {
        sessionStorage.setItem('uca_space_origen', 'perfil.html');
        window.location.href = 'guardados.html';
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

  // 3. Modal reutilizable
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

  // 4. Opciones de Cuenta y ayuda
  document.querySelectorAll('.opcion-fila').forEach((btn) => {
    btn.addEventListener('click', () => {
      const accion = btn.dataset.accion;

      if (accion === 'privacidad') {
        sessionStorage.setItem('uca_space_origen', 'perfil.html');
        window.location.href = 'privacidad-condiciones.html';
        return;
      }

      if (accion === 'contrasena') {
        abrirModal({
          titulo: 'Cambiar contraseña',
          html: 'Ingresa tu nueva contraseña para actualizar el acceso a tu cuenta:<input type="password" id="input-nueva-clave" class="modal-input" placeholder="Nueva contraseña (mín. 6 caracteres)">',
          textoPrimario: 'Guardar',
          onConfirmar: () => {
            const val = document.getElementById('input-nueva-clave')?.value || '';
            if (val.length >= 6) {
              mostrarToast('Contraseña actualizada');
            } else {
              mostrarToast('Usa al menos 6 caracteres');
            }
          }
        });
        return;
      }

      if (accion === 'faq') {
        abrirModal({
          titulo: 'Preguntas frecuentes',
          html: '<strong>¿Cómo veo si una mesa está libre?</strong><br>En el Mapa del campus los puntos verdes indican espacios disponibles y los rojos zonas ocupadas.<br><br><strong>¿Cómo reporto un espacio?</strong><br>Selecciona la zona en el mapa o en resultados y envía tu actualización.',
          textoPrimario: 'Listo'
        });
        return;
      }

      if (accion === 'soporte') {
        abrirModal({
          titulo: 'Contactar soporte',
          html: 'Describe brevemente tu consulta y el equipo de UCA Space te responderá a tu correo institucional:<textarea id="input-soporte" class="modal-input" rows="3" placeholder="Escribe tu mensaje aquí..."></textarea>',
          textoPrimario: 'Enviar',
          onConfirmar: () => {
            const msg = document.getElementById('input-soporte')?.value.trim();
            if (msg) {
              mostrarToast('Mensaje enviado a soporte');
            } else {
              mostrarToast('Escribe un mensaje primero');
            }
          }
        });
      }
    });
  });

  // 5. Cerrar sesión
  document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
    abrirModal({
      titulo: 'Cerrar sesión',
      html: '¿Seguro que deseas cerrar tu sesión en UCA Space?',
      textoPrimario: 'Cerrar sesión',
      textoSecundario: 'Cancelar',
      peligro: true,
      onConfirmar: () => {
        sessionStorage.clear();
        window.location.href = '../index.html';
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