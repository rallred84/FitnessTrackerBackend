const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities');

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
  const { rows: routinesWithoutActivities } = await client.query(`
    SELECT * FROM routines
    WHERE id NOT IN (
      SELECT "routineId" FROM routine_activities
    );
  `);

  return routinesWithoutActivities;
}

async function getAllRoutines() {
  const { rows: routines } = await client.query(
    `
    SELECT r.id, r."creatorId", u.username "creatorName", r."isPublic", r.name, r.goal
    FROM routines r
    JOIN users u ON r."creatorId" = u.id;
    `
  );
  const updatedRoutines = await attachActivitiesToRoutines(routines);
  return updatedRoutines;
}

async function getAllPublicRoutines() {
  const { rows: routines } = await client.query(
    `
  SELECT r.* , u.username "creatorName"
  FROM routines r
  JOIN users u ON r."creatorId" = u.id
  WHERE "isPublic" = true;

  `
  );
  const updatedRoutines = await attachActivitiesToRoutines(routines);

  return updatedRoutines;
}

async function getAllRoutinesByUser({ username }) {
  const { rows: routines } = await client.query(
    `
  SELECT r.* , u.username "creatorName"
  FROM routines r
  JOIN users u ON r."creatorId" = u.id
  WHERE "creatorId" = (SELECT id FROM users WHERE username = $1);
  `,
    [username]
  );
  const updatedRoutines = await attachActivitiesToRoutines(routines);

  return updatedRoutines;
}

async function getPublicRoutinesByUser({ username }) {
  const { rows: routines } = await client.query(
    `
  SELECT r.* , u.username "creatorName"
  FROM routines r
  JOIN users u ON r."creatorId" = u.id
  WHERE "creatorId" = (SELECT id FROM users WHERE username = $1)
  AND "isPublic";
  `,
    [username]
  );
  const updatedRoutines = await attachActivitiesToRoutines(routines);

  return updatedRoutines;
}

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
