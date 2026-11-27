document.addEventListener('DOMContentLoaded', () => {
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
      imgSrc: '../img/mapa-primernivel.png',
      fallbacks: ['img/mapa-primernivel.png', './mapa-primernivel.png', '../img/mapa-niveldos.png', 'img/mapa-niveldos.png']
    },
    2: {
      tituloPlano: 'Plano nivel 2',
      tituloTarjeta: 'Nivel 2 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      imgSrc: '../img/mapa-niveldos.png',
      fallbacks: ['img/mapa-niveldos.png', './mapa-niveldos.png', '../../img/mapa-niveldos.png', 'mapa-niveldos.png']
    },
    3: {
      tituloPlano: 'Plano nivel 3',
      tituloTarjeta: 'Nivel 3 - Biblioteca UCA',
      descripcion: 'Selecciona un nivel para explorar sus espacios',
      imgSrc: '../img/mapa-tercernivel.png',
      fallbacks: ['img/mapa-tercernivel.png', './mapa-tercernivel.png', '../img/mapa-niveldos.png', 'img/mapa-niveldos.png']
    }
  };

  const botonesNivel = Array.from(document.querySelectorAll('.btn-nivel'));
  const tituloPlanoEl = document.getElementById('titulo-plano-nivel');
  const tituloTarjetaEl = document.getElementById('titulo-tarjeta-nivel');
  const descripcionTarjetaEl = document.getElementById('descripcion-tarjeta-nivel');
  const imgPlanoEl = document.getElementById('img-plano-biblioteca');
  const estadoMapaEl = document.getElementById('estado-mapa');

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

    if (imgPlanoEl) {
      if (estadoMapaEl) estadoMapaEl.style.display = 'none';
      imgPlanoEl.style.display = 'block';
      imgPlanoEl.dataset.idx = '0';
      imgPlanoEl.dataset.fallbacks = JSON.stringify(cfg.fallbacks);
      imgPlanoEl.alt = `${cfg.tituloPlano} de la Biblioteca CRAI`;
      imgPlanoEl.src = cfg.imgSrc;
    }
  }

  botonesNivel.forEach((btn) => {
    btn.addEventListener('click', () => {
      actualizarNivel(Number(btn.dataset.nivel));
    });
  });

  actualizarNivel(2);
});