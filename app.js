// ===================== DATOS MOCK =====================
const CLIENT = {
  name: 'Camila Rodríguez',
  account: 'GI-0231-9098'
};

const DATA_BY_PERIOD = {
  semanal: {
    label: 'Semanal',
    rangeLabel: 'Últimos 7 días',
    rentability: 0.6,
    aportes: 16800000,
    rendimientos: 402300,
    saldo: 17202300,
    chart: [
      { label: 'Lun', value: 20 },
      { label: 'Mar', value: 35 },
      { label: 'Mié', value: 28 },
      { label: 'Jue', value: 48 },
      { label: 'Vie', value: 40 },
      { label: 'Sáb', value: 60 },
      { label: 'Dom', value: 55 }
    ],
    movements: [
      { type: 'in', title: 'Rendimiento diario', date: 'Hoy, 6:00 a.m.', amount: 58200 },
      { type: 'in', title: 'Aporte programado', date: 'Ayer, 9:12 a.m.', amount: 300000 },
      { type: 'out', title: 'Retiro parcial', date: 'Hace 3 días', amount: -150000 },
      { type: 'in', title: 'Rendimiento diario', date: 'Hace 4 días', amount: 51900 }
    ]
  },
  mensual: {
    label: 'Mensual',
    rangeLabel: 'Últimos 30 días',
    rentability: 2.4,
    aportes: 16800000,
    rendimientos: 1652300,
    saldo: 18452300,
    chart: [
      { label: 'S1', value: 30 },
      { label: 'S2', value: 45 },
      { label: 'S3', value: 38 },
      { label: 'S4', value: 65 }
    ],
    movements: [
      { type: 'in', title: 'Rendimiento del fondo', date: '20 ago 2026', amount: 210500 },
      { type: 'in', title: 'Aporte programado', date: '15 ago 2026', amount: 500000 },
      { type: 'out', title: 'Retiro a cuenta Subank', date: '08 ago 2026', amount: -400000 },
      { type: 'in', title: 'Aporte extra', date: '03 ago 2026', amount: 1000000 },
      { type: 'in', title: 'Rendimiento del fondo', date: '25 jul 2026', amount: 198700 }
    ]
  },
  trimestral: {
    label: 'Trimestral',
    rangeLabel: 'Últimos 3 meses',
    rentability: 6.8,
    aportes: 15500000,
    rendimientos: 2952300,
    saldo: 18452300,
    chart: [
      { label: 'Jun', value: 40 },
      { label: 'Jul', value: 55 },
      { label: 'Ago', value: 70 }
    ],
    movements: [
      { type: 'in', title: 'Rendimiento del fondo', date: 'Agosto 2026', amount: 862300 },
      { type: 'in', title: 'Aporte programado', date: 'Julio 2026', amount: 1500000 },
      { type: 'out', title: 'Retiro a cuenta Subank', date: 'Julio 2026', amount: -600000 },
      { type: 'in', title: 'Rendimiento del fondo', date: 'Junio 2026', amount: 790000 },
      { type: 'in', title: 'Aporte inicial', date: 'Junio 2026', amount: 13000000 }
    ]
  }
};

const CREDENTIALS = { username: 'admin', password: '123456789' };

// ===================== UTIL =====================
const formatCOP = (value) => {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(Math.round(value));
  return sign + '$' + abs.toLocaleString('es-CO');
};

// ===================== LOGIN =====================
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

togglePasswordBtn.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePasswordBtn.textContent = isHidden ? '🙈' : '👁';
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = passwordInput.value;

  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    loginError.hidden = true;
    document.getElementById('client-name').textContent = CLIENT.name.split(' ')[0];
    document.getElementById('client-account').textContent = CLIENT.account;
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    renderPeriod('mensual');
  } else {
    loginError.hidden = false;
    loginError.classList.remove('shake');
    void loginError.offsetWidth;
    loginError.classList.add('shake');
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  dashboardScreen.classList.remove('active');
  loginScreen.classList.add('active');
  loginForm.reset();
});

// ===================== BALANCE VISIBILITY =====================
const balanceAmountEl = document.getElementById('balance-amount');
const toggleBalanceBtn = document.getElementById('toggle-balance');
let balanceVisible = true;

toggleBalanceBtn.addEventListener('click', () => {
  balanceVisible = !balanceVisible;
  balanceAmountEl.classList.toggle('hidden', !balanceVisible);
  toggleBalanceBtn.textContent = balanceVisible ? '👁' : '🙈';
});

