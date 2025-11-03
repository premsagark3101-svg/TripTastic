document.addEventListener('DOMContentLoaded', () => {
    const itineraryForm = document.getElementById('itineraryForm');
    const itineraryResult = document.getElementById('itinerary-result');
    const itineraryDays = document.getElementById('itinerary-days');
    const saveItineraryBtn = document.getElementById('save-itinerary');
    const downloadItineraryBtn = document.getElementById('download-itinerary');

    // Check URL parameters for pre-filled destination
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    if (destination) {
        document.getElementById('destination').value = destination;
    }

    itineraryForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(itineraryForm);
        const data = {
            destination: formData.get('destination'),
            duration: parseInt(formData.get('duration')),
            budget: formData.get('budget'),
            preferences: Array.from(formData.getAll('preferences'))
        };

        try {
            const response = await fetch('/api/generate-itinerary/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const itinerary = await response.json();
                displayItinerary(itinerary);
            } else {
                alert('Failed to generate itinerary. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    function displayItinerary(itinerary) {
        itineraryDays.innerHTML = itinerary.days.map(day => `
            <div class="day-plan transparent-box">
                <h3>Day ${day.day}</h3>
                <div class="activities">
                    ${day.activities.map(activity => `
                        <div class="activity">
                            <h4>${activity.time} - ${activity.title}</h4>
                            <p>${activity.description}</p>
                            ${activity.location ? `<p>📍 ${activity.location}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        itineraryResult.style.display = 'block';
        itineraryForm.scrollIntoView({ behavior: 'smooth' });
    }

    saveItineraryBtn.onclick = async () => {
        if (!localStorage.getItem('token')) {
            alert('Please login to save your itinerary');
            return;
        }

        try {
            const response = await fetch('/api/save-itinerary/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    destination: document.getElementById('destination').value,
                    duration: parseInt(document.getElementById('duration').value),
                    itinerary: itineraryDays.innerHTML
                })
            });

            if (response.ok) {
                alert('Itinerary saved successfully!');
            } else {
                alert('Failed to save itinerary');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving');
        }
    };

    downloadItineraryBtn.onclick = () => {
        // Implement PDF download functionality
        alert('PDF download feature coming soon!');
    };
}); 