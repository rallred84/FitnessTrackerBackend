const client = require('./client');

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const newRoutineActivityQuery = await client.query(
    `
    INSERT INTO "routine_activities" ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [routineId, activityId, count, duration]
  );
  const newRoutineActivity = newRoutineActivityQuery.rows[0];

  if (!newRoutineActivity) {
    throw new Error('A new activity was not added to your routine');
  }
  return {
    success: true,
    routineActivity: newRoutineActivity,
  };
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
