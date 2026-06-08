# TaskFlow

TaskFlow is a task manager web application for organizing daily tasks. It includes a vanilla JavaScript frontend and a Node.js/Express REST API backend.

## Live Demo

https://jaspreetbaidh.github.io/taskflow/

## Features

- Add, edit, and delete tasks
- Mark tasks as complete or incomplete
- Filter tasks by all, active, or completed
- Clear completed tasks
- Saves tasks using the API when the server is running
- Falls back to localStorage when opened as a static site
- Responsive layout for desktop and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Storage | In-memory server storage, localStorage fallback |

## Getting Started

```bash
git clone https://github.com/JaspreetBaidh/taskflow.git
cd taskflow
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## API Routes

Base URL:

```text
http://localhost:3000/api/tasks
```

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Get all tasks |
| POST | / | Create a task |
| PATCH | /:id | Update a task |
| DELETE | /:id | Delete a task |
| DELETE | / | Clear completed tasks |

## Project Structure

```text
taskflow/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── README.md
└── routes/
    └── tasks.js
```

## Future Improvements

- Add database storage
- Add user accounts
- Add due dates and priority levels
- Add drag-and-drop task ordering
- Add dark mode
