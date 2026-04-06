// =============================================================================
// Date and Time Utilities
// =============================================================================

/**
 * Get today's date as a string in YYYY-MM-DD format
 * @returns {string} Today's date string
 */
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get statistics for the last 7 days
 * @param {Array} daily - Array of daily stats objects with date, questions, correct
 * @returns {Array} Array of 7 day objects with label, Questions, Correct
 */
export function getLast7(daily) {
  const days = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const lbl = dayLabels[d.getDay()];
    const found = daily.find(x => x.date === ds);
    days.push({
      label: lbl,
      Questions: found ? found.questions : 0,
      Correct: found ? found.correct : 0
    });
  }

  return days;
}
