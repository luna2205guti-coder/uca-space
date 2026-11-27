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
        window.location.href = 'mapa.html';
      }
    });
  }

  // 2. Configuración de mesas / destino
  const datosMesas = {
    B3: {
      mesa: 'Mesa B3',
      zona: 'Biblioteca',
      distancia: '≈ 128 m · 2 min a pie',
      puntosRuta: '126,220 218,220 218,96 176,96',
      x: 176,
      y: 96
    },
    B4: {
      mesa: 'Mesa B4',
      zona: 'Biblioteca',
      distancia: '≈ 140 m · 2 min a pie',
      puntosRuta: '126,220 218,220 218,86 204,86',
      x: 204,
      y: 86
    },
    B5: {
      mesa: 'Mesa B5',
      zona: 'Biblioteca',
      distancia: '≈ 152 m · 2 min a pie',
      puntosRuta: '126,220 218,220 218,108 228,108',
      x: 228,
      y: 108
    }
  };

  const params = new URLSearchParams(window.location.search);
  const mesaParam = (params.get('mesa') || sessionStorage.getItem('uca_space_mesa_destino') || 'B5').toUpperCase();
  const zonaParam = params.get('zona') || sessionStorage.getItem('uca_space_zona_destino') || 'Biblioteca';

  const tituloDestinoEl = document.getElementById('titulo-destino');
  const datoDistanciaEl = document.getElementById('dato-distancia-tiempo');
  const lineaRutaEl = document.getElementById('linea-ruta');
  const textoBadgeEl = document.getElementById('texto-badge-mesa');
  const badgeGrupoEl = document.getElementById('badge-mesa-libre');
  const pasoZonaEl = document.getElementById('paso-zona');
  const pasoMesaEl = document.getElementById('paso-mesa');

  function seleccionarDestino(codigoMesa, zonaNombre = 'Biblioteca') {
    const info = datosMesas[codigoMesa] || {
      mesa: codigoMesa || 'Mesa B5',
      zona: zonaNombre,
      distancia: '≈ 152 m · 2 min a pie',
      puntosRuta: '126,220 218,220 218,108 228,108',
      x: 228,
      y: 108
    };

    const etiquetaMesaCorta = info.mesa.replace(/^Mesa\s+/i, '');
    if (tituloDestinoEl) {
      tituloDestinoEl.textContent = `Destino: ${info.mesa} · ${info.zona}`;
    }
    if (datoDistanciaEl) {
      datoDistanciaEl.textContent = info.distancia;
    }
    if (lineaRutaEl) {
      lineaRutaEl.setAttribute('points', info.puntosRuta);
    }
    if (textoBadgeEl) {
      textoBadgeEl.textContent = `${info.mesa} · Libre`;
    }
    if (badgeGrupoEl) {
      const badgeX = Math.min(298, Math.max(140, info.x + 8));
      const badgeY = Math.max(12, info.y - 52);
      badgeGrupoEl.setAttribute('transform', `translate(${badgeX}, ${badgeY})`);
    }
    if (pasoZonaEl) {
      pasoZonaEl.textContent = `Llegarás a la zona ${info.zona}.`;
    }
    if (pasoMesaEl) {
      pasoMesaEl.textContent = `Busca la mesa ${etiquetaMesaCorta.toLowerCase()}.`;
    }
  }

  seleccionarDestino(mesaParam, zonaParam);

  document.querySelectorAll('.marcador-mesa').forEach((marcador) => {
    marcador.addEventListener('click', () => {
      const codigo = marcador.dataset.mesa;
      if (codigo) seleccionarDestino(codigo, 'Biblioteca');
    });
  });

  // 3. Botón Ocultar / Mostrar indicaciones
  const btnToggle = document.getElementById('btn-toggle-indicaciones');
  const listaIndicaciones = document.getElementById('lista-indicaciones');

  if (btnToggle && listaIndicaciones) {
    btnToggle.addEventListener('click', () => {
      const estaOculta = listaIndicaciones.classList.toggle('oculta');
      btnToggle.setAttribute('aria-expanded', String(!estaOculta));
      btnToggle.textContent = estaOculta ? 'Mostrar indicaciones' : 'Ocultar indicaciones';
    });
  }
});