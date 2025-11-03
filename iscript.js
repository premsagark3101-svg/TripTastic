document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const loginSection = document.getElementById("login-section");
    const itinerarySection = document.getElementById("itinerary-section");
    const historySection = document.getElementById("history-section");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const logoutBtn = document.getElementById("logout-btn");
    const generateBtn = document.getElementById("generate-itinerary");
    const itineraryResults = document.getElementById("itinerary-results");
    const historyList = document.getElementById("history-list");
    const authLinks = document.getElementById("auth-links");

    // Utility
    function getToken() {
        return localStorage.getItem("token");
    }
    function setToken(token) {
        localStorage.setItem("token", token);
    }
    function removeToken() {
        localStorage.removeItem("token");
    }
    function showSection(section) {
        loginSection.style.display = "none";
        itinerarySection.style.display = "none";
        historySection.style.display = "none";
        itineraryResults.classList.add("hidden");
        authLinks.style.display = "none";
        if (section) section.style.display = "block";
        if (section === itinerarySection || section === historySection) {
            authLinks.style.display = "flex";
        }
    }

    // Auth State
    function isLoggedIn() {
        return !!getToken();
    }

    // Update UI based on login state
    function updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const historyBtn = document.getElementById('historyBtn');
        const userSection = document.getElementById('userSection');
        const loginSection = document.getElementById('loginSection');
        const signupSection = document.getElementById('signupSection');

        if (isLoggedIn()) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            historyBtn.style.display = 'block';
            userSection.style.display = 'block';
            loginSection.style.display = 'none';
            signupSection.style.display = 'none';
        } else {
            loginBtn.style.display = 'block';
            signupBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            historyBtn.style.display = 'none';
            userSection.style.display = 'none';
        }
    }

    // Show correct UI on load
    updateUI();

    // Login
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        try {
            const res = await fetch("/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) throw new Error("Login failed");
            const data = await res.json();
            setToken(data.access);
            updateUI();
            alert("Login successful!");
        } catch (err) {
            alert("Login error: " + err.message);
        }
    });

    // Signup
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        try {
            const res = await fetch("/api/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            if (!res.ok) throw new Error("Signup failed");
            const data = await res.json();
            setToken(data.access);
            updateUI();
            alert("Signup successful!");
        } catch (err) {
            alert("Signup error: " + err.message);
        }
    });

    // Logout
    logoutBtn.addEventListener("click", function () {
        removeToken();
        updateUI();
        alert("Logged out successfully");
    });

    // Generate Itinerary
    generateBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            alert("Please login first");
            return;
        }
        const destination = document.getElementById("destination").value;
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        const people = document.getElementById("people").value;
        const budget = document.getElementById("budget").value;
        if (!destination || !startDate || !endDate || !people || !budget) {
            alert("Please fill all fields!");
            return;
        }
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;
        try {
            const res = await fetch("/api/generate-itinerary/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getToken()
                },
                body: JSON.stringify({ destination, start_date: startDate, end_date: endDate, people, budget })
            });
            if (!res.ok) throw new Error("Failed to generate itinerary");
            const data = await res.json();
            displayItinerary(data);
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            generateBtn.textContent = "Generate Itinerary";
            generateBtn.disabled = false;
        }
    });

    // Display Itinerary
    function displayItinerary(data) {
        itineraryResults.innerHTML = `
            <h2>Your Personalized Itinerary</h2>
            <div class="itinerary-card"><h3>🏰 Places to Visit</h3><ul>${data.places.map(p => `<li>${p}</li>`).join('')}</ul></div>
            <div class="itinerary-card"><h3>🏨 Hotels</h3><ul>${data.hotels.map(h => `<li>${h}</li>`).join('')}</ul></div>
            <div class="itinerary-card"><h3>🍽️ Food</h3><ul>${data.food.map(f => `<li>${f}</li>`).join('')}</ul></div>
            <div class="itinerary-card"><h3>🗺️ Guides</h3><ul>${data.guides.map(g => `<li>${g.name} (${g.contact})</li>`).join('')}</ul></div>
            <div class="itinerary-card"><h3>📍 Map</h3><div class="map-placeholder">${data.map}</div></div>
        `;
        itineraryResults.classList.remove("hidden");
        itineraryResults.scrollIntoView({ behavior: 'smooth' });
    }

    // Fetch and Display History
    async function fetchHistory() {
        if (!isLoggedIn()) {
            alert("Please login first");
            return;
        }
        try {
            const res = await fetch("/api/history/", {
                headers: { "Authorization": "Bearer " + getToken() }
            });
            if (!res.ok) throw new Error("Failed to fetch history");
            const data = await res.json();
            displayHistory(data);
        } catch (err) {
            alert("Error fetching history: " + err.message);
        }
    }

    // Display history function
    function displayHistory(data) {
        historyList.innerHTML = data.map(itinerary => `
            <div class="history-item">
                <h3>${itinerary.destination}</h3>
                <p>Dates: ${itinerary.start_date} to ${itinerary.end_date}</p>
                <button onclick="displayItinerary(${JSON.stringify(itinerary.response)})">
                    View Details
                </button>
            </div>
        `).join('');
        historySection.style.display = "block";
    }

    // Show itinerary from history
    window.showHistoryItinerary = async function (itinerary) {
        displayItinerary(itinerary);
    };

    // Date pickers (allow past dates)
    document.getElementById("start-date").max = "";
    document.getElementById("end-date").max = "";

    // Hide dummy data
    itineraryResults.classList.add("hidden");
});