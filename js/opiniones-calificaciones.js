document.addEventListener('DOMContentLoaded', () => {
  // 1. Espacio seleccionado
  const params = new URLSearchParams(window.location.search);
  const espacioParam = params.get('espacio');
  const espacioStorage = sessionStorage.getItem('uca_space_espacio_opinion');
  const nombreEspacio = (espacioParam || espacioStorage || 'Área de descanso').trim();

  const nombreEspacioEl = document.getElementById('nombre-espacio');
  if (nombreEspacioEl) {
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
        window.location.href = 'opiniones-calificaciones.html';
      }
    });
  }

  // 3. Opiniones base + opiniones guardadas en localStorage
  const opinionesBase = [
    {
      id: 'base-1',
      autor: 'Andrea M.',
      inicial: 'A',
      tono: 'tono-azul',
      fechaTexto: 'Hace 2 días',
      ordenReciente: 2,
      estrellas: 5,
      comentario: 'Es un lugar tranquilo y cómodo para estudiar entre clases.'
    },
    {
      id: 'base-2',
      autor: 'Carlos R.',
      inicial: 'C',
      tono: 'tono-gris',
      fechaTexto: 'Hace 1 semana',
      ordenReciente: 1,
      estrellas: 4,
      comentario: 'Hay mesas disponibles, aunque a veces se llena en horas de almuerzo.'
    }
  ];

  const guardadasStorage = JSON.parse(localStorage.getItem('uca_space_opiniones') || '[]')
    .filter((op) => !op.espacio || op.espacio.toLowerCase() === nombreEspacio.toLowerCase())
    .map((op, idx) => ({
      id: op.id || `user-${idx}`,
      autor: 'Estudiante UCA',
      inicial: 'E',
      tono: 'tono-azul',
      fechaTexto: 'Reciente',
      ordenReciente: 100 + idx,
      estrellas: Number(op.calificacion) || 5,
      comentario: op.comentario || ''
    }));

  const todasLasOpiniones = [...guardadasStorage, ...opinionesBase];

  // Actualizar resumen y estrellas
  const promedioEl = document.getElementById('promedio-numero');
  const estrellasResumenEl = document.getElementById('estrellas-resumen');
  const totalTextoEl = document.getElementById('total-opiniones-texto');

  const totalBaseConteo = 24;
  const totalOpinionesMostradas = totalBaseConteo + guardadasStorage.length;
  const sumaBase = 4.5 * totalBaseConteo;
  const sumaNuevas = guardadasStorage.reduce((acc, item) => acc + item.estrellas, 0);
  const promedioCalculado = ((sumaBase + sumaNuevas) / totalOpinionesMostradas).toFixed(1);

  if (promedioEl) {
    promedioEl.textContent = promedioCalculado;
  }

  if (totalTextoEl) {
    totalTextoEl.textContent = `Basado en ${totalOpinionesMostradas} opiniones`;
  }

  function crearSvgEstrella(tamano, claseExtra) {
    return `
      <span class="${claseExtra}" aria-hidden="true">
        <svg width="${tamano}" height="${tamano}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </span>
    `;
  }

  if (estrellasResumenEl) {
    const estrellasLlenas = Math.round(Number(promedioCalculado));
    estrellasResumenEl.innerHTML = Array.from({ length: 5 }, (_, i) => {
      const llena = i < estrellasLlenas ? 'llena' : '';
      return crearSvgEstrella(28, `estrella-resumen ${llena}`);
    }).join('');
  }

  // 4. Renderizado y filtros (Todas / Más recientes)
  const tarjetaOpinionesEl = document.getElementById('tarjeta-opiniones');
  const botonesFiltro = Array.from(document.querySelectorAll('.btn-filtro'));
  let filtroActual = 'todas';

  function renderizarOpiniones() {
    if (!tarjetaOpinionesEl) return;

    const lista = filtroActual === 'recientes'
      ? [...todasLasOpiniones].sort((a, b) => b.ordenReciente - a.ordenReciente)
      : todasLasOpiniones;

    tarjetaOpinionesEl.innerHTML = lista.map((op) => {
      const miniEstrellas = Array.from({ length: 5 }, (_, i) => {
        const llena = i < op.estrellas ? 'llena' : '';
        return crearSvgEstrella(14, `estrella-mini ${llena}`);
      }).join('');

      return `
        <article class="opinion-item">
          <div class="avatar-opinion ${op.tono}" aria-hidden="true">${op.inicial}</div>
          <div class="opinion-cuerpo">
            <h3 class="opinion-autor">${op.autor}</h3>
            <p class="opinion-fecha">${op.fechaTexto}</p>
            <div class="opinion-estrellas" aria-label="${op.estrellas} de 5 estrellas">
              ${miniEstrellas}
            </div>
            <p class="opinion-comentario">${op.comentario}</p>
          </div>
        </article>
      `;
    }).join('');
  }

  botonesFiltro.forEach((btn) => {
    btn.addEventListener('click', () => {
      filtroActual = btn.dataset.filtro || 'todas';

      botonesFiltro.forEach((b) => {
        const esActiva = b === btn;
        b.classList.toggle('activo', esActiva);
        b.setAttribute('aria-pressed', String(esActiva));
      });

      renderizarOpiniones();
    });
  });

  renderizarOpiniones();

  // 5. Botón Escribir opinión -> escribir-opinion.html
  const btnEscribirOpinion = document.getElementById('btn-escribir-opinion');
  if (btnEscribirOpinion) {
    btnEscribirOpinion.addEventListener('click', () => {
      sessionStorage.setItem('uca_space_origen', 'opiniones-calificaciones.html');
      sessionStorage.setItem('uca_space_espacio_opinion', nombreEspacio);
      window.location.href = `escribir-opinion.html?espacio=${encodeURIComponent(nombreEspacio)}`;
    });
  }

  // 6. Barra inferior
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

      sessionStorage.setItem('uca_space_origen', 'opiniones-calificaciones.html');
      window.location.href = destino;
    });
  });
});