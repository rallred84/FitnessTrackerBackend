const client = require('./client');

// database functions

// user functions
async function createUser({ username, password }) {
  if (password.length < 8) {
    throw new Error('Password must be longer than 8 characters.');
  }
  const newUserQuery = await client.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
      `,
    [username, password]
  );
  const newUser = newUserQuery.rows[0];

  if (!newUser.id) {
    throw new Error('No new user was created');
  }

  return {
    success: true,
    user: newUser,
  };
}

async function getUser({ username, password }) {}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
