// src/components/exercise-view.js
// Dual-Viewport Exercise Player implementing the SignSense learning loop

import { CameraTracker } from "./camera-tracker.js";
import { markLessonComplete } from "../utils/storage.js";

export class ExerciseView {
  constructor(containerElement, lessonData, onNavigateToMap) {
    this.container = containerElement;
    this.lesson = lessonData;
    this.onNavigateToMap = onNavigateToMap;

    this.currentSignIndex = 0;
    this.cameraTracker = null;
    this.playbackSpeed = 1.0;
    this.isVerdictShowing = false;
    this.verdictTimeout = null;
  }

  mount() {
    this.render();
    this.bindEvents();
    this.initCamera();
    this.loadCurrentSign();
  }

  render() {
    const signs = this.lesson.signs;
    const currentSign = signs[this.currentSignIndex];

    this.container.innerHTML = `
      <section class="exercise-page" aria-label="Sign Practice Session">
        <!-- Top Navigation Bar -->
        <header class="topbar">
          <button class="btn-back" id="btn-back-to-map" aria-label="Return to exercise map">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Exercise map</span>
          </button>

          <div class="where">
            <p class="eyebrow">${this.lesson.category}</p>
            <h1 class="lesson-title">${this.lesson.sentenceLabel}</h1>
          </div>

          <div class="steps-indicator" aria-label="Progress steps">
            ${signs.map((_, i) => `
              <div class="step-dash ${i < this.currentSignIndex ? 'done' : (i === this.currentSignIndex ? 'now' : '')}" id="step-dash-${i}"></div>
            `).join('')}
          </div>
        </header>

        <!-- Sentence Gloss Strip -->
        <div class="sentence-strip" role="region" aria-label="Sentence tokens">
          <div class="gloss-tokens" id="gloss-tokens">
            ${signs.map((s, i) => `
              <button class="token-pill ${i < this.currentSignIndex ? 'done' : (i === this.currentSignIndex ? 'now' : 'next')}" 
                      data-index="${i}" 
                      aria-label="Sign ${s.gloss}">
                ${i < this.currentSignIndex ? `
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10.5L8.5 15L16 5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                ` : ''}
                <span>${s.gloss}</span>
              </button>
            `).join('')}
          </div>

          <div class="sentence-meaning">${this.lesson.translation}</div>
        </div>

        <!-- Dual Viewport Panels Grid -->
        <div class="panels-grid">
          <!-- Left Viewport: The Sign Reference -->
          <article class="panel" aria-labelledby="tutor-header">
            <div class="panel-head">
              <span class="eyebrow" id="tutor-header">THE SIGN</span>
              <span class="eyebrow" id="sign-step-counter">SIGN ${this.currentSignIndex + 1} OF ${signs.length}</span>
            </div>

            <div class="stage-wrapper">
              <div class="stage-badge-paused" id="stage-badge">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="2" y="1" width="3" height="10" rx="1"/>
                  <rect x="7" y="1" width="3" height="10" rx="1"/>
                </svg>
                <span>PAUSED · YOUR TURN</span>
              </div>

              <div class="stage-sign-card">
                <strong id="stage-sign-name">${currentSign.gloss}</strong>
              </div>

              <!-- Media Display: Video or Image -->
              <div id="tutor-media-container" style="width:100%;height:100%;">
                ${currentSign.type === 'video' ? `
                  <video class="tutor-video" id="tutor-video-el" playsinline autoplay muted loop src="${currentSign.mediaUrl}"></video>
                ` : `
                  <img class="tutor-img" id="tutor-img-el" alt="Auslan sign for ${currentSign.gloss}" src="${currentSign.mediaUrl}">
                `}
              </div>

              <!-- Playback Speed Controls -->
              <div class="stage-controls" id="stage-speed-controls" style="${currentSign.type === 'video' ? '' : 'display:none;'}">
                <button class="btn-speed" data-spd="0.5">0.5x</button>
                <button class="btn-speed" data-spd="0.75">0.75x</button>
                <button class="btn-speed active" data-spd="1.0">1.0x</button>
              </div>
            </div>

            <div class="panel-timeline">
              <div class="track-segments">
                ${signs.map((_, i) => `
                  <div class="track-segment ${i <= this.currentSignIndex ? 'played' : ''}" id="track-seg-${i}"></div>
                `).join('')}
                <div class="track-marker"></div>
              </div>
              <div class="track-note">
                <span>The video stops after every sign.</span>
                <a href="${currentSign.signbankUrl}" target="_blank" rel="noopener noreferrer" class="signbank-dict-link" id="dict-link">
                  Auslan Signbank definition ↗
                </a>
              </div>
            </div>
          </article>

          <!-- Right Viewport: User Live Camera Feed -->
          <article class="panel" aria-labelledby="camera-header">
            <div class="panel-head">
              <span class="eyebrow" id="camera-header">YOUR CAMERA</span>
              <span class="eyebrow" id="camera-status-text" style="color:var(--green)">POSITION HANDS IN FRAME</span>
            </div>

            <div class="camera-stage">
              <!-- Viewfinder Green Corner Cropmarks -->
              <div class="corner-guide corner-tl"></div>
              <div class="corner-guide corner-tr"></div>
              <div class="corner-guide corner-bl"></div>
              <div class="corner-guide corner-br"></div>

              <!-- Live Video & Skeletal Overlay Canvas -->
              <video class="camera-feed" id="user-cam-feed" playsinline muted autoplay></video>
              <canvas class="camera-canvas" id="user-cam-canvas"></canvas>

              <!-- Real-time Confirmation Verdict Banner -->
              <div class="verdict-banner" id="verdict-banner" style="display:none;" aria-live="polite">
                <div class="verdict-circle">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10.5L8.5 15L16 5" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="verdict-text">
                  <strong id="verdict-sign-title">That's ${currentSign.gloss}</strong>
                  <span id="verdict-next-hint">Advancing...</span>
                </div>
              </div>
            </div>

            <div class="camera-foot">
              <div class="live-indicator">
                <div class="live-dot"></div>
                <span>Camera on</span>
              </div>
              <div class="privacy-notice">Video stays on your device.</div>
            </div>
          </article>
        </div>

        <!-- Exercise Controls Bar -->
        <div class="exercise-actions">
          <button class="btn-secondary" id="btn-replay-sign" aria-label="Replay current sign demonstration">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            <span>Replay Sign</span>
          </button>

          <button class="btn-confirm-next" id="btn-confirm-sign" aria-label="Confirm sign and advance">
            <span>Confirm Sign / Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Lesson Completion Modal -->
        <div class="modal-backdrop" id="completion-modal" style="display:none;" role="dialog" aria-modal="true">
          <div class="modal-card">
            <div class="modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 class="modal-title">Lesson Complete!</h2>
            <p class="modal-desc">
              You finished <strong>${this.lesson.title}</strong> and practiced all ${signs.length} signs. Your progress is saved.
            </p>
            <button class="btn-primary" id="btn-modal-continue">Continue to Exercise Map</button>
          </div>
        </div>
      </section>
    `;
  }

