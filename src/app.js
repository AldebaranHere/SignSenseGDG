// src/app.js
// SignSense Main Application Router & Orchestrator

import { ExerciseMap } from "./components/exercise-map.js";
import { ExerciseView } from "./components/exercise-view.js";
import { getLessonById } from "./data/curriculum.js";
import { loadLearnerState, saveLearnerState } from "./utils/storage.js";

class SignSenseApp {
  constructor() {
    this.appContainer = document.getElementById("app");
    this.currentViewInstance = null;

    window.addEventListener("hashchange", () => this.handleRoute());
  }

  init() {
    if (!window.location.hash) {
      window.location.hash = "#/map";
    } else {
      this.handleRoute();
    }
  }

  handleRoute() {
    const hash = window.location.hash || "#/map";

    if (this.currentViewInstance && typeof this.currentViewInstance.destroy === "function") {
      this.currentViewInstance.destroy();
      this.currentViewInstance = null;
    }

    if (hash.startsWith("#/exercise/")) {
      const lessonId = hash.replace("#/exercise/", "");
      this.renderExercise(lessonId);
    } else {
      this.renderMap();
    }
  }

  renderMap() {
    this.appContainer.innerHTML = "";
    this.currentViewInstance = new ExerciseMap(this.appContainer, (selectedLessonId) => {
      // Update state current lesson
      const state = loadLearnerState();
      state.currentLessonId = selectedLessonId;
      saveLearnerState(state);

      window.location.hash = `#/exercise/${selectedLessonId}`;
    });
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
