# 🎨 Realtime Collaborative Whiteboard

A real-time collaborative whiteboard where multiple users can draw simultaneously and see each other's strokes live.

Built as a portfolio project to demonstrate full-stack development, real-time systems, and Canvas API skills.

---

## ✨ Features

- 🖊️ **Real-time drawing** — strokes appear instantly on all connected clients
- 🎨 **Color picker** — each user gets a unique color; customize your own
- 📏 **Stroke width control** — adjustable pen size via slider
- 🧹 **Eraser tool** — erase parts of the canvas
- 👆 **Live cursors** — see where other users are on the canvas in real time
- ↩️ **Undo / Redo** — Ctrl+Z and Ctrl+Y for local history
- 💾 **Export as PNG** — download the canvas as an image with white background

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Canvas | HTML5 Canvas API |
| Styling | Inline styles |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository
```bash
   git clone https://github.com/VedangShetye/realtime-whiteboard.git
   cd realtime-whiteboard
```

2. Install and start the backend
```bash
   cd server
   npm install
   node index.js
```

3. Install and start the frontend (in a new terminal)
```bash
   cd client
   npm install
   npm run dev
```

4. Open `http://localhost:5173` in multiple browser tabs to test collaboration

### Development URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |

---

## 📁 Project Structure
```
realtime-whiteboard/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── App.jsx
│       ├── Canvas.jsx
│       └── Toolbar.jsx
└── server/          # Node.js backend
    └── index.js
```

---

## 🧠 How It Works

1. Each browser tab connects to the server via a persistent WebSocket (Socket.io)
2. When a user draws, the stroke data (coordinates, color, width) is emitted to the server
3. The server broadcasts it to all other connected clients
4. Each client receives the data and redraws the stroke on their local canvas
5. Cursor positions are broadcast the same way, rendered as colored dots

---

## 🔮 Future Improvements

- [ ] Persistent canvas (new users see existing drawing)
- [ ] Room-based sessions (multiple independent boards)
- [ ] Touch/mobile support
- [ ] Eraser size control
- [ ] Shape tools (rectangle, circle, line)
- [ ] Name labels on cursors

---

## 👤 Author

**Vedang Shetye**  
[GitHub](https://github.com/VedangShetye)