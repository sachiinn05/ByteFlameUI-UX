# ⚡ ByteFlame

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge\&logo=google-chrome)](https://byteflame.in)
[![Status](https://img.shields.io/website?url=https%3A%2F%2Fbyteflame.in\&up_message=Online\&down_message=Offline\&style=for-the-badge\&logo=amazon-aws)](https://byteflame.in)
[![Hosted on AWS EC2](https://img.shields.io/badge/Hosted%20on-AWS%20EC2-orange?style=for-the-badge\&logo=amazon-ec2)](https://aws.amazon.com/ec2/)
[![DNS by Cloudflare](https://img.shields.io/badge/DNS-Cloudflare-f38020?style=for-the-badge\&logo=cloudflare)](https://www.cloudflare.com/)

A modern **React.js** web application built with **Vite**, **Tailwind CSS (CDN)**, and **Redux Toolkit** — hosted on **AWS EC2** and secured with **Cloudflare DNS**.
ByteFlame is designed for high performance, real-time communication, and clean, modular UI.

---

## 🌐 Live Website

👉 **[https://byteflame.in](https://byteflame.in)**

---

## 🚀 Tech Stack

**Frontend**

* React.js (Vite)
* Tailwind CSS (CDN)
* Redux Toolkit
* React Router DOM
* Axios
* Material UI (MUI)
* React Toastify
* Socket.io Client
* React Icons

**Hosting & Infrastructure**

* AWS EC2 (Ubuntu Instance)
* Cloudflare (SSL + DNS Management)
* Nginx Reverse Proxy 
* PM2 

---

## 🧠 Project Overview

ByteFlame is a responsive and interactive web application with features such as:

* 🔐 Authentication (Login & Signup)
* 💬 Real-time chat using Socket.io
* 🧾 Dynamic feed and user connections
* 🧩 Modular architecture for scalability
* 🌙 Styled with Tailwind CSS for modern UI
* ⚡ Fast build using Vite

---

## 📦 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sachiinn05/byteflame.git
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

Your app will be live at
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```
VITE_BASE_URL = your_backend_api_url
```

---

## ☁️ Deployment on AWS EC2

1. **Launch an EC2 instance**

   * Ubuntu 22.04 (recommended)
   * Allow ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Install Node.js & Nginx**

   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx -y
   ```

3. **Clone your repo on EC2**

   ```bash
   git clone https://github.com/sachiinn05/byteflame.git
   cd byteflame
   npm install
   npm run build
   ```

4. **Serve build using Nginx**

   ```bash
   sudo cp -r dist/* /var/www/html/
   sudo systemctl restart nginx
   ```

5. **Connect Domain via Cloudflare**

   * Add an **A record** in Cloudflare pointing `byteflame.in` → EC2 public IP
   * Enable **proxy mode** (orange cloud)
   * Turn on **SSL → Full mode**

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

## 💻 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build production files   |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---


---

## 🧑‍💻 Author

**Sachin Singh**
🔗 [GitHub Profile](https://github.com/sachiinn05)

---

## 🌟 Contribute

Contributions are welcome!
If you find a bug or want to improve this project:

1. Fork this repository
2. Create a feature branch
3. Commit your changes
4. Submit a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.
