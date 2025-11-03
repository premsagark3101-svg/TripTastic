# TripTastic

Django + vanilla JS project with simple APIs for signup/login and itinerary generation/saving.

## Quickstart

```powershell
cd "C:\Users\DELL\OneDrive\Desktop\mini project"
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip uninstall -y djongo pymongo
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

- Home: http://127.0.0.1:8000/
- Hotels: http://127.0.0.1:8000/hotels/
- Guides: http://127.0.0.1:8000/guides/
- Itinerary: http://127.0.0.1:8000/itinerary/

## APIs
- POST `/api/signup/` { username, password }
- POST `/api/login/` { username, password }
- GET `/api/itineraries/` (Authorization: Bearer <username>)
- POST `/api/itineraries/` { destination, duration }
- POST `/api/generate-itinerary/` { destination, duration }
- POST `/api/save-itinerary/` { destination, duration, itinerary }

Note: Demo auth uses username as token for front-end integration.

