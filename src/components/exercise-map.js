// src/components/exercise-map.js
// Interactive Curriculum Map accurately matching img_1.png Hand Graphic from README Handoff
// Features 5 straight radiating fingers (Thumb, Index, Middle, Ring, Pinky),
// curved knuckle arc, dynamic blank-slate node states, and full responsive support.

import { CURRICULUM, getLessonById } from "../data/curriculum.js";
import { loadLearnerState, getAccuracyRate, clearSessionData } from "../utils/storage.js";

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
    const totalLessons = 19;
    const finishedCount = this.state.lessonsFinished ? this.state.lessonsFinished.length : 0;
    const progressPercent = Math.round((finishedCount / totalLessons) * 100);

    // Calculate completed count per unit
    const getUnitCount = (unitSlug, total) => {
      const unit = CURRICULUM.units.find(u => u.slug === unitSlug);
      if (!unit) return { done: 0, total };
      const done = unit.lessons.filter(l => (this.state.lessonsFinished || []).includes(l.id)).length;
      return { done, total: unit.lessons.length };
    };

    const u1 = getUnitCount("fingerspelling", 3);
    const u2 = getUnitCount("greetings", 4);
    const u3 = getUnitCount("food-drink", 4);
    const u4 = getUnitCount("family-home", 4);
    const u5 = getUnitCount("numbers", 4);

    // Dynamic node renderer
    const renderNode = (lessonId, cx, cy) => {
      const isFinished = (this.state.lessonsFinished || []).includes(lessonId);
      const isCurrent = this.state.currentLessonId === lessonId;

      if (isFinished) {
        return `
          <g class="map-node finished" data-lesson="${lessonId}" transform="translate(${cx}, ${cy})" tabindex="0" role="button" aria-label="Completed lesson: ${lessonId}">
            <circle r="14" fill="#E8930C"/>
            <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        `;
      } else if (isCurrent) {
        return `
          <g class="map-node active current-node" data-lesson="${lessonId}" transform="translate(${cx}, ${cy})" tabindex="0" role="button" aria-label="Active lesson: ${lessonId}">
            <circle r="16" fill="#FFFFFF" stroke="#0E1A2B" stroke-width="3"/>
            <circle r="6.5" fill="#0E1A2B"/>
            <text x="26" y="4" class="node-count map-node-label" pointer-events="none" style="letter-spacing:0.12em; fill:#0E1A2B; font-weight:700; user-select:none; font-size:11px;">YOU ARE HERE</text>
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
                  <span class="stat-value">${finishedCount} / 19</span>
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
                The six signs you get wrong most often, pulled from every lesson you have done.
              </p>
              <div class="chip-group">
                ${(this.state.refresherSigns || ["WATER", "THURSDAY", "COUSIN", "NINE"]).map(s => `<span class="chip-weak">${s}</span>`).join('')}
              </div>
              <button class="btn-link" id="btn-practise-refresher">Practise these</button>
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

          <!-- Main Tree Canvas matching img_1.png Hand Handoff -->
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

            <!-- Hand Graphic SVG -->
            <div class="map-canvas-container">
              <svg class="map-svg" viewBox="0 0 760 620" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- ================= 5 STRAIGHT RADIATING FINGERS ================= -->
                <!-- Finger 1: Thumb (Fingerspelling) -->
                <line x1="380" y1="535" x2="190" y2="340" stroke="${u1.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="${u1.done > 0 ? "3.5" : "3"}" stroke-linecap="round"/>
                
                <!-- Finger 2: Index (Greetings) -->
                <line x1="380" y1="535" x2="315" y2="185" stroke="${u2.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="${u2.done > 0 ? "3.5" : "3"}" stroke-linecap="round"/>
                
                <!-- Finger 3: Middle (Food & drink) -->
                <line x1="380" y1="535" x2="385" y2="145" stroke="${u3.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="${u3.done > 0 ? "3.5" : "3"}" stroke-linecap="round"/>
                
                <!-- Finger 4: Ring (Family) -->
                <line x1="380" y1="535" x2="465" y2="175" stroke="${u4.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="${u4.done > 0 ? "3.5" : "3"}" stroke-linecap="round"/>
                
                <!-- Finger 5: Pinky (Numbers) -->
                <line x1="380" y1="535" x2="575" y2="270" stroke="${u5.done > 0 ? "#F7DDB0" : "#D2DAE4"}" stroke-width="${u5.done > 0 ? "3.5" : "3"}" stroke-linecap="round"/>

                <!-- ================= CURVED KNUCKLE ARC (DASHED BRIDGE) ================= -->
                <path d="M 296 449 C 330 422, 360 416, 381 418 C 402 418, 425 422, 446 445" stroke="#D2DAE4" stroke-width="2" stroke-dasharray="4 4" fill="none"/>

                <!-- ================= UNIT LABELS ABOVE FINGER TIPS ================= -->
                <!-- Thumb: Fingerspelling -->
                <text x="190" y="295" text-anchor="middle" class="node-count">${u1.done} / 3</text>
                <text x="190" y="315" text-anchor="middle" class="node-label">Fingerspelling</text>

                <!-- Index: Greetings -->
                <text x="315" y="140" text-anchor="middle" class="node-count">${u2.done} / 4</text>
                <text x="315" y="160" text-anchor="middle" class="node-label">Greetings</text>

                <!-- Middle: Food & drink -->
                <text x="385" y="100" text-anchor="middle" class="node-count">${u3.done} / 4</text>
                <text x="385" y="120" text-anchor="middle" class="node-label">Food & drink</text>

                <!-- Ring: Family -->
                <text x="465" y="130" text-anchor="middle" class="node-count">${u4.done} / 4</text>
                <text x="465" y="150" text-anchor="middle" class="node-label" style="${u4.done === 0 ? "fill:#7D8CA1;" : ""}">Family</text>

                <!-- Pinky: Numbers -->
                <text x="575" y="225" text-anchor="middle" class="node-count">${u5.done} / 4</text>
                <text x="575" y="245" text-anchor="middle" class="node-label" style="${u5.done === 0 ? "fill:#7D8CA1;" : ""}">Numbers</text>

                <!-- ================= 19 LESSON NODES ALONG FINGERS ================= -->
                <!-- Finger 1: Thumb (3 nodes: fs-1, fs-2, fs-3) -->
                ${renderNode("fs-3", 190, 340)}
                ${renderNode("fs-2", 243, 395)}
                ${renderNode("fs-1", 296, 449)}

                <!-- Finger 2: Index (4 nodes: greet-1, greet-2, greet-3, greet-4) -->
                ${renderNode("greet-4", 315, 185)}
                ${renderNode("greet-3", 330, 266)}
                ${renderNode("greet-2", 345, 346)}
                ${renderNode("greet-1", 359, 423)}

                <!-- Finger 3: Middle (4 nodes: food-1, food-2, food-3, food-4) -->
                ${renderNode("food-4", 385, 145)}
                ${renderNode("food-3", 384, 235)}
                ${renderNode("food-2", 383, 328)}
                ${renderNode("food-1", 381, 418)}

                <!-- Finger 4: Ring (4 nodes: fam-1, fam-2, fam-3, fam-4) -->
                ${renderNode("fam-4", 465, 175)}
                ${renderNode("fam-3", 445, 258)}
                ${renderNode("fam-2", 426, 341)}
                ${renderNode("fam-1", 407, 420)}

                <!-- Finger 5: Pinky (4 nodes: num-1, num-2, num-3, num-4) -->
                ${renderNode("num-4", 575, 270)}
                ${renderNode("num-3", 532, 328)}
                ${renderNode("num-2", 489, 387)}
                ${renderNode("num-1", 446, 445)}

                <!-- ================= BASE START WRIST NODE ================= -->
                <g class="map-node ${finishedCount > 0 ? "finished" : "active current-node"}" data-lesson="${this.state.currentLessonId}" transform="translate(380, 535)" tabindex="0" role="button" aria-label="Start origin">
                  ${finishedCount > 0 ? `
                    <circle r="15" fill="#E8930C"/>
                    <path d="M-4.5 0.5 L-1.5 3.5 L5 -3" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                  ` : `
                    <circle r="16" fill="#FFFFFF" stroke="#0E1A2B" stroke-width="3"/>
                    <circle r="6.5" fill="#0E1A2B"/>
                  `}
                </g>
                <text x="380" y="572" text-anchor="middle" class="node-count" style="letter-spacing:0.14em; fill:#7D8CA1; font-size:11px; font-weight:700;">START</text>
              </svg>
            </div>

            <!-- Legend Footer matching img_1.png -->
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
