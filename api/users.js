/* eslint-disable no-useless-catch */
const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const util = require('util');

usersRouter.use((req, res, next) => {
  console.log('A request is being made to /users');
  next();
});

const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
} = require('../db/index');

// POST /api/users/register

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const checkForExistingUser = await getUserByUsername(username);

    if (checkForExistingUser) {
      next({
        message: `User ${username} is already taken.`,
        name: 'UserAlreadyExists',
      });
    }

    if (password.length < 8) {
      next({
        message: 'Password Too Short!',
        name: 'PasswordTooShort',
      });
    }

    const user = await createUser({ username, password });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1w' }
    );

    res.send({ message: 'Thank you for registering!', token, user });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1w' }
    );

    if (user) {
      res.send({
        message: "you're logged in!",
        token,
        user,
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me

usersRouter.get('/me', async (req, res, next) => {
  const { id } = req.user || false;
  console.log(id);
  try {
    if (id) {
      const user = await getUserById(id);
      res.send(user);
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

// GET /api/users/:username/routines

module.exports = usersRouter;
