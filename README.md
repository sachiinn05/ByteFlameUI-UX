# ⚡ ByteFlame

A modern **React.js** web application built with **Vite**, **Tailwind CSS (CDN)**, and **Redux Toolkit**.
ByteFlame is designed for speed, scalability, and clean UI — featuring modular components, RESTful API integration, and real-time communication using **Socket.io**.

---

## 🚀 Tech Stack

**Frontend:**

* React.js (Vite)
* Tailwind CSS (via CDN)
* React Router DOM
* Redux Toolkit
* Axios
* React Toastify
* Socket.io Client
* Material UI (MUI)
* React Icons

---

## 📦 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/byteflame.git
cd byteflame
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

Your app will be live at:
👉 **[http://localhost:5173](byteflame.in/)**

---

## 🧱 Folder Structure

```
byteflame/
├── public/
│   └── logo.jpg
├── src/
│   ├── components/
│   │   ├── Body.jsx
│   │   ├── Chat.jsx
│   │   ├── Connection.jsx
│   │   ├── Feed.jsx
│   │   ├── Login.jsx
│   │   ├── NavBar.jsx
│   │   ├── Profile.jsx
│   │   ├── Requests.jsx
│   │   └── UserCard.jsx
│   ├── utils/
│   │   ├── appStore.js
│   │   ├── constants.js
│   │   ├── connectionSlice.js
│   │   ├── feedSlice.js
│   │   ├── requestSlice.js
│   │   ├── socket.js
│   │   └── userSlice.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🔧 Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Starts the development server       |
| `npm run build`   | Builds the app for production       |
| `npm run preview` | Serves the production build locally |
| `npm run lint`    | Lints and checks for code quality   |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```
VITE_BASE_URL = your_backend_api_url
```

---

## 💬 Features

✅ Login & Signup functionality using Axios
✅ Redux for global state management
✅ Tailwind CSS for sleek, responsive UI
✅ Socket.io for real-time updates
✅ Modular component structure
✅ API integration for dynamic content
✅ Toast notifications for better UX

---



---

## 🧑‍💻 Author

**Sachin Singh**
🔗 [GitHub Profile](https://github.com/sachiinn05)

---

## ⭐ Contribute

Contributions are welcome!
If you find bugs or want to add new features:

1. Fork this repo
2. Create a new branch
3. Commit your changes
4. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License**.