// ===================== PERIOD TABS =====================
const periodTabs = document.querySelectorAll('.period-tab');
periodTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    periodTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    renderPeriod(tab.dataset.period);
  });
});

function renderPeriod(periodKey) {
  const data = DATA_BY_PERIOD[periodKey];
  if (!data) return;

  balanceAmountEl.textContent = formatCOP(data.saldo);

  const rentabilityBadge = document.getElementById('rentability-badge');
  const rentabilityValue = document.getElementById('rentability-value');
  const isUp = data.rentability >= 0;
  rentabilityBadge.classList.toggle('badge-up', isUp);
  rentabilityBadge.classList.toggle('badge-down', !isUp);
  rentabilityBadge.innerHTML = (isUp ? '▲ ' : '▼ ') + `<span id="rentability-value">${Math.abs(data.rentability).toString().replace('.', ',')}%</span>`;

  document.getElementById('stat-rentabilidad').textContent = data.rentability.toString().replace('.', ',') + '%';
  document.getElementById('stat-aportes').textContent = formatCOP(data.aportes);
  document.getElementById('stat-rendimientos').textContent = formatCOP(data.rendimientos);

  document.getElementById('chart-period-tag').textContent = data.rangeLabel;
  document.getElementById('movements-period-tag').textContent = data.label;

  renderChart(data.chart);
  renderMovements(data.movements);
}

function renderChart(points) {
  const maxValue = Math.max(...points.map((p) => p.value));
  const container = document.getElementById('chart-bars');
  container.innerHTML = '';
  points.forEach((p) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    const heightPct = Math.max((p.value / maxValue) * 100, 4);
    bar.style.height = heightPct + '%';
    bar.innerHTML = `<span>${p.label}</span>`;
    container.appendChild(bar);
  });
}

function renderMovements(movements) {
  const list = document.getElementById('movements-list');
  list.innerHTML = '';
  movements.forEach((m) => {
    const li = document.createElement('li');
    li.className = 'movement-item';
    li.innerHTML = `
      <div class="movement-icon ${m.type}">${m.type === 'in' ? '⬆' : '⬇'}</div>
      <div class="movement-info">
        <p class="movement-title">${m.title}</p>
        <p class="movement-date">${m.date}</p>
      </div>
      <div class="movement-amount ${m.type}">${m.type === 'in' ? '+' : ''}${formatCOP(m.amount)}</div>
    `;
    list.appendChild(li);
  });
}

// ===================== BOTTOM NAV =====================
const navItems = document.querySelectorAll('.nav-item');
const simulatorScreen = document.getElementById('simulator-screen');
const sectionByTab = {
  inicio: '.balance-card',
  movimientos: '.movements-card',
  rentabilidad: '.chart-card',
  perfil: '.stats-row'
};

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((n) => n.classList.remove('active'));
    item.classList.add('active');

    if (item.dataset.tab === 'simulador') {
      dashboardScreen.classList.remove('active');
      simulatorScreen.classList.add('active');
      return;
    }

    dashboardScreen.classList.add('active');
    simulatorScreen.classList.remove('active');
    const target = document.querySelector(sectionByTab[item.dataset.tab]);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.getElementById('sim-back-btn').addEventListener('click', () => {
  simulatorScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  navItems.forEach((n) => n.classList.remove('active'));
  document.querySelector('.nav-item[data-tab="inicio"]').classList.add('active');
});

// ===================== SIMULADOR DE INVERSIONES =====================
const SIM_COMPANIES = [
  { key: 'constructoraA', label: 'Constructora A' },
  { key: 'constructoraB', label: 'Constructora B' },
  { key: 'fondosComunes', label: 'Fondos Comunes' }
];
const SIM_STORAGE_KEY = 'gi_saved_simulations';

const simForm = document.getElementById('sim-form');
const simProfileButtons = document.querySelectorAll('.sim-profile-btn');
const simRateInput = document.getElementById('sim-rate');
const simDistRows = document.querySelectorAll('.sim-dist-row');
const simDistTotalEl = document.getElementById('sim-dist-total');
const simResults = document.getElementById('sim-results');

let currentRate = 10;
let lastSimulation = null;
let compareSelection = [];

// --- Perfil de rentabilidad ---
simProfileButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    simProfileButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.profile === 'custom') {
      simRateInput.hidden = false;
      simRateInput.focus();
      currentRate = parseFloat(simRateInput.value) || 0;
    } else {
      simRateInput.hidden = true;
      currentRate = parseFloat(btn.dataset.rate);
      simRateInput.value = currentRate;
    }
  });
});

