const client = require('./client');

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {
    rows: [newRoutineActivity],
  } = await client.query(
    `
    INSERT INTO "routine_activities" ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [routineId, activityId, count, duration]
  );

  return newRoutineActivity;
}

async function getRoutineActivityById(id) {
  const {
    rows: [routineActivity],
  } = await client.query(
    `
    SELECT * FROM routine_activities
    WHERE id = $1;
    `,
    [id]
  );

  return routineActivity;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const { rows: routineActivities } = await client.query(
    `
    SELECT * FROM routine_activities
    WHERE "routineId" = $1;
    `,
    [id]
  );

  return routineActivities;
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 1}`)
    .join(', ');

  const {
    rows: [updatedRoutineActivity],
  } = await client.query(
    `
  UPDATE routine_activities
  SET ${setString}
  WHERE id = ${id}
  RETURNING *;
  `,
    Object.values(fields)
  );

  return updatedRoutineActivity;
}

async function destroyRoutineActivity(id) {
  const {
    rows: [deletedRoutineActivity],
  } = await client.query(
    `
  DELETE FROM routine_activities
  WHERE id = $1
  RETURNING *;
  `,
    [id]
  );

  return deletedRoutineActivity;
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {
    rows: [routine],
  } = await client.query(
    `
  SELECT * FROM routines
  WHERE id = (SELECT "routineId" FROM routine_activities WHERE id = $1);
  `,
    [routineActivityId]
  );

  if (routine.creatorId === userId) {
    return true;
  } else return false;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
