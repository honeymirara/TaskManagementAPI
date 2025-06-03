CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  status ENUM('pending', 'in-progress', 'completed') NOT NULL DEFAULT 'pending',
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
);