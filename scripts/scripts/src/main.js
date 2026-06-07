const rooms = [
  { name: 'Living Room', length: 5.6, width: 4.4, color: '#77a6ff', x: 22, y: 16 },
  { name: 'Kitchen', length: 3.9, width: 3.2, color: '#ffbc68', x: 60, y: 17 },
  { name: 'Bedroom', length: 4.6, width: 3.8, color: '#b38cff', x: 20, y: 58 },
  { name: 'Bath', length: 2.7, width: 2.7, color: '#62dbc7', x: 62, y: 60 }
];

const furniture = [
  { label: 'Sofa', room: 'Living Room', x: 28, y: 25, w: 19, h: 8, color: '#1d3557' },
  { label: 'Table', room: 'Living Room', x: 42, y: 39, w: 13, h: 8, color: '#f4a261' },
  { label: 'Island', room: 'Kitchen', x: 68, y: 31, w: 15, h: 8, color: '#ffffff' },
  { label: 'Bed', room: 'Bedroom', x: 30, y: 70, w: 19, h: 17, color: '#5e60ce' },
  { label: 'Vanity', room: 'Bath', x: 70, y: 67, w: 11, h: 6, color: '#457b9d' }
];

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="hero">
    <nav class="nav" aria-label="Main navigation">
      <a class="brand" href="#app" aria-label="HomePlaner 3D home">HomePlaner<span>3D</span></a>
      <div class="nav-links">
        <a href="#planner">Planner</a>
        <a href="#dimensions">Dimensions</a>
        <a href="#features">Features</a>
        <a href="#quote">Estimate</a>
      </div>
      <a class="nav-cta" href="#planner">Start Designing</a>
    </nav>

    <section class="hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">3D home design planner website</p>
        <h1>Design rooms, place furniture, and preview your future home in 3D.</h1>
        <p class="hero-text">
          Sketch a concept plan, explore a furnished 3D model, and turn early home ideas into a clear room-by-room layout.
        </p>
        <div class="hero-actions">
          <a class="primary-button" href="#planner">Open 3D planner</a>
          <a class="secondary-button" href="#features">See tools</a>
        </div>
        <dl class="stats" aria-label="Planner highlights">
          <div><dt>4</dt><dd>Room zones</dd></div>
          <div><dt>L × W</dt><dd>Every room</dd></div>
          <div><dt>Python</dt><dd>Local server</dd></div>
        </dl>
      </div>
      <div class="hero-card" aria-label="Home plan preview summary">
        <div class="blueprint-card">
          <span></span><span></span><span></span><span></span>
          <strong>Modern family layout</strong>
          <p>Open living, compact kitchen, private bedroom wing, and utility bath.</p>
        </div>
      </div>
    </section>
  </header>

  <main>
    <section id="planner" class="planner-section">
      <div class="section-heading">
        <p class="eyebrow">Interactive model</p>
        <h2>Rotate, zoom, and inspect the sample floor plan.</h2>
        <p>Use the controls to switch rooms, add guide dimensions, and review the length and width for every space.</p>
      </div>
      <div class="planner-shell">
        <aside class="tool-panel" aria-label="Planner controls">
          <h3>Design controls</h3>
          <label for="roomSelect">Focus room</label>
          <select id="roomSelect">
            <option value="all">Whole home</option>
            ${rooms.map((room) => `<option value="${room.name}">${room.name}</option>`).join('')}
          </select>

          <label for="rotationRange">View rotation</label>
          <input id="rotationRange" type="range" min="-42" max="42" value="-22" />

          <label for="zoomRange">Plan zoom</label>
          <input id="zoomRange" type="range" min="82" max="128" value="100" />

          <div class="toggle-row">
            <span>Wall height</span>
            <button id="wallToggle" type="button" aria-pressed="true">Tall</button>
          </div>
          <div class="toggle-row">
            <span>Dimension guides</span>
            <button id="dimensionToggle" type="button" aria-pressed="true">On</button>
          </div>
          <button id="resetCamera" class="panel-button" type="button">Reset view</button>

          <div class="room-list">
            <h4>Rooms</h4>
            ${rooms.map((room) => `
              <article data-room-card="${room.name}">
                <span style="--swatch:${room.color}"></span>
                <div>
                  <strong>${room.name}</strong>
                  <small>L ${room.length.toFixed(1)}m × W ${room.width.toFixed(1)}m</small>
                </div>
              </article>
            `).join('')}
          </div>
        </aside>
        <div class="canvas-wrap">
          <div class="scene" aria-label="Interactive 3D home planner model">
            <div id="homeModel" class="home-model">
              <div class="floor-grid"></div>
              ${rooms.map((room) => `
                <article class="room-block" data-room="${room.name}" style="--x:${room.x}; --y:${room.y}; --w:${room.length * 8}; --h:${room.width * 8}; --room:${room.color};">
                  <span class="room-floor"></span>
                  <span class="wall wall-north"></span>
                  <span class="wall wall-south"></span>
                  <span class="wall wall-east"></span>
                  <span class="wall wall-west"></span>
                  <strong class="dimension-label">${room.name}<small>L ${room.length.toFixed(1)}m × W ${room.width.toFixed(1)}m</small></strong>
                  <span class="side-guide length-guide">Length ${room.length.toFixed(1)}m</span>
                  <span class="side-guide width-guide">Width ${room.width.toFixed(1)}m</span>
                </article>
              `).join('')}
              ${furniture.map((item) => `
                <span class="furniture" data-room="${item.room}" style="--x:${item.x}; --y:${item.y}; --w:${item.w}; --h:${item.h}; --item:${item.color};">${item.label}</span>
              `).join('')}
            </div>
          </div>
          <div class="canvas-hint">Use sliders to rotate and zoom • Choose a room to focus</div>
        </div>
      </div>
    </section>

    <section id="dimensions" class="dimensions-section">
      <div class="section-heading compact">
        <p class="eyebrow">Length and width</p>
        <h2>Every room shows its exact length, width, area, and perimeter.</h2>
      </div>
      <div class="dimension-grid">
        <article class="dimension-card custom-card">
          <h3>Try your own room size</h3>
          <p>Enter any length or width in meters and Python-style formulas are shown instantly.</p>
          <form id="dimensionForm" class="dimension-form">
            <label>Length (m)<input id="lengthInput" type="number" min="1" step="0.1" value="5.0" /></label>
            <label>Width (m)<input id="widthInput" type="number" min="1" step="0.1" value="4.0" /></label>
          </form>
          <output id="dimensionOutput" aria-live="polite"></output>
        </article>
        ${rooms.map((room) => `
          <article class="dimension-card">
            <span style="--swatch:${room.color}"></span>
            <h3>${room.name}</h3>
            <dl>
              <div><dt>Length</dt><dd>${room.length.toFixed(1)} m</dd></div>
              <div><dt>Width</dt><dd>${room.width.toFixed(1)} m</dd></div>
              <div><dt>Area</dt><dd>${(room.length * room.width).toFixed(2)} m²</dd></div>
              <div><dt>Perimeter</dt><dd>${(2 * (room.length + room.width)).toFixed(2)} m</dd></div>
            </dl>
          </article>
        `).join('')}
      </div>
    </section>

    <section id="features" class="features-section">
      <div class="section-heading compact">
        <p class="eyebrow">What you can plan</p>
        <h2>Tools for a faster first concept.</h2>
      </div>
      <div class="feature-grid">
        <article><h3>Room zoning</h3><p>Color-coded spaces make the layout easy to understand at a glance.</p></article>
        <article><h3>Furniture blocks</h3><p>Starter furniture models help validate circulation and room scale.</p></article>
        <article><h3>Dimension review</h3><p>Guide labels show length, width, area, and perimeter before you refine the blueprint.</p></article>
        <article><h3>Project estimate</h3><p>Instantly convert planned area into a high-level budget estimate.</p></article>
      </div>
    </section>

    <section id="quote" class="quote-section">
      <div>
        <p class="eyebrow">Instant planning estimate</p>
        <h2>Calculate a starter budget from your plan size.</h2>
        <p>Adjust the build area and finish quality to generate a rough early-stage estimate.</p>
      </div>
      <form class="estimate-card" id="estimateForm">
        <label>Build area (m²)<input id="areaInput" type="number" min="20" value="86" /></label>
        <label>Finish level
          <select id="finishInput">
            <option value="950">Essential</option>
            <option value="1350" selected>Comfort</option>
            <option value="1900">Premium</option>
          </select>
        </label>
        <output id="estimateOutput" aria-live="polite"></output>
      </form>
    </section>
  </main>

  <footer class="footer">
    <p>HomePlaner3D — concept home planning for modern builds.</p>
    <a href="#app">Back to top</a>
  </footer>
