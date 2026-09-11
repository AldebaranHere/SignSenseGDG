import { useRef, useState, useEffect } from "react";

const Login = () => {
  const usernameRef = useRef();
  const errorRef = useRef();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [user, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setUser("");
    setPassword("");
    setSuccess(true);
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="/mainmenu.html">Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errorRef} className={error ? "error" : "offscreen"} aria-live="assertive">
            {error}
          </p>
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={usernameRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button>Sign in</button>
          </form>
          <p>
            Need an account? <br />
            <span className="line">
              <a href="/signup.html">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;