  bindEvents() {
    // Back to map
    this.container.querySelector("#btn-back-to-map").addEventListener("click", () => {
      this.destroy();
      this.onNavigateToMap();
    });

    // Speed toggles
    this.container.querySelectorAll(".btn-speed").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const spd = parseFloat(e.target.dataset.spd);
        this.playbackSpeed = spd;
        this.container.querySelectorAll(".btn-speed").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const video = this.container.querySelector("#tutor-video-el");
        if (video) video.playbackRate = spd;
      });
    });

    // Token pills click to jump to sign
    this.container.querySelectorAll(".token-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        this.jumpToSign(idx);
      });
    });

    // Replay button
    this.container.querySelector("#btn-replay-sign").addEventListener("click", () => {
      this.replayCurrentSign();
    });

    // Confirm & Next button
    this.container.querySelector("#btn-confirm-sign").addEventListener("click", () => {
      this.triggerSignSuccess();
    });

    // Keyboard shortcut (Space = Confirm, Escape = Back)
    this.handleKeyDown = (e) => {
      if (e.code === "Space" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        this.triggerSignSuccess();
      } else if (e.code === "Escape") {
        this.destroy();
        this.onNavigateToMap();
      }
    };
    window.addEventListener("keydown", this.handleKeyDown);

    // Modal Continue button
    this.container.querySelector("#btn-modal-continue").addEventListener("click", () => {
      this.destroy();
      this.onNavigateToMap();
    });
  }

  async initCamera() {
    const videoEl = this.container.querySelector("#user-cam-feed");
    const canvasEl = this.container.querySelector("#user-cam-canvas");
    const statusTextEl = this.container.querySelector("#camera-status-text");

    this.cameraTracker = new CameraTracker(videoEl, canvasEl, (status) => {
      if (statusTextEl) {
        statusTextEl.innerText = status;
      }
    });

    await this.cameraTracker.start();
  }

  loadCurrentSign() {
    const currentSign = this.lesson.signs[this.currentSignIndex];
    if (!currentSign) return;

    // Update Header Counter
    const counterEl = this.container.querySelector("#sign-step-counter");
    if (counterEl) counterEl.innerText = `SIGN ${this.currentSignIndex + 1} OF ${this.lesson.signs.length}`;

    // Update Stage Sign Name
    const stageSignNameEl = this.container.querySelector("#stage-sign-name");
    if (stageSignNameEl) stageSignNameEl.innerText = currentSign.gloss;

    // Update Dictionary Link
    const dictLinkEl = this.container.querySelector("#dict-link");
    if (dictLinkEl) dictLinkEl.href = currentSign.signbankUrl;

    // Update Media Container
    const mediaContainer = this.container.querySelector("#tutor-media-container");
    const speedControls = this.container.querySelector("#stage-speed-controls");

    if (currentSign.type === "video") {
      mediaContainer.innerHTML = `
        <video class="tutor-video" id="tutor-video-el" playsinline autoplay muted loop src="${currentSign.mediaUrl}"></video>
      `;
      if (speedControls) speedControls.style.display = "flex";
      const video = mediaContainer.querySelector("video");
      if (video) video.playbackRate = this.playbackSpeed;
    } else {
      mediaContainer.innerHTML = `
        <img class="tutor-img" id="tutor-img-el" alt="Auslan sign for ${currentSign.gloss}" src="${currentSign.mediaUrl}">
      `;
      if (speedControls) speedControls.style.display = "none";
    }

    // Update Token Pills
    this.updateTokenPills();

    // Update Step Dashes & Segments
    this.updateProgressTrackers();
  }

  updateTokenPills() {
    const pills = this.container.querySelectorAll(".token-pill");
    pills.forEach((pill, i) => {
      pill.className = `token-pill ${i < this.currentSignIndex ? 'done' : (i === this.currentSignIndex ? 'now' : 'next')}`;
      if (i < this.currentSignIndex) {
        pill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5L8.5 15L16 5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${this.lesson.signs[i].gloss}</span>
        `;
      } else {
        pill.innerHTML = `<span>${this.lesson.signs[i].gloss}</span>`;
      }
    });
  }

  updateProgressTrackers() {
    // Step dashes
    this.lesson.signs.forEach((_, i) => {
      const dash = this.container.querySelector(`#step-dash-${i}`);
      if (dash) {
        dash.className = `step-dash ${i < this.currentSignIndex ? 'done' : (i === this.currentSignIndex ? 'now' : '')}`;
      }
      const seg = this.container.querySelector(`#track-seg-${i}`);
      if (seg) {
        seg.className = `track-segment ${i <= this.currentSignIndex ? 'played' : ''}`;
      }
    });
  }

  replayCurrentSign() {
    const video = this.container.querySelector("#tutor-video-el");
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  }

  jumpToSign(index) {
    if (index >= 0 && index < this.lesson.signs.length) {
      this.currentSignIndex = index;
      this.loadCurrentSign();
    }
  }

  triggerSignSuccess() {
    if (this.isVerdictShowing) return;
    this.isVerdictShowing = true;

    const currentSign = this.lesson.signs[this.currentSignIndex];
    const isLastSign = this.currentSignIndex === this.lesson.signs.length - 1;
    const nextSign = !isLastSign ? this.lesson.signs[this.currentSignIndex + 1] : null;

    // Show Feedback Verdict Banner
    const banner = this.container.querySelector("#verdict-banner");
    const titleEl = this.container.querySelector("#verdict-sign-title");
    const hintEl = this.container.querySelector("#verdict-next-hint");

    if (banner && titleEl && hintEl) {
      titleEl.innerText = `That's ${currentSign.gloss}`;
      hintEl.innerText = isLastSign ? "Lesson complete!" : `Playing on to ${nextSign.gloss}...`;
      banner.style.display = "flex";
    }

    // Delay briefly then advance to the next sign
    this.verdictTimeout = setTimeout(() => {
      if (banner) banner.style.display = "none";
      this.isVerdictShowing = false;

      if (isLastSign) {
        this.completeLesson();
      } else {
        this.currentSignIndex++;
        this.loadCurrentSign();
      }
    }, 1200);
  }

  completeLesson() {
    markLessonComplete(this.lesson.id, this.lesson.signs.length);
    const modal = this.container.querySelector("#completion-modal");
    if (modal) modal.style.display = "grid";
  }

  destroy() {
    if (this.handleKeyDown) {
      window.removeEventListener("keydown", this.handleKeyDown);
    }
    if (this.verdictTimeout) {
      clearTimeout(this.verdictTimeout);
    }
    if (this.cameraTracker) {
      this.cameraTracker.stop();
      this.cameraTracker = null;
    }
  }
}