simRateInput.addEventListener('input', () => {
  currentRate = parseFloat(simRateInput.value) || 0;
});

// --- Distribución de fondos ---
function updateDistTotal() {
  let total = 0;
  simDistRows.forEach((row) => {
    const slider = row.querySelector('.sim-dist-slider');
    const valueEl = row.querySelector('.sim-dist-value');
    valueEl.textContent = slider.value + '%';
    total += Number(slider.value);
  });
  simDistTotalEl.textContent = `Total: ${total}%`;
  simDistTotalEl.classList.toggle('sim-dist-error', total !== 100);
  return total;
}

simDistRows.forEach((row) => {
  row.querySelector('.sim-dist-slider').addEventListener('input', updateDistTotal);
});
updateDistTotal();

function getDistribution() {
  const dist = {};
  simDistRows.forEach((row) => {
    dist[row.dataset.key] = Number(row.querySelector('.sim-dist-slider').value);
  });
  return dist;
}

// --- Cálculo de la proyección ---
function calculateProjection({ amount, years, rate, distribution }) {
  const rows = [];
  const companyPrev = {};
  SIM_COMPANIES.forEach((c) => { companyPrev[c.key] = amount * (distribution[c.key] / 100); });

  for (let year = 1; year <= years; year++) {
    const companyValues = {};
    SIM_COMPANIES.forEach((c) => {
      companyValues[c.key] = companyPrev[c.key] * (1 + rate / 100);
      companyPrev[c.key] = companyValues[c.key];
    });
    const total = SIM_COMPANIES.reduce((sum, c) => sum + companyValues[c.key], 0);
    const accumulatedPct = ((total - amount) / amount) * 100;
    rows.push({ year, companyValues, total, accumulatedPct });
  }
  return rows;
}

simForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('sim-name').value.trim();
  const amount = Number(document.getElementById('sim-amount').value);
  const years = Number(document.getElementById('sim-years').value);
  const distribution = getDistribution();
  const distTotal = updateDistTotal();

  if (!amount || amount <= 0 || !years || years <= 0) return;
  if (distTotal !== 100) return;

  const rows = calculateProjection({ amount, years, rate: currentRate, distribution });
  const finalRow = rows[rows.length - 1];
  const gain = finalRow.total - amount;
  const roi = (gain / amount) * 100;

  lastSimulation = { name, amount, years, rate: currentRate, distribution, rows, finalValue: finalRow.total, gain, roi };
  renderSimResults(lastSimulation);
});

