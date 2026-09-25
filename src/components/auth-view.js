// src/components/auth-view.js
// SignSense Authentication View (Login & Sign Up)
// Harmonized with Upstream Aesthetic (Poppins font, background.jpg, man.png, lock.png, #4CAF50)
// Supports ephemeral in-memory accounts with strict blank-slate initialization

import { saveSessionData, saveLearnerState, createBlankState } from "../utils/storage.js";

export class AuthView {
  constructor(containerElement, initialMode = "signup", onSuccess, onGuest) {
    this.container = containerElement;
    this.mode = initialMode; // "signup" or "login"
    this.onSuccess = onSuccess;
    this.onGuest = onGuest;
    this.errorMessage = "";
    this.loading = false;
  }

  mount() {
    this.render();
    this.bindEvents();
  }

  setMode(newMode) {
    this.mode = newMode;
    this.errorMessage = "";
    this.render();
    this.bindEvents();
  }

  render() {
    const isSignup = this.mode === "signup";

    this.container.innerHTML = `
      <div class="auth-wrapper" role="main">
        <div class="auth-card" role="region" aria-labelledby="auth-heading">
          <!-- Brand Badge -->
          <div class="auth-brand">
            <div class="brand-mark" aria-hidden="true"></div>
            <span class="brand-badge">AUSLAN</span>
          </div>

          <h1 class="auth-title" id="auth-heading">
            ${isSignup ? "SignSense Sign Up" : "SignSense Login"}
          </h1>
          <p class="auth-sub">
            ${isSignup
              ? "Create your account to start learning Auslan from scratch."
              : "Login to access your SignSense account."}
          </p>

          ${this.errorMessage ? `
            <div class="auth-error-banner" role="alert" aria-live="assertive">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" style="vertical-align:-2px; margin-right:6px;">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              ${this.errorMessage}
            </div>
          ` : ""}

          <form id="auth-form" class="auth-form" novalidate>
            <!-- Username / Identifier -->
            <div class="auth-field">
              <label class="auth-label" for="auth-username">
                ${isSignup ? "Username" : "Username or Email"}
              </label>
              <div class="auth-input-row">
                <img src="/public/assets/images/man.png" class="auth-icon" alt="" aria-hidden="true" />
                <input
                  type="text"
                  id="auth-username"
                  name="username"
                  class="auth-input"
                  placeholder="${isSignup ? "Choose a username" : "Enter your username or email"}"
                  required
                  autocomplete="${isSignup ? "username" : "username"}"
                  ${this.loading ? "disabled" : ""}
                />
              </div>
            </div>

            <!-- Email (Signup only) -->
            ${isSignup ? `
              <div class="auth-field">
                <label class="auth-label" for="auth-email">Email Address</label>
                <div class="auth-input-row">
                  <span class="auth-icon-text" aria-hidden="true">@</span>
                  <input
                    type="email"
                    id="auth-email"
                    name="email"
                    class="auth-input"
                    placeholder="learner@example.com"
                    required
                    autocomplete="email"
                    ${this.loading ? "disabled" : ""}
                  />
                </div>
              </div>
            ` : ""}

            <!-- Password -->
            <div class="auth-field">
              <label class="auth-label" for="auth-password">Password</label>
              <div class="auth-input-row">
                <img src="/public/assets/images/lock.png" class="auth-icon" alt="" aria-hidden="true" />
                <input
                  type="password"
                  id="auth-password"
                  name="password"
                  class="auth-input"
                  placeholder="${isSignup ? "Create a secure password (min 6 chars)" : "Enter your password"}"
                  required
                  autocomplete="${isSignup ? "new-password" : "current-password"}"
                  ${this.loading ? "disabled" : ""}
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              id="auth-submit-btn"
              class="auth-btn-submit"
              ${this.loading ? "disabled" : ""}
            >
              ${this.loading
                ? "Please wait..."
                : isSignup ? "Create Account" : "Login"}
            </button>
          </form>

          <!-- Toggle between login and signup -->
          <p class="auth-toggle-link">
            ${isSignup
              ? `Already have an account? <a href="#/login" id="toggle-auth-btn">Login here</a>`
              : `Don't have an account? <a href="#/signup" id="toggle-auth-btn">Sign up here</a>`}
          </p>

          <!-- Guest Option -->
          <div class="auth-guest-divider">or explore as guest</div>
          <button type="button" id="btn-guest-login" class="btn-guest" ${this.loading ? "disabled" : ""}>
            Start with Fresh Blank Slate (No Signup)
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const form = this.container.querySelector("#auth-form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    const toggleBtn = this.container.querySelector("#toggle-auth-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const nextMode = this.mode === "signup" ? "login" : "signup";
        window.location.hash = `#/${nextMode}`;
      });
    }

    const guestBtn = this.container.querySelector("#btn-guest-login");
    if (guestBtn) {
      guestBtn.addEventListener("click", () => this.handleGuest());
    }

    // Auto-focus the first input
    const firstInput = this.container.querySelector("#auth-username");
    if (firstInput) {
      firstInput.focus();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.loading) return;

    const usernameInput = this.container.querySelector("#auth-username");
    const passwordInput = this.container.querySelector("#auth-password");
    const emailInput = this.container.querySelector("#auth-email");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const email = emailInput ? emailInput.value.trim() : "";

    // Client-side quick validation
    if (!username) {
      this.errorMessage = "Please enter your username.";
      this.render();
      this.bindEvents();
      return;
    }

    if (this.mode === "signup") {
      if (username.length < 3) {
        this.errorMessage = "Username must be at least 3 characters.";
        this.render();
        this.bindEvents();
        return;
      }
      if (!email || !email.includes("@")) {
        this.errorMessage = "Please enter a valid email address.";
        this.render();
        this.bindEvents();
        return;
      }
      if (password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters.";
        this.render();
        this.bindEvents();
        return;
      }
    } else {
      if (!password) {
        this.errorMessage = "Please enter your password.";
        this.render();
        this.bindEvents();
        return;
      }
    }

    this.loading = true;
    this.errorMessage = "";
    this.render();
    this.bindEvents();

    try {
      const endpoint = this.mode === "signup" ? "/api/signup" : "/api/login";
      const payload = this.mode === "signup"
        ? { username, email, password }
        : { identifier: username, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        this.errorMessage = data.error || "Authentication failed. Please try again.";
        this.loading = false;
        this.render();
        this.bindEvents();
        return;
      }

      // Successful Auth
      const sessionUser = {
        name: data.user.username,
        initials: data.user.username.slice(0, 2).toUpperCase(),
        email: data.user.email
      };

      saveSessionData({
        user: sessionUser,
        token: data.token,
        progress: data.progress
      });

      saveLearnerState({
        user: sessionUser,
        ...data.progress
      });

      if (typeof this.onSuccess === "function") {
        this.onSuccess(sessionUser);
      }
    } catch (err) {
      // In case of network error or server offline fallback
      console.warn("Server auth unreachable, using local blank-slate session", err);
      const sessionUser = {
        name: username,
        initials: username.slice(0, 2).toUpperCase(),
        email: email || `${username.toLowerCase()}@local.signsence`
      };
      const blankState = createBlankState(sessionUser.name, sessionUser.email);
      saveSessionData({
        user: sessionUser,
        token: "local-ephemeral-session",
        progress: blankState
      });
      saveLearnerState(blankState);

      if (typeof this.onSuccess === "function") {
        this.onSuccess(sessionUser);
      }
    }
  }

  handleGuest() {
    const guestUser = {
      name: "Guest Learner",
      initials: "GL",
      email: "guest@signsense.local"
    };
    const blankState = createBlankState(guestUser.name, guestUser.email);

    saveSessionData({
      user: guestUser,
      token: "guest-session",
      progress: blankState
    });
    saveLearnerState(blankState);

    if (typeof this.onGuest === "function") {
      this.onGuest(guestUser);
    } else if (typeof this.onSuccess === "function") {
      this.onSuccess(guestUser);
    }
  }

  destroy() {
    this.container.innerHTML = "";
  }
}
