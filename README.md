# TaskFlow

A task manager web app for organizing and tracking daily work. Built with a vanilla JS frontend and a Node.js/Express REST API backend.

---

## Features

- Add, edit, and delete tasks
- Mark tasks complete or incomplete
- Filter by All / Active / Completed
- Clear all completed tasks at once
- Persistent storage — uses the API when the server is running, falls back to `localStorage` otherwise
- Responsive layout, works on mobile

---

## Tech stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | HTML, CSS, JavaScript   |
| Backend  | Node.js, Express        |
| Storage  | In-memory (server) / localStorage (fallback) |

---

## Getting started

### Prerequisites

- Node.js v18+
- npm

### Install and run

```bash
# Clone the repo
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For development with auto-restart:

```bash
npm run dev
```

### Frontend only (no Node.js)

Open `index.html` directly in a browser. Tasks will be saved to `localStorage`.

---

## API reference

Base URL: `http://localhost:3000/api`

| Method   | Endpoint         | Description                  |
|----------|------------------|------------------------------|
| `GET`    | `/tasks`         | Get all tasks                |
| `POST`   | `/tasks`         | Create a task                |
| `PATCH`  | `/tasks/:id`     | Update text and/or completed |
| `DELETE` | `/tasks/:id`     | Delete a task                |
| `DELETE` | `/tasks`         | Delete all completed tasks   |

**POST /tasks body:**
```json
{ "text": "Your task text here" }
```

**PATCH /tasks/:id body (any combination):**
```json
{ "text": "Updated text", "completed": true }
```

---

## Project structure

```
taskflow/
├── index.html        # App shell
├── style.css         # All styles
├── script.js         # Frontend logic and API calls
├── server.js         # Express server entry point
├── routes/
│   └── tasks.js      # Task REST API routes
└── package.json
```

---

## Future improvements

- Persist tasks to a database (SQLite or PostgreSQL)
- User accounts and authentication
- Due dates and priority levels
- Drag-and-drop reordering
- Dark mode toggle
