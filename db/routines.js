const client = require('./client');

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const newRoutineQuery = await client.query(
    `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [creatorId, isPublic, name, goal]
  );
  const newRoutine = newRoutineQuery.rows[0];
  if (!newRoutine) {
    throw new Error('No new routine was created');
  }
  return newRoutine;
}

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  const routinesWithoutActivitiesQuery = await client.query(`
    SELECT * FROM routines
    WHERE id NOT IN (
      SELECT "routineId" FROM routine_activities
    );
  `);

  const routinesWithoutActivities = routinesWithoutActivitiesQuery.rows;
  if (!routinesWithoutActivities[0]) {
    throw new Error('There was an error retriving the routines');
  }
  return routinesWithoutActivities;
}

async function getAllRoutines() {}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
