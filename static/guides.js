document.addEventListener('DOMContentLoaded', () => {
    const searchGuidesBtn = document.getElementById('search-guides');
    const guidesResults = document.getElementById('guides-results');

    searchGuidesBtn.onclick = async () => {
        const location = document.getElementById('guide-location').value;
        const language = document.getElementById('guide-language').value;

        if (!location) {
            alert('Please enter a location');
            return;
        }

        try {
            const response = await fetch('/api/search-guides/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    location,
                    language
                })
            });

            if (response.ok) {
                const guides = await response.json();
                displayGuides(guides);
            } else {
                alert('Failed to fetch guides. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    function displayGuides(guides) {
        guidesResults.innerHTML = guides.map(guide => `
            <div class="guide-card transparent-box">
                <img src="${guide.profile_image}" alt="${guide.name}" class="guide-image">
                <div class="guide-info">
                    <h3>${guide.name}</h3>
                    <p class="guide-location">📍 ${guide.location}</p>
                    <div class="guide-languages">
                        ${guide.languages.map(lang => `<span class="language">${lang}</span>`).join('')}
                    </div>
                    <p class="guide-experience">${guide.years_experience} years of experience</p>
                    <div class="guide-specialties">
                        ${guide.specialties.map(specialty => `<span class="specialty">${specialty}</span>`).join('')}
                    </div>
                    <div class="guide-rating">
                        ${'⭐'.repeat(Math.floor(guide.rating))} (${guide.review_count} reviews)
                    </p>
                    <p class="guide-price">$${guide.price_per_hour}/hour</p>
                    <button class="contact-button" onclick="contactGuide('${guide.id}')">Contact Guide</button>
                </div>
            </div>
        `).join('');
    }

    window.contactGuide = async (guideId) => {
        if (!localStorage.getItem('token')) {
            alert('Please login to contact a guide');
            return;
        }

        try {
            const response = await fetch('/api/contact-guide/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    guide_id: guideId
                })
            });

            if (response.ok) {
                alert('Message sent to guide successfully!');
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending message');
        }
    };
}); 