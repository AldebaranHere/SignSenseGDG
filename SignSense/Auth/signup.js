document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    messageEl.className = "error";
    messageEl.textContent = data.error;
    return;
  }

  messageEl.className = "success";
  messageEl.textContent = "Account created! Redirecting to sign in...";
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 1000);
});
