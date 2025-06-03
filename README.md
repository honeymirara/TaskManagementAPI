# Task Management API

A RESTful API for managing tasks, built with Node.js, Express, and MySQL.

## Features

- Create, read, update, and delete tasks
- Task status management (pending, in-progress, completed)
- Input validation and error handling
- MySQL database integration
- Pagination, sorting, filtering
- Comprehensive test coverage
- AWS deployment ready

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- AWS Account (for deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=task_management
PORT=3000
```

4. Set up the database:
```bash
mysql -u root -p task_management < src/database/schema.sql
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Create a new task
- **POST** `/api/tasks`
- **Body:**
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "due_date": "2025-06-20 12:00:00",
    "status": "pending"
  }
  ```

### Get all tasks (with pagination, sorting, filtering)
- **GET** `/api/tasks`
- **Query parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `sort_by` (task_id, title, due_date, status)
  - `order` (asc, desc)
  - `status` (pending, in-progress, completed)
  - `due_date_from` (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
  - `due_date_to` (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
- **Example:**
  ```
  GET /api/tasks?page=1&limit=5&sort_by=due_date&order=asc&status=pending&due_date_from=2025-06-10&due_date_to=2025-06-20
  ```

### Get all tasks (без фильтрации, сортировки, пагинации)
- **GET** `/api/tasks/all`

### Get a specific task
- **GET** `/api/tasks/:id`

### Update a task
- **PUT** `/api/tasks/:id`
- **Body:** (аналогично POST)

### Delete a task
- **DELETE** `/api/tasks/:id`

## Response Structure
- Успех:
  ```json
  {
    "status": "success",
    "data": [ ... ]
  }
  ```
- Ошибка:
  ```json
  {
    "status": "error",
    "message": "..."
  }
  ```

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

The application can be deployed to AWS using either Terraform or Serverless Framework. See the deployment documentation in the `deployment` directory for detailed instructions.

## License

MIT