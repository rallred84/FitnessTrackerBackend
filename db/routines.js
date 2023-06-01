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
  const { rows: routinesWithoutActivities } = await client.query(`
    SELECT * FROM routines
    WHERE id NOT IN (
      SELECT "routineId" FROM routine_activities
    );
  `);

  return routinesWithoutActivities;
}

async function getAllRoutines() {}

async function getAllPublicRoutines() {
  const { rows: routines } = await client.query(
    `
  SELECT * FROM routines
  WHERE "isPublic" = true;
  `
  );
}

async function getAllRoutinesByUser({ username }) {
  const { rows: routines } = await client.query(
    `
  SELECT * FROM routines
  WHERE "creatorId" = (SELECT id FROM users WHERE username = $1);
  `,
    [username]
  );

  return routines;
}

async function getPublicRoutinesByUser({ username }) {
  const { rows: routines } = await client.query(
    `
  SELECT * FROM routines
  WHERE "creatorId" = (SELECT id FROM users WHERE username = $1)
  AND "isPublic";
  `,
    [username]
  );
  console.log(routines);
  return routines;
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
