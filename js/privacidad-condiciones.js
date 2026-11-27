document.addEventListener('DOMContentLoaded', () => {
  const origenAnterior = sessionStorage.getItem('uca_space_origen') || 'perfil.html';
  const btnRegresar = document.getElementById('btn-regresar');

  btnRegresar.addEventListener('click', () => {
    window.location.href = origenAnterior;
  });

  const infoDocumentos = {
    privacidad: {
      titulo: 'Política de privacidad',
      cuerpo: 'UCA Space utiliza únicamente la información necesaria para mostrar la disponibilidad de espacios en el campus y gestionar tus preferencias dentro de la aplicación.'
    },
    terminos: {
      titulo: 'Términos y condiciones',
      cuerpo: 'El uso de UCA Space está orientado a la consulta de espacios y orientación dentro del campus universitario. Respeta las normas de cada área y los reportes activos.'
    },
    permisos: {
      titulo: 'Permisos de la aplicación',
      cuerpo: 'La aplicación puede solicitar acceso aproximado a tu ubicación dentro del campus para ayudarte a encontrar zonas cercanas. Puedes modificarlo cuando quieras.'
    },
    cuenta: {
      titulo: 'Opciones de cuenta y datos',
      cuerpo: 'Desde aquí puedes consultar el estado de tu información o solicitar apoyo para actualizar o revisar los datos asociados a tu cuenta en UCA Space.'
    }
  };

  const modal = document.getElementById('modal-detalle');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalCuerpo = document.getElementById('modal-cuerpo');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  function abrirModal(clave) {
    const info = infoDocumentos[clave];
    if (!info) return;
    modalTitulo.textContent = info.titulo;
    modalCuerpo.textContent = info.cuerpo;
    modal.classList.add('abierto');
    modal.setAttribute('aria-hidden', 'false');
  }

  function cerrarModal() {
    modal.classList.remove('abierto');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.item-documento').forEach((btn) => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.doc));
  });

  document.getElementById('btn-opciones-cuenta').addEventListener('click', () => {
    abrirModal('cuenta');
  });

  btnCerrarModal.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  document.querySelectorAll('.barra-inferior .nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const destino = btn.dataset.destino;
      if (destino) {
        sessionStorage.setItem('uca_space_origen', 'privacidad-condiciones.html');
        window.location.href = destino;
      }
    });
  });
});