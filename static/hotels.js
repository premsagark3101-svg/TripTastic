document.addEventListener('DOMContentLoaded', () => {
    const searchHotelsBtn = document.getElementById('search-hotels');
    const hotelsResults = document.getElementById('hotels-results');

    searchHotelsBtn.onclick = async () => {
        const location = document.getElementById('location').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const priceRange = document.getElementById('price-range').value;

        if (!location || !checkIn || !checkOut) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/search-hotels/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    location,
                    check_in: checkIn,
                    check_out: checkOut,
                    price_range: priceRange
                })
            });

            if (response.ok) {
                const hotels = await response.json();
                displayHotels(hotels);
            } else {
                alert('Failed to fetch hotels. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    function displayHotels(hotels) {
        hotelsResults.innerHTML = hotels.map(hotel => `
            <div class="hotel-card transparent-box">
                <img src="${hotel.image_url}" alt="${hotel.name}" class="hotel-image">
                <div class="hotel-info">
                    <h3>${hotel.name}</h3>
                    <p class="hotel-location">📍 ${hotel.location}</p>
                    <p class="hotel-price">$${hotel.price_per_night} per night</p>
                    <div class="hotel-amenities">
                        ${hotel.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                    </div>
                    <div class="hotel-rating">
                        ${'⭐'.repeat(Math.floor(hotel.rating))} (${hotel.review_count} reviews)
                    </div>
                    <button class="book-button" onclick="bookHotel('${hotel.id}')">Book Now</button>
                </div>
            </div>
        `).join('');
    }

    window.bookHotel = async (hotelId) => {
        if (!localStorage.getItem('token')) {
            alert('Please login to book a hotel');
            return;
        }

        try {
            const response = await fetch('/api/book-hotel/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    hotel_id: hotelId,
                    check_in: document.getElementById('check-in').value,
                    check_out: document.getElementById('check-out').value
                })
            });

            if (response.ok) {
                alert('Hotel booked successfully!');
            } else {
                alert('Failed to book hotel');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while booking');
        }
    };
}); 