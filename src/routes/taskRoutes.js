const express = require('express');
const Joi = require('joi');
const TaskController = require('../controllers/taskController');

const router = express.Router();

// Validation schemas
const taskSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  due_date: Joi.date().iso().required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending')
});

// Validation middleware
const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details[0].message
    });
  }
  next();
};

// Routes
router.post('/', validateTask, TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.get('/all', TaskController.getAllTasksSimple);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', validateTask, TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router; 