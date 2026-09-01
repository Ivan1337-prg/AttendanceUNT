# EduVision Setup Guide

EduVision has three parts:

- `face-auth-service`: FastAPI backend and face matching
- `teacher-webapp`: teacher login, session creation, and attendance dashboard
- `mobile`: student check-in and face capture with Expo

## Start the apps

Use a separate terminal for each app.

### 1. Backend

```bash
cd face-auth-service
.venv/bin/python main.py
```

The backend listens on the `PORT` configured in the root `.env` (`5000` in the example). Test it on the computer at `http://localhost:<PORT>/health`, such as `http://localhost:5000/health`.

### 2. Teacher web app

```bash
cd teacher-webapp
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

### 3. Student mobile app

```bash
cd mobile
npm install
npm start
```

Scan the QR code with Expo Go. Use `npm run web` only when testing the mobile UI in a browser; use `npm start` for realistic phone camera testing.

## Environment variables

The root `.env` is used by the backend and mobile app:

```env
DB_CONNECTION=postgresql://...
JWT_SECRET=use-a-long-random-secret
JWT_ALG=HS256
PORT=5000
API_SERVER_URL=http://YOUR_COMPUTER_IP:<PORT>
```

- `DB_CONNECTION`: PostgreSQL connection string used by the backend.
- `JWT_SECRET`: secret used to sign and verify teacher login tokens. Never commit or share it.
- `JWT_ALG`: JWT signing algorithm; currently `HS256`.
- `PORT`: port on which the backend listens.
- `API_SERVER_URL`: backend address used by the mobile app. When the backend is running locally on your computer and the app is running on a physical phone, this should contain your computer's LAN IP and the same port configured by `PORT`.

For example:

```env
PORT=5000
API_SERVER_URL=http://10.22.145.70:5000
```

The teacher app uses `teacher-webapp/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

- `VITE_API_BASE_URL`: backend address used by the teacher browser app.

Restart Expo with `npx expo start -c` after changing the root `.env`. Restart Vite after changing `teacher-webapp/.env`.

## Notes

- When a physical phone connects to a backend running locally on your computer, use the computer's LAN address, such as `http://10.x.x.x:5000`. The phone and computer should be on the same Wi-Fi network.
- Confirm connectivity from the phone by opening `http://YOUR_COMPUTER_IP:<PORT>/health`. Both values must match `API_SERVER_URL` and `PORT` in the root `.env`; for example, `http://10.22.145.70:5000/health`.
- Your Mac's LAN IP can change after reconnecting to Wi-Fi.
- `npm start` starts Expo for a phone or simulator; `npm run web` opens the mobile project in a browser.
- Activating the Python virtual environment is optional. `.venv/bin/python main.py` uses it directly.
- The backend must bind to `0.0.0.0` for another device to reach it; `main.py` already does this.
- If the mobile app has a reachable deployed `API_SERVER_URL`, it will use that instead of the local fallback.
