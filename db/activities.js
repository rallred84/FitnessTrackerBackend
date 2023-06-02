const client = require('./client');
const chalk = require('chalk');
const util = require('util');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  const {
    rows: [newActivity],
  } = await client.query(
    `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [name, description]
  );

  return newActivity;
}

async function getAllActivities() {
  // select and return an array of all activities
  const { rows: allActivities } = await client.query(`
  SELECT * FROM activities;
  `);

  return allActivities;
}

async function getActivityById(id) {
  const {
    rows: [activity],
  } = await client.query(
    `
    SELECT * FROM activities
    WHERE id = $1
  `,
    [id]
  );

  return activity;
}

async function getActivityByName(name) {
  const {
    rows: [activity],
  } = await client.query(
    `
  SELECT * FROM activities
  WHERE name = $1
  `,
    [name]
  );

  return activity;
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  const updateKeys = [];
  const updateValues = [];

  if (fields.name) {
    updateKeys.push('name');
    updateValues.push(fields.name);
  }
  if (fields.description) {
    updateKeys.push('description');
    updateValues.push(fields.description);
  }

  const setString = updateKeys
    .map((key, idx) => `${key} = '${updateValues[idx]}'`)
    .join(', ');

  const {
    rows: [activity],
  } = await client.query(
    `
  UPDATE activities
  SET ${setString}
  WHERE id = ${id}
  RETURNING *;
  `
  );

  return activity;
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
