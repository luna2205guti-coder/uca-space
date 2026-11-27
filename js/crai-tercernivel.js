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
        window.location.href = 'bienvenido.html';
      }
    });
  }

  // 2. Datos por nivel (ajusta los nombres de archivo de imagen cuando subas los planos)
  const datosNiveles = {
    1: {
      tituloPlano: 'Plano nivel 1',
      tituloTarjeta: 'Nivel 1 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      imgSrc: '../img/plano-biblioteca-nivel-1.png',
      fallbacks: ['./plano-biblioteca-nivel-1.png', '../imagenes/plano-biblioteca-nivel-1.png', '../assets/plano-biblioteca-nivel-1.png']
    },
    2: {
      tituloPlano: 'Plano nivel 2',
      tituloTarjeta: 'Nivel 2 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      imgSrc: '../img/plano-biblioteca-nivel-2.png',
      fallbacks: ['./plano-biblioteca-nivel-2.png', '../imagenes/plano-biblioteca-nivel-2.png', '../assets/plano-biblioteca-nivel-2.png']
    },
    3: {
      tituloPlano: 'Plano nivel 3',
      tituloTarjeta: 'Nivel 3 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      imgSrc: '../img/plano-biblioteca-nivel-3.png',
      fallbacks: ['./plano-biblioteca-nivel-3.png', '../imagenes/plano-biblioteca-nivel-3.png', '../assets/plano-biblioteca-nivel-3.png']
    }
  };

  const botonesNivel = Array.from(document.querySelectorAll('.btn-nivel'));
  const tituloPlanoEl = document.getElementById('titulo-plano-nivel');
  const tituloTarjetaEl = document.getElementById('titulo-tarjeta-nivel');
  const descripcionTarjetaEl = document.getElementById('descripcion-tarjeta-nivel');
  const imgPlanoEl = document.getElementById('img-plano-biblioteca');

  function seleccionarNivel(nivelNum) {
    const info = datosNiveles[nivelNum] || datosNiveles[3];

    botonesNivel.forEach((btn) => {
      const esActivo = Number(btn.dataset.nivel) === Number(nivelNum);
      btn.classList.toggle('activo', esActivo);
      btn.setAttribute('aria-selected', String(esActivo));
    });

    if (tituloPlanoEl) tituloPlanoEl.textContent = info.tituloPlano;
    if (tituloTarjetaEl) tituloTarjetaEl.textContent = info.tituloTarjeta;
    if (descripcionTarjetaEl) descripcionTarjetaEl.textContent = info.descripcion;

    if (imgPlanoEl) {
      imgPlanoEl.dataset.idx = '0';
      imgPlanoEl.dataset.fallbacks = JSON.stringify(info.fallbacks);
      imgPlanoEl.alt = `${info.tituloPlano} de la Biblioteca CRAI`;
      imgPlanoEl.src = info.imgSrc;
    }
  }

  botonesNivel.forEach((btn) => {
    btn.addEventListener('click', () => {
      seleccionarNivel(Number(btn.dataset.nivel));
    });
  });

  // Nivel inicial (Nivel 3 como en la captura)
  seleccionarNivel(3);
});