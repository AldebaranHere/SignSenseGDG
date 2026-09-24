// src/utils/storage.js
// Local persistence for SignSense learner progress & settings

const STORAGE_KEY = "signsense_learner_state_v1";

const DEFAULT_STATE = {
  user: {
    name: "Priya Raman",
    initials: "PR",
    email: "priya.raman@example.com"
  },
  lessonsFinished: ["fs-1", "fs-2", "fs-3", "greet-1", "greet-2", "greet-3", "greet-4", "fam-1", "fam-2"],
  currentLessonId: "food-1",
  signsLearned: 52,
  totalAttempts: 125,
  correctAttempts: 105,
  refresherSigns: ["WATER", "THURSDAY", "COUSIN", "NINE"],
  unlockedUnits: ["fingerspelling", "greetings", "food-drink", "family-home"],
  cameraMirror: true,
  landmarkOverlay: true
};

export function loadLearnerState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLearnerState(DEFAULT_STATE);
      return DEFAULT_STATE;
    }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (err) {
    console.warn("Storage load error; using defaults", err);
    return DEFAULT_STATE;
  }
}

export function saveLearnerState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Storage save error", err);
  }
}

export function markLessonComplete(lessonId, newSignsCount = 1) {
  const state = loadLearnerState();
  if (!state.lessonsFinished.includes(lessonId)) {
    state.lessonsFinished.push(lessonId);
    state.signsLearned += newSignsCount;
  }
  state.correctAttempts += newSignsCount;
  state.totalAttempts += newSignsCount;
  saveLearnerState(state);
  return state;
}

export function getAccuracyRate(state) {
  if (!state.totalAttempts || state.totalAttempts === 0) return 84;
  return Math.round((state.correctAttempts / state.totalAttempts) * 100);
}
