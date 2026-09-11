async function loadUser() {
  const res = await fetch("/api/me");

  if (!res.ok) {
    // Not logged in -> send back to the sign in page
    window.location.href = "/login.html";
    return;
  }

  const data = await res.json();
  document.getElementById("welcome").textContent = `Welcome, ${data.username}!`;
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login.html";
});

loadUser();
