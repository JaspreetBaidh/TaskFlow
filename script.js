// script.js — Day 1: confirm the page is wired up

document.addEventListener('DOMContentLoaded', () => {
  console.log('TaskFlow loaded');

  const form = document.getElementById('task-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted — task logic coming soon');
  });
});
