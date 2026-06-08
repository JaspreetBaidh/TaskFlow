// script.js — Day 4: frontend wired to the Express API
// Falls back to localStorage if the server isn't running

// ── Config ─────────────────────────────────────────────────

const API_BASE = '/api/tasks';

// Whether the API is reachable — detected on first load
let useAPI = false;

// ── State ──────────────────────────────────────────────────

let tasks = [];
let currentFilter = 'all';

// ── API helpers ────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  // 204 No Content has no body
  return res.status === 204 ? null : res.json();
}

// ── localStorage fallback ──────────────────────────────────

function saveTasks() {
  localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
}

function loadFromStorage() {
  const stored = localStorage.getItem('taskflow-tasks');
  tasks = stored ? JSON.parse(stored) : [];
}

// ── Task operations ────────────────────────────────────────

async function loadTasks() {
  try {
    tasks  = await apiFetch('/');
    useAPI = true;
  } catch {
    // Server not running — use localStorage
    loadFromStorage();
    useAPI = false;
  }
  render();
}

async function addTask(text) {
  if (useAPI) {
    try {
      const task = await apiFetch('/', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      tasks.unshift(task);
    } catch (err) {
      console.error('Add failed:', err.message);
      return;
    }
  } else {
    tasks.unshift({
      id:        Date.now(),
      text:      text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    });
    saveTasks();
  }
  render();
}

async function deleteTask(id) {
  if (useAPI) {
    try {
      await apiFetch(`/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete failed:', err.message);
      return;
    }
  }
  tasks = tasks.filter(t => t.id !== id);
  if (!useAPI) saveTasks();
  render();
}

async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const updated = !task.completed;

  if (useAPI) {
    try {
      await apiFetch(`/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: updated }),
      });
    } catch (err) {
      console.error('Toggle failed:', err.message);
      return;
    }
  }
  task.completed = updated;
  if (!useAPI) saveTasks();
  render();
}

async function updateTaskText(id, newText) {
  const task = tasks.find(t => t.id === id);
  if (!task || !newText.trim()) return;

  if (useAPI) {
    try {
      await apiFetch(`/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ text: newText }),
      });
    } catch (err) {
      console.error('Update failed:', err.message);
      return;
    }
  }
  task.text = newText.trim();
  if (!useAPI) saveTasks();
  render();
}

async function clearCompleted() {
  if (useAPI) {
    try {
      tasks = await apiFetch('/', { method: 'DELETE' });
    } catch (err) {
      console.error('Clear failed:', err.message);
      return;
    }
  } else {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
  }
  render();
}

// ── Filtering ──────────────────────────────────────────────

function getFilteredTasks() {
  switch (currentFilter) {
    case 'active':    return tasks.filter(t => !t.completed);
    case 'completed': return tasks.filter(t =>  t.completed);
    default:          return tasks;
  }
}

// ── Icons ──────────────────────────────────────────────────

const ICON_CHECK  = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3,8 7,12 13,4"/></svg>`;
const ICON_EDIT   = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M11.5 2.5l2 2L5 13l-3 1 1-3 8.5-8.5z"/></svg>`;
const ICON_DELETE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><polyline points="2,4 14,4"/><path d="M5 4V2h6v2"/><path d="M6 7v5M10 7v5"/><rect x="3" y="4" width="10" height="10" rx="1"/></svg>`;

// ── Render ─────────────────────────────────────────────────

function render() {
  const list       = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const taskCount  = document.getElementById('task-count');

  const filtered = getFilteredTasks();

  const total = tasks.length;
  taskCount.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;

  if (filtered.length === 0) {
    list.innerHTML = '';
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  list.innerHTML = filtered.map(buildTaskHTML).join('');

  list.querySelectorAll('.task-item').forEach(item => {
    const id = Number(item.dataset.id);
    item.querySelector('.task-check').addEventListener('click', () => toggleTask(id));
    item.querySelector('.btn-delete').addEventListener('click', () => deleteTask(id));
    item.querySelector('.btn-edit').addEventListener('click',   () => startEdit(id));
  });
}

function buildTaskHTML(task) {
  const checkClass = task.completed ? 'task-check checked' : 'task-check';
  const itemClass  = task.completed ? 'task-item completed'  : 'task-item';
  return `
    <li class="${itemClass}" data-id="${task.id}">
      <button class="${checkClass}" aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}">${ICON_CHECK}</button>
      <span class="task-text">${escapeHTML(task.text)}</span>
      <div class="task-actions">
        <button class="btn-icon btn-edit"   aria-label="Edit task">${ICON_EDIT}</button>
        <button class="btn-icon btn-delete" aria-label="Delete task">${ICON_DELETE}</button>
      </div>
    </li>
  `;
}

// ── Inline editing ─────────────────────────────────────────

function startEdit(id) {
  const item     = document.querySelector(`.task-item[data-id="${id}"]`);
  const textSpan = item.querySelector('.task-text');
  const current  = textSpan.textContent;

  const input = document.createElement('input');
  input.type      = 'text';
  input.className = 'task-text-input';
  input.value     = current;
  textSpan.replaceWith(input);
  input.focus();
  input.select();

  function commit() {
    const val = input.value.trim();
    if (val && val !== current) {
      updateTaskText(id, val);
    } else {
      render();
    }
  }

  input.addEventListener('blur',    commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  input.blur();
    if (e.key === 'Escape') render();
  });
}

// ── Utility ────────────────────────────────────────────────

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Events ─────────────────────────────────────────────────

function initEvents() {
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const text  = input.value.trim();
    if (text) {
      addTask(text);
      input.value = '';
      input.focus();
    }
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  document.getElementById('clear-completed').addEventListener('click', clearCompleted);
}

// ── Init ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  loadTasks();
});
