const client = require('./client');

const bcrypt = require('bcrypt');

// database functions

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// user functions
async function createUser({ username, password }) {
  if (password.length < 8) {
    throw new Error('Password must be longer than 8 characters.');
  }
  const hashedPassword = await hashPassword(password);
  const newUserQuery = await client.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
      `,
    [username, hashedPassword]
  );

  const newUser = newUserQuery.rows[0];
  if (!newUser.id) {
    throw new Error('No new user was created');
  }

  delete newUser.password;
  return newUser;
}

async function getUser({ username, password }) {
  const userQuery = await client.query(
    `
  SELECT * FROM users
  WHERE username = $1
  `,
    [username]
  );

  const user = userQuery.rows[0];

  if (!user) {
    throw new Error('No user was found with that username');
  }
  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    delete user.password;
    return user;
  }
}

async function getUserById(userId) {
  const userQuery = await client.query(
    `
  SELECT * FROM users
  WHERE id = $1
  `,
    [userId]
  );

  const user = userQuery.rows[0];

  if (user) {
    console.log(user);
    delete user.password;
    return user;
  }
}

async function getUserByUsername(userName) {
  const userQuery = await client.query(
    `
  SELECT * FROM users
  WHERE username = $1;
  `,
    [userName]
  );

  const user = userQuery?.rows[0];

  if (!user.id) {
    throw new Error('No user was found with that username');
  }

  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
