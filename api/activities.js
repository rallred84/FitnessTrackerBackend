const express = require('express');
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  getActivityByName,
  createActivity,
  getActivityById,
  updateActivity,
} = require('../db/index');

activitiesRouter.use((req, res, next) => {
  console.log('A request is being made to /activities');
  next();
});

// GET /api/activities/:activityId/routines

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const routines = await getPublicRoutinesByActivity({ id: activityId });
    if (!routines[0]) {
      next({
        message: `Activity ${activityId} not found`,
        name: 'ActivityDoesNotExist',
      });
    }
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities

activitiesRouter.post('/', async (req, res, next) => {
  const { name, description } = req.body;
  const checkIfExisting = await getActivityByName(name);

  try {
    if (checkIfExisting) {
      next({
        name: 'ActivityAlreadyExists',
        message: `An activity with name ${name} already exists`,
      });
    }
    const newActivity = await createActivity({ name, description });
    res.send(newActivity);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

activitiesRouter.patch('/:activityId', async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const checkIfExistingById = await getActivityById(activityId);
  const checkIfExistingByName = await getActivityByName(name);
  try {
    if (!checkIfExistingById) {
      next({
        name: 'ActivityNotFound',
        message: `Activity ${activityId} not found`,
      });
    }

    if (checkIfExistingByName) {
      next({
        name: 'ActivityExistsWithThatName',
        message: `An activity with name ${name} already exists`,
      });
    }
    //async function updateActivity({ id, ...fields }) {
    const updatedActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });
    res.send(updatedActivity);
  } catch (error) {
    next(error);
  }

  next();
});

module.exports = activitiesRouter;
