# Mini Project - Task API

A lightweight RESTful Task API built with Node.js and Express. It features local JSON file persistence and query parameter filtering.

---

## API Endpoints Reference

| Method | Endpoint | Description | Query Parameters / Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/tasks` | Create a new task | Body: `{ "title": "Task Name", "description": "Details" }` |
| **GET** | `/tasks` | Retrieve all tasks | Optional: `?done=true` or `?done=false` |
| **GET** | `/tasks/:id` | Retrieve a single task by ID | None |
| **PUT** | `/tasks/:id` | Update an existing task | Body: `{ "title", "description", "done" }` |
| **DELETE** | `/tasks/:id` | Delete a task by ID | None |