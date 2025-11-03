// Copied from /static/script.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const authForm = document.getElementById('authForm');
    const authSubmit = document.getElementById('authSubmit');
    const toggleAuth = document.getElementById('toggleAuth');
    const userGreeting = document.getElementById('user-greeting');
    const myItinerariesSection = document.getElementById('my-itineraries-section');

    let isLogin = true;

    if (loginBtn) {
        loginBtn.onclick = () => {
            authModal.style.display = 'block';
            isLogin = true;
            modalTitle.textContent = 'Login';
            authSubmit.textContent = 'Login';
            toggleAuth.innerHTML = `Don't have an account? <a href="#" id="switchToSignup">Sign up</a>`;
        };
    }

    if (closeModal) {
        closeModal.onclick = () => { authModal.style.display = 'none'; };
    }

    window.onclick = (event) => { if (event.target == authModal) authModal.style.display = 'none'; };

    if (toggleAuth) {
        toggleAuth.onclick = (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            if (isLogin) {
                modalTitle.textContent = 'Login';
                authSubmit.textContent = 'Login';
                toggleAuth.innerHTML = `Don't have an account? <a href="#" id="switchToSignup">Sign up</a>`;
            } else {
                modalTitle.textContent = 'Sign Up';
                authSubmit.textContent = 'Sign Up';
                toggleAuth.innerHTML = `Already have an account? <a href="#" id="switchToSignup">Login</a>`;
            }
        };
    }

    if (authForm) {
        authForm.onsubmit = async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch(`/api/${isLogin ? 'login' : 'signup'}/`, {
                    method: 'POST', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password})
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', username);
                    if (userGreeting) {
                        userGreeting.textContent = `Welcome, ${username}!`;
                        userGreeting.style.display = 'inline';
                    }
                    if (authModal) authModal.style.display = 'none';
                } else { alert(data.error || 'Authentication failed'); }
            } catch { alert('An error occurred. Please try again.'); }
        };
    }
});

