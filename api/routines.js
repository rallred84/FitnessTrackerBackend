const express = require('express');
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require('../db');

routinesRouter.use((req, res, next) => {
  console.log('A request is being made to /routines');
  next();
});

// GET /api/routines

routinesRouter.get('/', async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines

routinesRouter.post('/', async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  try {
    if (req.user) {
      const creatorId = req.user.id;
      const newRoutine = await createRoutine({
        creatorId,
        isPublic,
        name,
        goal,
      });
      res.send(newRoutine);
    } else {
      next({
        message: 'You must be logged in to perform this action',
        name: 'NotLoggedIn',
      });
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId

routinesRouter.patch('/:routineId', async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;
  try {
    if (req.user) {
      const routineToUpdate = await getRoutineById(routineId);
      if (routineToUpdate.creatorId !== req.user.id) {
        res.status(403).send({
          error: 'Error',
          message: `User ${req.user.username} is not allowed to update ${routineToUpdate.name}`,
          name: 'WrongUserError',
        });
      }

      const updatedRoutine = await updateRoutine({
        id: routineId,
        isPublic,
        name,
        goal,
      });
      res.send(updatedRoutine);
    } else {
      next({
        message: 'You must be logged in to perform this action',
        name: 'NotLoggedIn',
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId

routinesRouter.delete('/:routineId', async (req, res, next) => {
  const { routineId } = req.params;
  try {
    if (req.user) {
      const routineToDestroy = await getRoutineById(routineId);
      if (routineToDestroy.creatorId !== req.user.id) {
        res.status(403).send({
          error: 'Error',
          name: 'UnauthorizedUser',
          message: `User ${req.user.username} is not allowed to delete ${routineToDestroy.name}`,
        });
      }

      const deletedRoutine = await destroyRoutine(routineId);
      res.send(deletedRoutine);
    }
  } catch (error) {
    next(error);
  }

  next();
});

// POST /api/routines/:routineId/activities

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  try {
    const routineSearch = await getRoutineActivitiesByRoutine({
      id: routineId,
    });

    const match = routineSearch.find(
      (routine) =>
        activityId == routine.activityId && routineId == routine.routineId
    );

    if (match) {
      next({
        message: `Activity ID ${activityId} already exists in Routine ID ${match.routineId}`,
        name: 'RoutineActivityAlreadyExists',
      });
    }

    const routineActivity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });

    res.send(routineActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = routinesRouter;