// --- Render de resultados ---
function renderSimResults(sim) {
  simResults.hidden = false;

  document.getElementById('sim-final-value').textContent = formatCOP(sim.finalValue);
  document.getElementById('sim-gain').textContent = formatCOP(sim.gain);
  document.getElementById('sim-roi').textContent = sim.roi.toFixed(1).replace('.', ',') + '%';
  document.getElementById('sim-chart-tag').textContent = `${sim.years} año${sim.years > 1 ? 's' : ''}`;

  renderSimChart([{ year: 0, total: sim.amount }, ...sim.rows]);
  renderSimTable(sim.rows);

  simResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderSimChart(points) {
  const container = document.getElementById('sim-area-chart');
  const maxValue = Math.max(...points.map((p) => p.total));
  const width = 300;
  const height = 120;
  const stepX = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - (p.total / maxValue) * (height - 10);
    return `${x},${y}`;
  });

  const areaPath = `M0,${height} L${coords.join(' L')} L${width},${height} Z`;
  const linePath = `M${coords.join(' L')}`;

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="sim-svg-chart">
      <defs>
        <linearGradient id="simAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e6b325" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#3d6b45" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#simAreaGrad)" stroke="none"/>
      <path d="${linePath}" fill="none" stroke="#3d6b45" stroke-width="2.5"/>
    </svg>
    <div class="sim-chart-labels">
      ${points.map((p) => `<span>${p.year === 0 ? 'Inicio' : 'Año ' + p.year}</span>`).join('')}
    </div>
  `;
}

function renderSimTable(rows) {
  const body = document.getElementById('sim-table-body');
  body.innerHTML = rows.map((r) => `
    <tr>
      <td>${r.year}</td>
      <td>${formatCOP(r.companyValues.constructoraA)}</td>
      <td>${formatCOP(r.companyValues.constructoraB)}</td>
      <td>${formatCOP(r.companyValues.fondosComunes)}</td>
      <td>${r.accumulatedPct.toFixed(1).replace('.', ',')}%</td>
      <td><strong>${formatCOP(r.total)}</strong></td>
    </tr>
  `).join('');
}

// --- Guardar simulaciones ---
function getSavedSimulations() {
  try {
    return JSON.parse(localStorage.getItem(SIM_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSimulations(list) {
  localStorage.setItem(SIM_STORAGE_KEY, JSON.stringify(list));
}

document.getElementById('sim-save-btn').addEventListener('click', () => {
  if (!lastSimulation) return;
  const list = getSavedSimulations();
  list.unshift({
    id: Date.now(),
    ...lastSimulation,
    savedAt: new Date().toLocaleString('es-CO')
  });
  saveSimulations(list);
  renderSavedSimulations();
});

document.getElementById('sim-export-btn').addEventListener('click', () => {
  window.print();
});

// --- Listado y comparación ---
function renderSavedSimulations() {
  const list = getSavedSimulations();
  const listEl = document.getElementById('sim-saved-list');
  document.getElementById('sim-saved-count').textContent = list.length;

  if (list.length === 0) {
    listEl.innerHTML = '<li class="sim-saved-empty">Aún no has guardado simulaciones.</li>';
    compareSelection = [];
    document.getElementById('sim-compare').hidden = true;
    return;
  }

  listEl.innerHTML = list.map((sim) => `
    <li class="sim-saved-item">
      <label class="sim-saved-check">
        <input type="checkbox" class="sim-compare-check" value="${sim.id}" ${compareSelection.includes(sim.id) ? 'checked' : ''}>
      </label>
      <div class="sim-saved-info">
        <p class="sim-saved-title">${sim.name || 'Sin nombre'} · ${sim.years} año${sim.years > 1 ? 's' : ''}</p>
        <p class="sim-saved-sub">${formatCOP(sim.amount)} inicial · ${sim.rate}% anual · ${sim.savedAt}</p>
      </div>
      <div class="sim-saved-result">
        <p class="sim-saved-final">${formatCOP(sim.finalValue)}</p>
        <p class="sim-saved-roi">ROI ${sim.roi.toFixed(1).replace('.', ',')}%</p>
      </div>
      <button class="icon-btn small sim-delete-btn" data-id="${sim.id}" aria-label="Eliminar simulación">🗑</button>
    </li>
  `).join('');

  listEl.querySelectorAll('.sim-delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      saveSimulations(getSavedSimulations().filter((s) => s.id !== id));
      compareSelection = compareSelection.filter((c) => c !== id);
      renderSavedSimulations();
      renderComparison();
    });
  });

  listEl.querySelectorAll('.sim-compare-check').forEach((chk) => {
    chk.addEventListener('change', () => {
      const id = Number(chk.value);
      if (chk.checked) {
        if (compareSelection.length >= 3) {
          chk.checked = false;
          return;
        }
        compareSelection.push(id);
      } else {
        compareSelection = compareSelection.filter((c) => c !== id);
      }
      renderComparison();
    });
  });

  renderComparison();
}

function renderComparison() {
  const compareBox = document.getElementById('sim-compare');
  const table = document.getElementById('sim-compare-table');

  if (compareSelection.length < 2) {
    compareBox.hidden = true;
    return;
  }

  const selected = getSavedSimulations().filter((s) => compareSelection.includes(s.id));
  compareBox.hidden = false;
  table.innerHTML = `
    <thead>
      <tr>
        <th>Simulación</th>
        ${selected.map((s) => `<th>${s.name || 'Sin nombre'}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr><td>Monto inicial</td>${selected.map((s) => `<td>${formatCOP(s.amount)}</td>`).join('')}</tr>
      <tr><td>Período</td>${selected.map((s) => `<td>${s.years} años</td>`).join('')}</tr>
      <tr><td>Tasa anual</td>${selected.map((s) => `<td>${s.rate}%</td>`).join('')}</tr>
      <tr><td>Valor final</td>${selected.map((s) => `<td><strong>${formatCOP(s.finalValue)}</strong></td>`).join('')}</tr>
      <tr><td>Ganancia</td>${selected.map((s) => `<td>${formatCOP(s.gain)}</td>`).join('')}</tr>
      <tr><td>ROI</td>${selected.map((s) => `<td>${s.roi.toFixed(1).replace('.', ',')}%</td>`).join('')}</tr>
    </tbody>
  `;
}

renderSavedSimulations();
