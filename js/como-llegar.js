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
      distancia: '≈ 128 m · 2 min a pie'
    },
    B4: {
      mesa: 'Mesa B4',
      zona: 'Biblioteca',
      distancia: '≈ 140 m · 2 min a pie'
    },
    B5: {
      mesa: 'Mesa B5',
      zona: 'Biblioteca',
      distancia: '≈ 152 m · 2 min a pie'
    }
  };

  const params = new URLSearchParams(window.location.search);
  const mesaParam = (params.get('mesa') || sessionStorage.getItem('uca_space_mesa_destino') || 'B5').toUpperCase();
  const zonaParam = params.get('zona') || sessionStorage.getItem('uca_space_zona_destino') || 'Biblioteca';

  const tituloDestinoEl = document.getElementById('titulo-destino');
  const datoDistanciaEl = document.getElementById('dato-distancia-tiempo');
  const textoBadgeEl = document.getElementById('texto-badge-mesa');
  const pasoZonaEl = document.getElementById('paso-zona');
  const pasoMesaEl = document.getElementById('paso-mesa');
  const pinesMesa = Array.from(document.querySelectorAll('.pin-mesa'));

  function seleccionarDestino(codigoMesa, zonaNombre = 'Biblioteca') {
    const info = datosMesas[codigoMesa] || {
      mesa: codigoMesa || 'Mesa B5',
      zona: zonaNombre,
      distancia: '≈ 152 m · 2 min a pie'
    };

    const etiquetaMesaCorta = info.mesa.replace(/^Mesa\s+/i, '');
    if (tituloDestinoEl) {
      tituloDestinoEl.textContent = `Destino: ${info.mesa} · ${info.zona}`;
    }
    if (datoDistanciaEl) {
      datoDistanciaEl.textContent = info.distancia;
    }
    if (textoBadgeEl) {
      textoBadgeEl.textContent = `${info.mesa} · Libre`;
    }
    if (pasoZonaEl) {
      pasoZonaEl.textContent = `Llegarás a la zona ${info.zona}.`;
    }
    if (pasoMesaEl) {
      pasoMesaEl.textContent = `Busca la mesa ${etiquetaMesaCorta.toLowerCase()}.`;
    }

    pinesMesa.forEach((pin) => {
      pin.classList.toggle('activo', pin.dataset.mesa === codigoMesa);
    });
  }

  seleccionarDestino(mesaParam, zonaParam);

  pinesMesa.forEach((pin) => {
    pin.addEventListener('click', () => {
      const codigo = pin.dataset.mesa;
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