document.addEventListener('DOMContentLoaded', () => {
  // 1. Botón regresar
  const btnRegresar = document.getElementById('btn-regresar');
  const origenGuardado = sessionStorage.getItem('uca_space_origen');

  if (btnRegresar) {
    btnRegresar.addEventListener('click', () => {
      if (origenGuardado && origenGuardado !== window.location.pathname) {
        window.location.href = origenGuardado;
      } else if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'guardados.html';
      }
    });
  }

  // 2. Adjuntar fotografía opcional y vista previa
  const inputFoto = document.getElementById('input-foto');
  const cajaAdjuntar = document.getElementById('caja-adjuntar-foto');
  const textoAdjuntar = document.getElementById('texto-adjuntar-foto');
  const ayudaFoto = document.getElementById('ayuda-adjuntar-foto');
  const vistaPrevia = document.getElementById('vista-previa-foto');
  const imgPrevia = document.getElementById('img-previa-foto');
  const btnQuitarFoto = document.getElementById('btn-quitar-foto');
  let fotoBase64 = '';

  cajaAdjuntar.addEventListener('click', () => {
    inputFoto.click();
  });

  inputFoto.addEventListener('change', () => {
    const archivo = inputFoto.files && inputFoto.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      fotoBase64 = evento.target.result;
      imgPrevia.src = fotoBase64;
      vistaPrevia.hidden = false;
      textoAdjuntar.textContent = archivo.name;
      ayudaFoto.textContent = 'Imagen lista para enviar';
    };
    lector.readAsDataURL(archivo);
  });

  btnQuitarFoto.addEventListener('click', () => {
    inputFoto.value = '';
    fotoBase64 = '';
    imgPrevia.src = '';
    vistaPrevia.hidden = true;
    textoAdjuntar.textContent = 'Toca para adjuntar una imagen';
    ayudaFoto.textContent = 'Toca para adjuntar una imagen';
  });

  // 3. Envío y validación del formulario
  const formReporte = document.getElementById('form-reporte');
  const selectEspacio = document.getElementById('select-espacio');
  const selectProblema = document.getElementById('select-problema');
  const textareaDesc = document.getElementById('textarea-descripcion');
  const mensajeError = document.getElementById('mensaje-error');
  const modalReporte = document.getElementById('modal-reporte');
  const modalTexto = document.getElementById('modal-reporte-texto');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  function cerrarModal() {
    modalReporte.classList.remove('abierto');
    modalReporte.setAttribute('aria-hidden', 'true');
  }

  formReporte.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajeError.textContent = '';

    if (!selectEspacio.value) {
      mensajeError.textContent = 'Selecciona un espacio relacionado.';
      selectEspacio.focus();
      return;
    }

    if (!selectProblema.value) {
      mensajeError.textContent = 'Selecciona un tipo de problema.';
      selectProblema.focus();
      return;
    }

    if (!textareaDesc.value.trim()) {
      mensajeError.textContent = 'Escribe una breve descripción del problema.';
      textareaDesc.focus();
      return;
    }

    const reportesGuardados = JSON.parse(localStorage.getItem('uca_space_reportes') || '[]');
    const textoEspacio = selectEspacio.options[selectEspacio.selectedIndex].text;

    reportesGuardados.unshift({
      id: Date.now(),
      espacio: textoEspacio,
      tipoProblema: selectProblema.value,
      descripcion: textareaDesc.value.trim(),
      tieneFoto: Boolean(fotoBase64),
      fecha: new Date().toISOString()
    });
    localStorage.setItem('uca_space_reportes', JSON.stringify(reportesGuardados));

    modalTexto.textContent = `Tu reporte sobre "${selectProblema.value}" en ${textoEspacio} fue registrado.`;
    modalReporte.classList.add('abierto');
    modalReporte.setAttribute('aria-hidden', 'false');

    formReporte.reset();
    btnQuitarFoto.click();
  });

  btnCerrarModal.addEventListener('click', cerrarModal);

  modalReporte.addEventListener('click', (e) => {
    if (e.target === modalReporte) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalReporte.classList.contains('abierto')) {
      cerrarModal();
    }
  });

  // 4. Barra inferior
  document.querySelectorAll('.barra-inferior .nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const destino = btn.dataset.destino;
      if (!destino) return;

      document.querySelectorAll('.barra-inferior .nav-item').forEach((item) => {
        item.classList.remove('activo');
        item.removeAttribute('aria-current');
      });
      btn.classList.add('activo');
      btn.setAttribute('aria-current', 'page');

      sessionStorage.setItem('uca_space_origen', 'reportar-problema.html');
      window.location.href = destino;
    });
  });
});