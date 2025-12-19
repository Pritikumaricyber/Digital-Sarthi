const registerButton = document.getElementById('register');
const loginButton = document.getElementById('login');
const container = document.getElementById('container');

// Flip effect
registerButton.onclick = () => container.className = 'active';
loginButton.onclick = () => container.className = 'close';

// Handle login form
// -------- LOGIN FORM --------
const loginForm = document.querySelector('.login form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value.trim();
  const password = loginForm.querySelector('input[type="password"]').value.trim();

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      alert(`Welcome back, ${result.name}!`);

      // Save details
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userName", result.name);

      // Redirect to landing page
      window.location.href = "./landing.html";
    } else {
      alert("Invalid email or password");
    }
  } catch {
    alert("Something went wrong. Please try again.");
  }

  loginForm.reset();
});


// Handle register form
const registerForm = document.querySelector('.register form');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = registerForm.querySelector('input[placeholder="name"]').value.trim();
  const email = registerForm.querySelector('input[type="email"]').value.trim();
  const password = registerForm.querySelector('input[type="password"]').value.trim();

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();

    if (result.success) {
      alert("Registration successful! Please log in.");
      container.className = "close"; // flip back to login
    } else {
      alert("Registration failed: " + result.message);
    }
  } catch (error) {
    console.error("Register error:", error);
    alert("Something went wrong. Please try again.");
  }

  registerForm.reset();
});