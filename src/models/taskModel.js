const db = require('../config/database');

class Task {
  static async create(taskData) {
    const { title, description, due_date, status } = taskData;
    const [result] = await db.execute(
      'INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)',
      [title, description, due_date, status]
    );
    return result.insertId;
  }

  static async findAll({ page = 1, limit = 10, sort_by = 'task_id', order = 'desc', status, due_date_from, due_date_to } = {}) {
    let query = 'SELECT * FROM tasks';
    const params = [];
    const filters = [];

    if (status) {
      filters.push('status = ?');
      params.push(status);
    }
    if (due_date_from && due_date_from.trim() !== '') {
      filters.push('due_date >= ?');
      params.push(due_date_from);
    }
    if (due_date_to && due_date_to.trim() !== '') {
      filters.push('due_date <= ?');
      params.push(due_date_to);
    }
    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    const allowedSort = ['task_id', 'title', 'due_date', 'status'];
    const allowedOrder = ['asc', 'desc'];
    if (!allowedSort.includes(sort_by)) sort_by = 'task_id';
    if (!allowedOrder.includes(order.toLowerCase())) order = 'desc';
    query += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;

    const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
    const offset = (safePage - 1) * safeLimit;
    query += ` LIMIT ${safeLimit} OFFSET ${offset}`;

    const numPlaceholders = (query.match(/\?/g) || []).length;
    if (params.length !== numPlaceholders) {
      throw new Error(`Params length (${params.length}) does not match placeholders (${numPlaceholders})`);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM tasks WHERE task_id = ?', [id]);
    return rows[0];
  }

  static async update(id, taskData) {
    const { title, description, due_date, status } = taskData;
    const [result] = await db.execute(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE task_id = ?',
      [title, description, due_date, status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM tasks WHERE task_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getAllSimple() {
    const [rows] = await db.execute('SELECT * FROM tasks');
    return rows;
  }
}

module.exports = Task; 