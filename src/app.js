// src/app.js
// SignSense Main Application Router & Orchestrator
// Coordinates AuthView, ExerciseMap, and ExerciseView with Route Guards

import { AuthView } from "./components/auth-view.js";
import { ExerciseMap } from "./components/exercise-map.js";
import { ExerciseView } from "./components/exercise-view.js";
import { getLessonById } from "./data/curriculum.js";
import {
  getSessionData,
  loadLearnerState,
  saveLearnerState,
  clearSessionData
} from "./utils/storage.js";

class SignSenseApp {
  constructor() {
    this.appContainer = document.getElementById("app");
    this.currentViewInstance = null;

    window.addEventListener("hashchange", () => this.handleRoute());
  }

  init() {
    const session = getSessionData();
    if (!session && !window.location.hash.startsWith("#/login") && !window.location.hash.startsWith("#/signup")) {
      window.location.hash = "#/signup";
    } else if (!window.location.hash) {
      window.location.hash = "#/map";
    } else {
      this.handleRoute();
    }
  }

  handleRoute() {
    const hash = window.location.hash || "#/signup";
    const session = getSessionData();

    // Destroy active view instance safely
    if (this.currentViewInstance && typeof this.currentViewInstance.destroy === "function") {
      this.currentViewInstance.destroy();
      this.currentViewInstance = null;
    }

    // Public Auth Routes
    if (hash === "#/signup") {
      this.renderAuth("signup");
      return;
    }

    if (hash === "#/login") {
      this.renderAuth("login");
      return;
    }

    // Protected Routes: #/map and #/exercise/:id require an active session
    if (!session) {
      window.location.hash = "#/signup";
      return;
    }

    if (hash.startsWith("#/exercise/")) {
      const lessonId = hash.replace("#/exercise/", "");
      this.renderExercise(lessonId);
    } else {
      this.renderMap();
    }
  }

  renderAuth(mode = "signup") {
    this.appContainer.innerHTML = "";
    this.currentViewInstance = new AuthView(
      this.appContainer,
      mode,
      (_user) => {
        window.location.hash = "#/map";
      },
      (_guestUser) => {
        window.location.hash = "#/map";
      }
    );
    this.currentViewInstance.mount();
  }

  renderMap() {
    this.appContainer.innerHTML = "";
    this.currentViewInstance = new ExerciseMap(
      this.appContainer,
      (selectedLessonId) => {
        const state = loadLearnerState();
        state.currentLessonId = selectedLessonId;
        saveLearnerState(state);
        window.location.hash = `#/exercise/${selectedLessonId}`;
      },
      () => {
        clearSessionData();
        window.location.hash = "#/login";
      }
    );
    this.currentViewInstance.mount();
  }

  renderExercise(lessonId) {
    const lesson = getLessonById(lessonId);
    this.appContainer.innerHTML = "";
    this.currentViewInstance = new ExerciseView(this.appContainer, lesson, () => {
      window.location.hash = "#/map";
    });
    this.currentViewInstance.mount();
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new SignSenseApp();
  app.init();
});
