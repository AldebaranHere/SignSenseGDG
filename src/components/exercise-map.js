// src/components/exercise-map.js
// Interactive Curriculum Map with Dynamic Progression & Ephemeral Learner State
// Harmonized with Upstream Aesthetic (Poppins font, #4CAF50, responsive radial SVG tree)

import { CURRICULUM, getLessonById } from "../data/curriculum.js";
import { loadLearnerState, getAccuracyRate, clearSessionData, saveLearnerState } from "../utils/storage.js";

export class ExerciseMap {
  constructor(containerElement, onSelectLesson, onLogout) {
    this.container = containerElement;
    this.onSelectLesson = onSelectLesson;
    this.onLogout = onLogout;
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
    const totalLessons = CURRICULUM.units.reduce((acc, u) => acc + u.lessons.length, 0);
    const finishedCount = this.state.lessonsFinished ? this.state.lessonsFinished.length : 0;
    const progressPercent = totalLessons > 0 ? Math.round((finishedCount / totalLessons) * 100) : 0;

    // Helper: calculate finished count for a given unit
    const getUnitFinishedCount = (unitSlug) => {
      const unit = CURRICULUM.units.find(u => u.slug === unitSlug);
      if (!unit) return { done: 0, total: 0 };
      const done = unit.lessons.filter(l => (this.state.lessonsFinished || []).includes(l.id)).length;
      return { done, total: unit.lessons.length };
    };

    const u1 = getUnitFinishedCount("fingerspelling");
    const u2 = getUnitFinishedCount("greetings");
    const u3 = getUnitFinishedCount("food-drink");
    const u4 = getUnitFinishedCount("family-home");
    const u5 = getUnitFinishedCount("numbers");

    // Dynamic node renderer
    const renderNode = (lessonId, cx, cy, options = {}) => {
      const isFinished = (this.state.lessonsFinished || []).includes(lessonId);
      const isCurrent = this.state.currentLessonId === lessonId;
      const customLabel = options.label || null;

      if (isFinished) {
        return `
          <g class="map-node finished" data-lesson="${lessonId}" transform="translate(${cx}, ${cy})" tabindex="0" role="button" aria-label="Completed lesson: ${lessonId}">
            <circle r="14" fill="#E8930C"/>
            <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
            ${customLabel ? `<text x="24" y="4" class="node-count map-node-label" pointer-events="none" style="fill:var(--ink); font-weight:700;">${customLabel}</text>` : ""}
          </g>
        `;
      } else if (isCurrent) {
        return `
          <g class="map-node active current-node" data-lesson="${lessonId}" transform="translate(${cx}, ${cy})" tabindex="0" role="button" aria-label="Active lesson: ${lessonId}">
            <circle r="16" fill="#FFFFFF" stroke="#0E1A2B" stroke-width="3"/>
            <circle r="7" fill="#0E1A2B"/>
            <text x="32" y="4" class="node-count map-node-label" pointer-events="none" style="letter-spacing:0.12em; fill:#0E1A2B; font-weight:700; user-select:none;">YOU ARE HERE</text>
          </g>
        `;
      } else {
        return `
          <g class="map-node locked" data-lesson="${lessonId}" transform="translate(${cx}, ${cy})" aria-disabled="true" aria-label="Locked lesson: ${lessonId}">
            <circle r="12" fill="#FFFFFF" stroke="#D2DAE4" stroke-width="2.5"/>
          </g>
        `;
      }
    };

    const userName = (this.state.user && this.state.user.name) || "Learner";
    const userInitials = (this.state.user && this.state.user.initials) || "SS";

    this.container.innerHTML = `
      <section class="map-page" aria-label="Auslan Exercise Map">
        <!-- Top Navigation Bar -->
        <header class="topbar">
          <div class="brand">
            <div class="brand-mark" aria-hidden="true"></div>
            <div class="brand-name">SignSense</div>
            <span class="brand-badge">AUSLAN</span>
          </div>

          <div class="user-menu">
            <div class="who">
              <span class="who-name">${userName}</span>
              <div class="avatar" aria-label="User avatar">${userInitials}</div>
            </div>
            <button id="btn-logout" class="btn-logout" type="button" aria-label="Log out" title="Log out from session">
              Log out
            </button>
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
                  <span class="stat-value">${finishedCount} / ${totalLessons}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Signs learned</span>
                  <span class="stat-value">${this.state.signsLearned || 0}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Signed correctly</span>
                  <span class="stat-value">${accuracy > 0 ? `${accuracy}%` : "—"}</span>
                </div>
              </div>
              <div class="progress-bar-wrap" aria-label="Overall curriculum progress">
                <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <!-- Refresher Card -->
            <div class="card" role="region" aria-labelledby="refresher-heading">
              <div class="card-header-flex">
                <span class="stat-value" id="refresher-heading" style="font-size:15px;">Refresher</span>
                <span class="badge-stretch">STRETCH</span>
              </div>
              <p class="card-subtitle" style="margin-bottom:8px;">
                The signs to practice regularly, pulled from Auslan fingerspelling and core vocab.
              </p>
              <div class="chip-group">
                ${(this.state.refresherSigns || ["A", "E", "I", "B", "C"]).map(s => `<span class="chip-weak">${s}</span>`).join('')}
              </div>
              <button class="btn-link" id="btn-practise-refresher">Practise vowels</button>
            </div>

            <!-- Quick Course Jump -->
            <div class="card" role="region" aria-label="Course Units">
              <p class="eyebrow" style="margin-bottom:10px;">AUSLAN COURSES</p>
              <div style="display:flex; flex-direction:column; gap:6px;">
                ${CURRICULUM.units.map(u => {
                  const uDone = u.lessons.filter(l => (this.state.lessonsFinished || []).includes(l.id)).length;
                  return `
                    <button class="btn-secondary unit-jump-btn" data-unit="${u.id}" style="justify-content:space-between; width:100%; text-align:left; font-size:13px; padding:8px 12px;">
                      <span style="font-weight:700;">${u.shortTitle}</span>
                      <span class="eyebrow" style="font-size:9.5px;">${uDone}/${u.lessons.length} L</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </aside>

          <!-- Main Tree Canvas -->
          <main class="map-main">
            <div class="map-header">
              <div>
                <p class="eyebrow">EXERCISE MAP</p>
                <h1 class="map-heading">Five units, ${totalLessons} lessons</h1>
              </div>
              <p class="map-sub">
                Finish a lesson to unlock the next one in its unit. Units open progressively as you master Auslan signs.
              </p>
            </div>

            <!-- Interactive Radial Branching SVG -->
            <div class="map-canvas-container">
              <svg class="map-svg" viewBox="0 0 760 620" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Branch Connectors Lines -->
                <!-- Base radiating stems -->
                <path d="M380 540 L160 380" stroke="${u1.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="4" stroke-linecap="round"/>
                <path d="M380 540 L280 430 L280 270" stroke="${u2.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="4" stroke-linecap="round"/>
                <path d="M380 540 L430 420 L430 250" stroke="${u3.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="4" stroke-linecap="round"/>
                <path d="M380 540 L520 440 L520 310" stroke="${u4.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M380 540 L630 460 L630 320" stroke="${u5.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="3.5" stroke-linecap="round"/>

                <!-- Transverse Unit Bridges (Dashed) -->
                <line x1="280" y1="430" x2="380" y2="445" stroke="#D2DAE4" stroke-width="2" stroke-dasharray="5 5"/>
                <line x1="430" y1="420" x2="520" y2="440" stroke="#D2DAE4" stroke-width="2" stroke-dasharray="5 5"/>
                <line x1="520" y1="440" x2="630" y2="460" stroke="#D2DAE4" stroke-width="2" stroke-dasharray="5 5"/>

                <!-- ================= UNIT 1: FINGERSPELLING ================= -->
                <text x="160" y="340" text-anchor="middle" class="node-count">${u1.done} / ${u1.total}</text>
                <text x="160" y="358" text-anchor="middle" class="node-label">Fingerspelling</text>

                ${renderNode("fs-4", 160, 390)}
                ${renderNode("fs-3", 200, 430)}
                ${renderNode("fs-2", 245, 475)}

                <!-- ================= UNIT 2: GREETINGS ================= -->
                <text x="280" y="240" text-anchor="middle" class="node-count">${u2.done} / ${u2.total}</text>
                <text x="280" y="258" text-anchor="middle" class="node-label">Greetings</text>

                ${renderNode("greet-4", 280, 280)}
                ${renderNode("greet-3", 280, 330)}
                ${renderNode("greet-2", 280, 380)}
                ${renderNode("greet-1", 305, 440)}

                <!-- ================= UNIT 3: FOOD & DRINK ================= -->
                <text x="430" y="270" text-anchor="middle" class="node-count">${u3.done} / ${u3.total}</text>
                <text x="430" y="288" text-anchor="middle" class="node-label">Food & drink</text>

                ${renderNode("food-2", 430, 320)}
                ${renderNode("food-1", 435, 380)}

                <!-- ================= UNIT 4: FAMILY ================= -->
                <text x="520" y="335" text-anchor="middle" class="node-count">${u4.done} / ${u4.total}</text>
                <text x="520" y="353" text-anchor="middle" class="node-label" style="fill:var(--muted)">Family</text>

                ${renderNode("fam-2", 520, 385)}
                ${renderNode("fam-1", 510, 440)}

                <!-- ================= UNIT 5: NUMBERS ================= -->
                <text x="630" y="340" text-anchor="middle" class="node-count">${u5.done} / ${u5.total}</text>
                <text x="630" y="358" text-anchor="middle" class="node-label" style="fill:var(--muted)">Numbers</text>

                ${renderNode("num-1", 630, 400)}

                <!-- ================= BASE ROOT START NODE (fs-1) ================= -->
                ${renderNode("fs-1", 380, 540, { label: null })}
                <text x="380" y="575" text-anchor="middle" class="node-count" style="letter-spacing:0.12em; fill:#7D8CA1;">START · VOWELS</text>
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
    const startBtn = this.container.querySelector("#btn-start-next-lesson");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.onSelectLesson(this.state.currentLessonId);
      });
    }

    // Refresher CTA
    const refresherBtn = this.container.querySelector("#btn-practise-refresher");
    if (refresherBtn) {
      refresherBtn.addEventListener("click", () => {
        this.onSelectLesson("fs-1");
      });
    }

    // Log Out Button
    const logoutBtn = this.container.querySelector("#btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await fetch("/api/logout", { method: "POST" });
        } catch (e) {
          // Ignore network errors on logout
        }
        clearSessionData();
        if (typeof this.onLogout === "function") {
          this.onLogout();
        } else {
          window.location.hash = "#/login";
        }
      });
    }

    // Map Nodes
    this.container.querySelectorAll(".map-node").forEach(node => {
      node.addEventListener("click", (e) => {
        const target = e.currentTarget;
        if (target.classList.contains("locked")) {
          // Locked lesson — gentle feedback
          target.animate([
            { transform: `${target.getAttribute("transform")} scale(1)` },
            { transform: `${target.getAttribute("transform")} scale(1.15)` },
            { transform: `${target.getAttribute("transform")} scale(1)` }
          ], { duration: 300, easing: "ease-out" });
          return;
        }

        const lessonId = target.dataset.lesson;
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
          // Find first unlocked lesson in that unit or the first lesson
          const firstUnlocked = unit.lessons.find(l =>
            (this.state.lessonsFinished || []).includes(l.id) || this.state.currentLessonId === l.id
          ) || unit.lessons[0];
          this.onSelectLesson(firstUnlocked.id);
        }
      });
    });
  }

  destroy() {
    this.container.innerHTML = "";
  }
}
