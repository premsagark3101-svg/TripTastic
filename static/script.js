// Placeholder JS for login/signup modal
// Add your modal logic here 

// Modal and Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const authForm = document.getElementById('authForm');
    const authSubmit = document.getElementById('authSubmit');
    const toggleAuth = document.getElementById('toggleAuth');
    const switchToSignup = document.getElementById('switchToSignup');
    const userGreeting = document.getElementById('user-greeting');
    const authLinks = document.getElementById('auth-links');
    const myItinerariesSection = document.getElementById('my-itineraries-section');

    let isLogin = true;

    // Show modal
    loginBtn.onclick = () => {
        authModal.style.display = 'block';
        isLogin = true;
        modalTitle.textContent = 'Login';
        authSubmit.textContent = 'Login';
        toggleAuth.innerHTML = `Don't have an account? <a href="#" id="switchToSignup">Sign up</a>`;
    };

    // Close modal
    closeModal.onclick = () => {
        authModal.style.display = 'none';
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == authModal) {
            authModal.style.display = 'none';
        }
    };

    // Toggle between login and signup
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

    // Handle form submission
    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`/api/${isLogin ? 'login' : 'signup'}/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                showUserUI(username);
                authModal.style.display = 'none';
            } else {
                alert(data.error || 'Authentication failed');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    // Show user UI after login
    function showUserUI(username) {
        userGreeting.textContent = `Welcome, ${username}!`;
        userGreeting.style.display = 'inline';
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('signup-link').style.display = 'none';
        myItinerariesSection.style.display = 'block';
        loadUserItineraries();
    }

    // Load user's itineraries
    async function loadUserItineraries() {
        try {
            const response = await fetch('/api/itineraries/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const itineraries = await response.json();
                const itinerariesList = document.getElementById('my-itineraries-list');
                itinerariesList.innerHTML = itineraries.map(itinerary => `
                    <li class="transparent-box">
                        <h3>${itinerary.destination}</h3>
                        <p>${itinerary.duration} days</p>
                        <p>Created: ${new Date(itinerary.created_at).toLocaleDateString()}</p>
                    </li>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading itineraries:', error);
        }
    }

    // Check if user is already logged in
    const username = localStorage.getItem('username');
    if (username) {
        showUserUI(username);
    }

    // Handle search functionality
    const searchButton = document.querySelector('.search-button');
    const searchBar = document.querySelector('.search-bar');

    searchButton.onclick = () => {
        const destination = searchBar.value.trim();
        if (destination) {
            window.location.href = `/itinerary/?destination=${encodeURIComponent(destination)}`;
        }
    };

    // Handle bottom start button
    const bottomStartButton = document.getElementById('bottom-start-button');
    bottomStartButton.onclick = () => {
        window.location.href = '/itinerary/';
    };
}); 