const express = require('express');
const apiRouter = express.Router();
const { getUserById } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// GET /api/health
apiRouter.get('/health', async (req, res) => {
  res.status(200).send({
    message: 'Router is healthy',
  });
});

//AUTHENTICATE

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.headers.authorization;

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        if (token) req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// ROUTER: /api/users
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
apiRouter.use('/routine_activities', routineActivitiesRouter);

apiRouter.use('/', (req, res) => {
  res.status(404).send({
    message: 'This route is unknown',
  });
});

apiRouter.use((error, req, res, next) => {
  res.status(401).send({
    error: 'Error',
    message: error.message,
    name: error.name,
  });
});

module.exports = apiRouter;
