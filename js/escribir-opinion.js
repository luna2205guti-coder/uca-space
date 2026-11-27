document.addEventListener('DOMContentLoaded', () => {
  // 1. Nombre del espacio a evaluar
  const nombreEspacioEl = document.getElementById('nombre-espacio');
  const params = new URLSearchParams(window.location.search);
  const espacioParam = params.get('espacio');
  const espacioStorage = sessionStorage.getItem('uca_space_espacio_opinion');
  const nombreEspacio = (espacioParam || espacioStorage || 'Área de descanso').trim();

  if (nombreEspacioEl && nombreEspacio) {
    nombreEspacioEl.textContent = nombreEspacio;
  }

  // 2. Botón regresar
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

  // 3. Estrellas interactivas (1 a 5)
  const estrellas = Array.from(document.querySelectorAll('.btn-estrella'));
  const textoCalificacion = document.getElementById('texto-calificacion');
  let calificacionActual = 0;

  function pintarEstrellas(cantidad, clase) {
    estrellas.forEach((btn) => {
      const valor = Number(btn.dataset.valor);
      btn.classList.toggle(clase, valor <= cantidad);
    });
  }

  function actualizarSeleccionEstrellas(nuevaCalificacion) {
    calificacionActual = nuevaCalificacion;
    pintarEstrellas(calificacionActual, 'activa');

    estrellas.forEach((btn) => {
      const valor = Number(btn.dataset.valor);
      btn.setAttribute('aria-checked', String(valor === calificacionActual));
    });

    if (textoCalificacion) {
      textoCalificacion.textContent = calificacionActual > 0
        ? `${calificacionActual} de ${estrellas.length} estrellas`
        : 'Selecciona de 1 a 5 estrellas';
    }
  }

  estrellas.forEach((btn) => {
    const valor = Number(btn.dataset.valor);

    btn.addEventListener('mouseenter', () => {
      pintarEstrellas(valor, 'previsualizada');
    });

    btn.addEventListener('mouseleave', () => {
      pintarEstrellas(0, 'previsualizada');
    });

    btn.addEventListener('click', () => {
      actualizarSeleccionEstrellas(valor);
    });
  });

  // 4. Envío de la opinión
  const formOpinion = document.getElementById('form-opinion');
  const textareaExperiencia = document.getElementById('textarea-experiencia');
  const mensajeError = document.getElementById('mensaje-error-opinion');
  const modalOpinion = document.getElementById('modal-opinion');
  const modalTexto = document.getElementById('modal-opinion-texto');
  const btnAceptarOpinion = document.getElementById('btn-aceptar-opinion');

  function cerrarModal() {
    modalOpinion.classList.remove('abierto');
    modalOpinion.setAttribute('aria-hidden', 'true');
  }

  formOpinion.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajeError.textContent = '';

    if (calificacionActual < 1) {
      mensajeError.textContent = 'Selecciona una calificación de 1 a 5 estrellas.';
      estrellas[0]?.focus();
      return;
    }

    const comentario = textareaExperiencia.value.trim();
    if (!comentario) {
      mensajeError.textContent = 'Escribe un breve comentario sobre tu experiencia.';
      textareaExperiencia.focus();
      return;
    }

    const opinionesGuardadas = JSON.parse(localStorage.getItem('uca_space_opiniones') || '[]');
    opinionesGuardadas.unshift({
      id: Date.now(),
      espacio: nombreEspacio,
      calificacion: calificacionActual,
      comentario,
      fecha: new Date().toISOString()
    });
    localStorage.setItem('uca_space_opiniones', JSON.stringify(opinionesGuardadas));

    modalTexto.textContent = `Tu calificación de ${calificacionActual} estrella(s) para "${nombreEspacio}" se publicó correctamente.`;
    modalOpinion.classList.add('abierto');
    modalOpinion.setAttribute('aria-hidden', 'false');

    formOpinion.reset();
    actualizarSeleccionEstrellas(0);
  });

  btnAceptarOpinion.addEventListener('click', cerrarModal);

  modalOpinion.addEventListener('click', (e) => {
    if (e.target === modalOpinion) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpinion.classList.contains('abierto')) {
      cerrarModal();
    }
  });

  // 5. Barra inferior
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

      sessionStorage.setItem('uca_space_origen', 'escribir-opinion.html');
      window.location.href = destino;
    });
  });
});