const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  const newActivityQuery = await client.query(
    `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [name, description]
  );
  const newActivity = newActivityQuery.rows[0];

  if (!newActivity) {
    throw new Error('No new activity was created.');
  }

  return {
    success: true,
    activity: newActivity,
  };
}

async function getAllActivities() {
  // select and return an array of all activities
  const allActivitiesQuery = await client.query(`
  SELECT * FROM activities;
  `);
  const allActivities = allActivitiesQuery.rows;

  if (!allActivities[0]) {
    throw new Error('There was an error retriving the activities');
  }
  return allActivities;
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
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
