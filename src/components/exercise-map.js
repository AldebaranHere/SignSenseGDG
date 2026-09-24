// src/components/exercise-map.js
// Interactive Curriculum Map matching img_1.png with Auslan alphabet and vocabulary tracks

import { CURRICULUM, getLessonById } from "../data/curriculum.js";
import { loadLearnerState, getAccuracyRate } from "../utils/storage.js";

export class ExerciseMap {
  constructor(containerElement, onSelectLesson) {
    this.container = containerElement;
    this.onSelectLesson = onSelectLesson;
    this.state = loadLearnerState();
  }

  mount() {
    this.state = loadLearnerState();
    this.render();
    this.bindEvents();
  }

  render() {
    const accuracy = getAccuracyRate(this.state);
    const nextLesson = getLessonById(this.state.currentLessonId);

    this.container.innerHTML = `
      <section class="map-page" aria-label="Auslan Exercise Map">
        <!-- Top Navigation Bar -->
        <header class="topbar">
          <div class="brand">
            <div class="brand-mark" aria-hidden="true"></div>
            <div class="brand-name">SignSense</div>
            <span class="brand-badge">AUSLAN</span>
          </div>

          <div class="who">
            <span class="who-name">${this.state.user.name}</span>
            <div class="avatar" aria-label="User avatar">${this.state.user.initials}</div>
          </div>
        </header>

        <!-- Main Layout Grid -->
        <div class="map-grid">
          <!-- Left Sidebar -->
          <aside class="map-sidebar">
            <!-- Next Up Card -->
            <div class="card card-dark" role="region" aria-labelledby="next-up-heading">
              <p class="eyebrow" id="next-up-heading">NEXT UP</p>
              <h2 class="card-title">${nextLesson.title}</h2>
              <p class="card-subtitle">${nextLesson.unitTitle} · ${nextLesson.signs.length} signs</p>
              <button class="btn-primary" id="btn-start-next-lesson">
                <span>Start lesson</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 4l10 6-10 6V4z"/>
                </svg>
              </button>
            </div>

            <!-- Your Progress Card -->
            <div class="card" role="region" aria-labelledby="progress-heading">
              <p class="eyebrow" id="progress-heading">YOUR PROGRESS</p>
              <div style="margin-top: 10px;">
                <div class="stat-row">
                  <span class="stat-label">Lessons finished</span>
                  <span class="stat-value">${this.state.lessonsFinished.length} / 19</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Signs learned</span>
                  <span class="stat-value">${this.state.signsLearned}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Signed correctly</span>
                  <span class="stat-value">${accuracy}%</span>
                </div>
              </div>
              <div class="progress-bar-wrap" aria-label="Overall curriculum progress">
                <div class="progress-bar-fill" style="width: ${(this.state.lessonsFinished.length / 19) * 100}%;"></div>
              </div>
            </div>

            <!-- Refresher Card -->
            <div class="card" role="region" aria-labelledby="refresher-heading">
              <div class="card-header-flex">
                <span class="stat-value" id="refresher-heading" style="font-size:15px;">Refresher</span>
                <span class="badge-stretch">STRETCH</span>
              </div>
              <p class="card-subtitle" style="margin-bottom:8px;">
                The six signs you get wrong most often, pulled from every lesson you have done.
              </p>
              <div class="chip-group">
                ${this.state.refresherSigns.map(s => `<span class="chip-weak">${s}</span>`).join('')}
              </div>
              <button class="btn-link" id="btn-practise-refresher">Practise these</button>
            </div>

            <!-- Quick Course Jump -->
            <div class="card" role="region" aria-label="Course Units">
              <p class="eyebrow" style="margin-bottom:10px;">AUSLAN COURSES</p>
              <div style="display:flex; flex-direction:column; gap:6px;">
                ${CURRICULUM.units.map(u => `
                  <button class="btn-secondary unit-jump-btn" data-unit="${u.id}" style="justify-content:space-between; width:100%; text-align:left; font-size:13px; padding:8px 12px;">
                    <span style="font-weight:700;">${u.shortTitle}</span>
                    <span class="eyebrow" style="font-size:9.5px;">${u.lessons.length} L</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </aside>

          <!-- Main Tree Canvas -->
          <main class="map-main">
            <div class="map-header">
              <div>
                <p class="eyebrow">EXERCISE MAP</p>
                <h1 class="map-heading">Five units, nineteen lessons</h1>
              </div>
              <p class="map-sub">
                Finish a lesson to unlock the next one in its unit. Units open once fingerspelling is done.
              </p>
            </div>

            <!-- Interactive Radial Branching SVG -->
            <div class="map-canvas-container">
              <svg class="map-svg" viewBox="0 0 760 620" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Branch Connectors Lines -->
                <!-- Base radiating stems -->
                <path d="M380 540 L160 380" stroke="#F7DDB0" stroke-width="4.5" stroke-linecap="round"/>
                <path d="M380 540 L280 430 L280 270" stroke="#F7DDB0" stroke-width="4.5" stroke-linecap="round"/>
                <path d="M380 540 L430 420 L430 250" stroke="#F7DDB0" stroke-width="4.5" stroke-linecap="round"/>
                <path d="M380 540 L520 440 L520 310" stroke="#D2DAE4" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M380 540 L630 460 L630 320" stroke="#D2DAE4" stroke-width="3.5" stroke-linecap="round"/>

                <!-- Transverse Unit Bridges (Dashed) -->
                <line x1="280" y1="430" x2="380" y2="445" stroke="#D2DAE4" stroke-width="2.5" stroke-dasharray="5 5"/>
                <line x1="430" y1="420" x2="520" y2="440" stroke="#D2DAE4" stroke-width="2.5" stroke-dasharray="5 5"/>
                <line x1="520" y1="440" x2="630" y2="460" stroke="#D2DAE4" stroke-width="2.5" stroke-dasharray="5 5"/>

                <!-- ================= UNIT 1: FINGERSPELLING ================= -->
                <!-- Unit label -->
                <text x="160" y="350" text-anchor="middle" class="node-count">3 / 3</text>
                <text x="160" y="368" text-anchor="middle" class="node-label">Fingerspelling</text>

                <!-- Node 1: fs-1 -->
                <g class="map-node" data-lesson="fs-1" transform="translate(160, 390)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- Node 2: fs-2 -->
                <g class="map-node" data-lesson="fs-2" transform="translate(200, 430)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- Node 3: fs-3 -->
                <g class="map-node" data-lesson="fs-3" transform="translate(245, 475)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- ================= UNIT 2: GREETINGS ================= -->
                <text x="280" y="240" text-anchor="middle" class="node-count">4 / 4</text>
                <text x="280" y="258" text-anchor="middle" class="node-label">Greetings</text>

                <g class="map-node" data-lesson="greet-1" transform="translate(280, 280)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <g class="map-node" data-lesson="greet-2" transform="translate(280, 330)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <g class="map-node" data-lesson="greet-3" transform="translate(280, 380)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <g class="map-node" data-lesson="greet-4" transform="translate(305, 440)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- ================= UNIT 3: FOOD & DRINK (ACTIVE) ================= -->
                <text x="430" y="215" text-anchor="middle" class="node-count">2 / 4</text>
                <text x="430" y="233" text-anchor="middle" class="node-label">Food & drink</text>

                <!-- Locked future node in Unit 3 -->
                <circle cx="430" cy="255" r="13" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.8"/>

                <!-- YOU ARE HERE node (food-1) -->
                <g class="map-node" data-lesson="food-1" transform="translate(430, 310)">
                  <circle r="16" fill="#FFFFFF" stroke="#0E1A2B" stroke-width="3"/>
                  <circle r="7" fill="#0E1A2B"/>
                  <!-- Tooltip badge -->
                  <text x="32" y="4" class="node-count map-node-label" pointer-events="none" style="letter-spacing:0.12em; fill:#0E1A2B; font-weight:700; user-select:none;">YOU ARE HERE</text>
                </g>

                <!-- Finished node in Unit 3 -->
                <g class="map-node" data-lesson="food-2" transform="translate(435, 365)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <g class="map-node" data-lesson="fs-4" transform="translate(440, 425)">
                  <circle r="14" fill="#E8930C"/>
                  <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- ================= UNIT 4: FAMILY (LOCKED) ================= -->
                <text x="520" y="275" text-anchor="middle" class="node-count">0 / 4</text>
                <text x="520" y="293" text-anchor="middle" class="node-label" style="fill:var(--muted)">Family</text>

                <circle cx="520" cy="320" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
                <circle cx="510" cy="370" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
                <circle cx="500" cy="420" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
                <circle cx="490" cy="460" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>

                <!-- ================= UNIT 5: NUMBERS (LOCKED) ================= -->
                <text x="630" y="285" text-anchor="middle" class="node-count">0 / 4</text>
                <text x="630" y="303" text-anchor="middle" class="node-label" style="fill:var(--muted)">Numbers</text>

                <circle cx="630" cy="330" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
                <circle cx="615" cy="380" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
                <circle cx="595" cy="430" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
                <circle cx="560" cy="485" r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>

                <!-- ================= BASE ROOT START NODE ================= -->
                <g class="map-node" data-lesson="fs-1" transform="translate(380, 540)">
                  <circle r="18" fill="#E8930C"/>
                  <path d="M-6 0.5 L-2 4.5 L7 -4" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <text x="380" y="575" text-anchor="middle" class="node-count" style="letter-spacing:0.12em; fill:#7D8CA1;">START</text>
              </svg>
            </div>

            <!-- Legend Footer -->
            <footer class="map-legend">
              <div class="legend-item">
                <span class="legend-dot finished"></span>
                <span>Finished</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot next"></span>
                <span>Next lesson</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot locked"></span>
                <span>Locked</span>
              </div>
            </footer>
          </main>
        </div>
      </section>
    `;
  }

  bindEvents() {
    // Start Next Lesson CTA
    this.container.querySelector("#btn-start-next-lesson").addEventListener("click", () => {
      this.onSelectLesson(this.state.currentLessonId);
    });

    // Refresher CTA
    this.container.querySelector("#btn-practise-refresher").addEventListener("click", () => {
      // Directs to Alphabet Vowels as drill
      this.onSelectLesson("fs-1");
    });

    // Map Nodes
    this.container.querySelectorAll(".map-node").forEach(node => {
      node.addEventListener("click", (e) => {
        const lessonId = e.currentTarget.dataset.lesson;
        if (lessonId) {
          this.onSelectLesson(lessonId);
        }
      });
    });

    // Unit Quick Jump Buttons
    this.container.querySelectorAll(".unit-jump-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const unitId = e.currentTarget.dataset.unit;
        const unit = CURRICULUM.units.find(u => u.id === unitId);
        if (unit && unit.lessons.length > 0) {
          this.onSelectLesson(unit.lessons[0].id);
        }
      });
    });
  }

  destroy() {
    // No continuous listeners to detach
  }
}
