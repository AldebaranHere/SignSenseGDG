// src/utils/storage.js
// Ephemeral Learner Session & State Management
// Uses sessionStorage & in-memory server API (Zero Disk Writes, completely ephemeral)

const SESSION_KEY = "signsense_active_session_v2";

export function createBlankState(username = "Learner", email = "") {
  return {
    user: {
      name: username,
      initials: username ? username.slice(0, 2).toUpperCase() : "SS",
      email: email || ""
    },
    lessonsFinished: [],
    currentLessonId: "fs-1",
    signsLearned: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    refresherSigns: ["A", "E", "I", "B", "C"],
    unlockedUnits: ["fingerspelling"]
  };
}

export function getSessionData() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function saveSessionData(data) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("sessionStorage write failed", err);
  }
}

export function clearSessionData() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {}
}

export function getAuthenticatedUser() {
  const data = getSessionData();
  return data ? data.user : null;
}

export function loadLearnerState() {
  const data = getSessionData();
  if (data && data.progress) {
    return {
      user: data.user,
      ...data.progress
    };
  }
  // Return guest/blank state if unauthenticated
  return createBlankState();
}

export async function syncProgressToServer(progress) {
  const session = getSessionData();
  if (!session || !session.token) return;

  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token}`
      },
      body: JSON.stringify(progress)
    });
  } catch (e) {
    // Graceful offline fallback
  }
}

export function saveLearnerState(state) {
  const session = getSessionData() || {};
  session.user = state.user;
  session.progress = {
    lessonsFinished: state.lessonsFinished || [],
    currentLessonId: state.currentLessonId || "fs-1",
    signsLearned: state.signsLearned || 0,
    totalAttempts: state.totalAttempts || 0,
    correctAttempts: state.correctAttempts || 0,
    refresherSigns: state.refresherSigns || [],
    unlockedUnits: state.unlockedUnits || ["fingerspelling"]
  };
  saveSessionData(session);
  syncProgressToServer(session.progress);
}

export function markLessonComplete(lessonId, newSignsCount = 1) {
  const state = loadLearnerState();
  if (!state.lessonsFinished.includes(lessonId)) {
    state.lessonsFinished.push(lessonId);
    state.signsLearned += newSignsCount;
  }
  state.correctAttempts += newSignsCount;
  state.totalAttempts += newSignsCount;

  // Determine next sequential lesson in curriculum
  state.currentLessonId = getNextSequentialLessonId(lessonId, state.lessonsFinished);

  saveLearnerState(state);
  return state;
}

export function getAccuracyRate(state) {
  if (!state.totalAttempts || state.totalAttempts === 0) return 0;
  return Math.round((state.correctAttempts / state.totalAttempts) * 100);
}

function getNextSequentialLessonId(completedLessonId, finishedList) {
  const LESSON_ORDER = [
    "fs-1", "fs-2", "fs-3",
    "greet-1", "greet-2", "greet-3", "greet-4",
    "food-1", "food-2", "food-3", "food-4",
    "fam-1", "fam-2", "fam-3", "fam-4",
    "num-1", "num-2", "num-3", "num-4"
  ];
  const idx = LESSON_ORDER.indexOf(completedLessonId);
  if (idx !== -1 && idx + 1 < LESSON_ORDER.length) {
    return LESSON_ORDER[idx + 1];
  }
  return completedLessonId;
}
