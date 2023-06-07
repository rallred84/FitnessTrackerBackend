const express = require('express');
const routineActivitiesRouter = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require('../db');

routineActivitiesRouter.use((req, res, next) => {
  console.log('A request is being made to /routine_activities');
  next();
});

// PATCH /api/routine_activities/:routineActivityId

routineActivitiesRouter.patch('/:routineActivityId', async (req, res, next) => {
  const { duration, count } = req.body;
  const { routineActivityId } = req.params;
  try {
    const { routineId } = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineId);

    if (routine.creatorId !== req.user.id) {
      next({
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        name: 'UnauthorizedUser',
      });
    }

    const updatedRoutineActivity = await updateRoutineActivity({
      id: routineActivityId,
      duration,
      count,
    });
    res.send(updatedRoutineActivity);
  } catch (error) {
    next(error);
  }

  next();
});

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete(
  '/:routineActivityId',
  async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
      const { routineId } = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineId);

      if (routine.creatorId !== req.user.id) {
        res.status(403).send({
          error: 'Error',
          message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
          name: 'UnauthorizedUser',
        });
      }

      const deletedRoutineActivity = await destroyRoutineActivity(
        routineActivityId
      );

      res.send(deletedRoutineActivity);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routineActivitiesRouter;