`;

const model = document.querySelector('#homeModel');
const rotationRange = document.querySelector('#rotationRange');
const zoomRange = document.querySelector('#zoomRange');

function updateModelTransform() {
  model.style.setProperty('--rotation', `${rotationRange.value}deg`);
  model.style.setProperty('--zoom', `${zoomRange.value / 100}`);
}

function focusRoom(roomName) {
  const focusAll = roomName === 'all';
  document.querySelectorAll('[data-room]').forEach((element) => {
    element.classList.toggle('is-muted', !focusAll && element.dataset.room !== roomName);
    element.classList.toggle('is-focused', !focusAll && element.dataset.room === roomName);
  });
  document.querySelectorAll('[data-room-card]').forEach((card) => {
    card.classList.toggle('is-active', !focusAll && card.dataset.roomCard === roomName);
  });
}

function updateDimensionCalculator() {
  const length = Number(document.querySelector('#lengthInput').value || 0);
  const width = Number(document.querySelector('#widthInput').value || 0);
  const area = length * width;
  const perimeter = 2 * (length + width);
  document.querySelector('#dimensionOutput').innerHTML = `
    <strong>${area.toFixed(2)} m²</strong>
    <span>Area = length × width = ${length.toFixed(1)} × ${width.toFixed(1)}</span>
    <span>Perimeter = 2 × (length + width) = ${perimeter.toFixed(2)} m</span>
  `;
}

function updateEstimate() {
  const area = Number(document.querySelector('#areaInput').value || 0);
  const rate = Number(document.querySelector('#finishInput').value);
  const total = area * rate;
  document.querySelector('#estimateOutput').textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(total);
}

document.querySelector('#roomSelect').addEventListener('change', (event) => focusRoom(event.target.value));
rotationRange.addEventListener('input', updateModelTransform);
zoomRange.addEventListener('input', updateModelTransform);
document.querySelector('#resetCamera').addEventListener('click', () => {
  document.querySelector('#roomSelect').value = 'all';
  rotationRange.value = -22;
  zoomRange.value = 100;
  focusRoom('all');
  updateModelTransform();
});
document.querySelector('#wallToggle').addEventListener('click', (event) => {
  const isTall = event.currentTarget.getAttribute('aria-pressed') === 'true';
  event.currentTarget.setAttribute('aria-pressed', String(!isTall));
  event.currentTarget.textContent = isTall ? 'Low' : 'Tall';
  model.classList.toggle('low-walls', isTall);
});
document.querySelector('#dimensionToggle').addEventListener('click', (event) => {
  const isOn = event.currentTarget.getAttribute('aria-pressed') === 'true';
  event.currentTarget.setAttribute('aria-pressed', String(!isOn));
  event.currentTarget.textContent = isOn ? 'Off' : 'On';
  model.classList.toggle('hide-guides', isOn);
});
document.querySelector('#dimensionForm').addEventListener('input', updateDimensionCalculator);
document.querySelector('#estimateForm').addEventListener('input', updateEstimate);


updateModelTransform();
updateDimensionCalculator();
updateEstimate();
