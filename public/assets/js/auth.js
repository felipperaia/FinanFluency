// assets/js/auth.js
// Navbar toggle
function initNavbar() {
  const toggler = document.querySelector('.navbar-toggler');
  const links = document.querySelector('.navbar-links');
  toggler.addEventListener('click', () => {
    const exp = toggler.getAttribute('aria-expanded') === 'true';
    toggler.setAttribute('aria-expanded', !exp);
    links.classList.toggle('open');
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
  
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
          });
          const data = await res.json();
          if (res.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
          } else {
            alert(data.error || 'Erro no cadastro.');
          }
        } catch (error) {
          console.error('Erro no cadastro:', error);
        }
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (res.ok && data.token) {
            localStorage.setItem('token', data.token);
            alert('Login realizado com sucesso!');
            window.location.href = 'dashboard.html';
          } else {
            alert(data.error || 'Erro no login.');
          }
        } catch (error) {
          console.error('Erro no login:', error);
        }
      });
    }
  });

  // Auto refresh e init
document.addEventListener('DOMContentLoaded', () => { initNavbar(); });
  