document.addEventListener('DOMContentLoaded', () => {
  const svgNS = 'http://www.w3.org/2000/svg';

  function poblarMesas(grupoId, xInicial, yInicial) {
    const grupo = document.getElementById(grupoId);
    if (!grupo) return;
    grupo.innerHTML = '';

    const columnas = 3;
    const filas = 6;
    const separacionX = 21;
    const separacionY = 23;
    const tamano = 12;

    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', String(xInicial + c * separacionX));
        rect.setAttribute('y', String(yInicial + f * separacionY));
        rect.setAttribute('width', String(tamano));
        rect.setAttribute('height', String(tamano));
        rect.setAttribute('rx', '1.5');
        grupo.appendChild(rect);
      }
    }
  }

  poblarMesas('mesas-izquierda', 50, 158);
  poblarMesas('mesas-derecha', 212, 158);

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

  const configNiveles = {
    1: {
      tituloPlano: 'Plano nivel 1',
      tituloTarjeta: 'Nivel 1 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      usarVectorNivel2: false,
      imgSrc: '../img/mapa-primernivel.png'
    },
    2: {
      tituloPlano: 'Plano nivel 2',
      tituloTarjeta: 'Nivel 2 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      usarVectorNivel2: true,
      imgSrc: ''
    },
    3: {
      tituloPlano: 'Plano nivel 3',
      tituloTarjeta: 'Nivel 3 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      usarVectorNivel2: false,
      imgSrc: '../img/mapa-tercernivel.png'
    }
  };

  const botonesNivel = Array.from(document.querySelectorAll('.btn-nivel'));
  const tituloPlanoEl = document.getElementById('titulo-plano-nivel');
  const tituloTarjetaEl = document.getElementById('titulo-tarjeta-nivel');
  const descripcionTarjetaEl = document.getElementById('descripcion-tarjeta-nivel');
  const planoVectorEl = document.getElementById('plano-nivel-2');
  const imgNivelEl = document.getElementById('img-plano-nivel');

  function actualizarNivel(nivelNum) {
    const cfg = configNiveles[nivelNum] || configNiveles[2];

    botonesNivel.forEach((btn) => {
      const activo = Number(btn.dataset.nivel) === Number(nivelNum);
      btn.classList.toggle('activo', activo);
      btn.setAttribute('aria-selected', String(activo));
    });

    if (tituloPlanoEl) tituloPlanoEl.textContent = cfg.tituloPlano;
    if (tituloTarjetaEl) tituloTarjetaEl.textContent = cfg.tituloTarjeta;
    if (descripcionTarjetaEl) descripcionTarjetaEl.textContent = cfg.descripcion;

    if (cfg.usarVectorNivel2) {
      if (planoVectorEl) planoVectorEl.style.display = 'flex';
      if (imgNivelEl) imgNivelEl.style.display = 'none';
    } else {
      if (planoVectorEl) planoVectorEl.style.display = 'none';
      if (imgNivelEl) {
        imgNivelEl.style.display = 'block';
        imgNivelEl.alt = `${cfg.tituloPlano} de la Biblioteca CRAI`;
        imgNivelEl.src = cfg.imgSrc;
      }
    }
  }

  botonesNivel.forEach((btn) => {
    btn.addEventListener('click', () => {
      actualizarNivel(Number(btn.dataset.nivel));
    });
  });

  actualizarNivel(2);
});