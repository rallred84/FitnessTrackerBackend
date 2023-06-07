const client = require('./client');
const bcrypt = require('bcrypt');

// database functions

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
('');

// user functions
async function createUser({ username, password }) {
  const hashedPassword = await hashPassword(password);
  const {
    rows: [newUser],
  } = await client.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `,
    [username, hashedPassword]
  );

  if (newUser) {
    delete newUser.password;
    return newUser;
  }
}

async function getUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
  SELECT * FROM users
  WHERE username = $1;
  `,
    [username]
  );

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    delete user.password;
    return user;
  }
}

async function getUserById(userId) {
  const {
    rows: [user],
  } = await client.query(
    `
  SELECT * FROM users
  WHERE id = $1;
  `,
    [userId]
  );

  delete user.password;
  return user;
}

async function getUserByUsername(userName) {
  const {
    rows: [user],
  } = await client.query(
    `
  SELECT * FROM users
  WHERE username = $1;
  `,
    [userName]
  );
  if (user) {
    return user;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
