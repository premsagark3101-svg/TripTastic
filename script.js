document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.querySelector(".hero");
    heroSection.style.opacity = "0";
    heroSection.style.transition = "opacity 1.5s ease-in-out";
    setTimeout(() => { heroSection.style.opacity = "1"; }, 500);

    const logo = document.querySelector(".logo");
    logo.style.opacity = "0";
    logo.style.animation = "fadeIn 2.5s ease-in-out forwards";

    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            alert("Searching for: " + searchBar.value);
        }
    });

    document.getElementById("bottom-start-button").addEventListener("click", function() {
        window.location.href = "itinerary.html";
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const bookButtons = document.querySelectorAll('.book-button');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const guideName = this.closest('.guide-card').querySelector('h3').textContent;
            alert(`Booking request sent for ${guideName}! We'll contact you shortly.`);
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('show-signup')) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            document.querySelector('.auth-links a:nth-child(1)').classList.remove('active');
            document.querySelector('.auth-links a:nth-child(2)').classList.add('active');
        });
        
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            document.querySelector('.auth-links a:nth-child(2)').classList.remove('active');
            document.querySelector('.auth-links a:nth-child(1)').classList.add('active');
        });
    }

    const authForms = document.querySelectorAll('.auth-form form');
    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted successfully!');
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hotelName = this.closest('.hotel-card').querySelector('h3').textContent;
            alert(`Booking request for ${hotelName} received! Our team will contact you shortly.`);
        });
    });

    if (window.location.pathname.includes('hotels.html')) {
        document.querySelector('.main-nav a[href="hotels.html"]').classList.add('active');
    }
});
document.getElementById('generate-btn').addEventListener('click', async () => {
    const formData = {
        destination: document.getElementById('destination').value,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        people: document.getElementById('people').value,
        budget: document.getElementById('budget').value
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/generate-itinerary/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        const itinerary = await response.json();
        console.log(itinerary);
        // Display itinerary on page
    } catch (error) {
        console.error('Error:', error);
    }
});