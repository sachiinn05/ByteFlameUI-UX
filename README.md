# ByteFlame UI

Dating app frontend — match by interests, chat in real time, block or unmatch.

[![Live App](https://img.shields.io/badge/Live-App-brightgreen)](https://byte-flame-ui-ux.vercel.app)
[![Frontend](https://img.shields.io/badge/GitHub-Frontend-181717?logo=github)](https://github.com/sachiinn05/devTinderUI)
[![Backend](https://img.shields.io/badge/GitHub-Backend-181717?logo=github)](https://github.com/sachiinn05/dev_tinder)

## Live links

| | URL |
|---|---|
| **App** | [https://byte-flame-ui-ux.vercel.app](https://byte-flame-ui-ux.vercel.app) |
| **API** | [https://byteflame-backend.onrender.com](https://byteflame-backend.onrender.com) |
| **Frontend repo** | [github.com/sachiinn05/devTinderUI](https://github.com/sachiinn05/devTinderUI) |
| **Backend repo** | [github.com/sachiinn05/dev_tinder](https://github.com/sachiinn05/dev_tinder) |

> Free Render sleeps after idle time. The first request can take ~1 minute.

## Features

- Login / signup (JWT cookies)
- Discover feed ranked by **shared interests** (filters + pagination)
- Profile photo upload
- Connection requests
- Real-time chat (Socket.io) with online status, typing, unread count
- Unmatch and block
- Responsive dark UI (React + Tailwind)

## Tech stack

React (Vite) · Redux Toolkit · React Router · Axios · Tailwind CSS · Socket.io Client · Vercel

## Local setup

```bash
git clone https://github.com/sachiinn05/devTinderUI.git
cd devTinderUI
npm install
```

Create `.env`:

```env
VITE_BASE_URL=http://localhost:9000
```

```bash
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)  
Backend must be running on port **9000**.

## Production

Hosted on **Vercel**. Set:

```env
VITE_BASE_URL=https://byteflame-backend.onrender.com
```

## Author

**Sachin Singh**  
[GitHub](https://github.com/sachiinn05)
