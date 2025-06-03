const Task = require('../models/taskModel');

class TaskController {
  static async createTask(req, res, next) {
    try {
      const taskId = await Task.create(req.body);
      const task = await Task.findById(taskId);
      res.status(201).json({
        status: 'success',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllTasks(req, res, next) {
    try {
      let {
        page = 1,
        limit = 10,
        sort_by = 'task_id',
        order = 'desc',
        status,
        due_date_from,
        due_date_to
      } = req.query;

      page = Number(page) > 0 ? Number(page) : 1;
      limit = Number(limit) > 0 ? Number(limit) : 10;

      const tasks = await Task.findAll({
        page,
        limit,
        sort_by,
        order,
        status,
        due_date_from,
        due_date_to
      });
      res.json({
        status: 'success',
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found'
        });
      }
      res.json({
        status: 'success',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const success = await Task.update(req.params.id, req.body);
      if (!success) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found'
        });
      }
      const task = await Task.findById(req.params.id);
      res.json({
        status: 'success',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const success = await Task.delete(req.params.id);
      if (!success) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found'
        });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getAllTasksSimple(req, res, next) {
    try {
      const tasks = await Task.getAllSimple();
      res.json({
        status: 'success',
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController; 