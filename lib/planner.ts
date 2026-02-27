export type AssignmentInput = {
  id: string;
  title: string;
  dueDate: string;
  weight: number;
  estimatedHours: number;
  courseName?: string;
};

export type StudySession = {
  assignmentId: string;
  title: string;
  courseName?: string;
  date: string;
  durationMinutes: number;
  blockIndex: number;
  urgency: number;
};

export type WeeklyPlan = {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  sessions: StudySession[];
  unallocatedHours: number;
};

const BLOCK_MINUTES = 50;
const BLOCK_HOURS = BLOCK_MINUTES / 60;
const MAX_BLOCKS_PER_DAY = 3;

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = (day + 6) % 7; // Monday start
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function generateWeeklyPlan({
  assignments,
  weeklyHours,
  startDate = new Date()
}: {
  assignments: AssignmentInput[];
  weeklyHours: number;
  startDate?: Date;
}): WeeklyPlan {
  const weekStart = startOfWeek(startDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const maxBlocks = Math.min(
    Math.floor(weeklyHours / BLOCK_HOURS),
    MAX_BLOCKS_PER_DAY * 7
  );

  if (assignments.length === 0 || maxBlocks <= 0) {
    return {
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      totalHours: weeklyHours,
      sessions: [],
      unallocatedHours: weeklyHours
    };
  }

  const now = new Date(startDate);
  const scored = assignments.map((assignment) => {
    const due = new Date(assignment.dueDate);
    const daysUntil = daysBetween(now, due);
    const urgency = assignment.weight / daysUntil;
    return { ...assignment, urgency, daysUntil };
  });

  const totalUrgency = scored.reduce((sum, item) => sum + item.urgency, 0) || 1;

  const blocksByAssignment = scored
    .sort((a, b) => b.urgency - a.urgency)
    .map((assignment) => {
      const proportion = assignment.urgency / totalUrgency;
      const desiredHours = Math.min(
        assignment.estimatedHours,
        weeklyHours * proportion
      );
      const desiredBlocks = Math.max(1, Math.round(desiredHours / BLOCK_HOURS));
      return { ...assignment, desiredBlocks };
    });

  let remainingBlocks = maxBlocks;
  const allocations = blocksByAssignment.map((assignment) => {
    const blocks = Math.min(assignment.desiredBlocks, remainingBlocks);
    remainingBlocks -= blocks;
    return { ...assignment, allocatedBlocks: blocks };
  });

  let index = 0;
  while (remainingBlocks > 0) {
    allocations[index].allocatedBlocks += 1;
    remainingBlocks -= 1;
    index = (index + 1) % allocations.length;
  }

  const dayBuckets: StudySession[][] = Array.from({ length: 7 }, () => []);

  allocations.forEach((assignment) => {
    for (let block = 0; block < assignment.allocatedBlocks; block += 1) {
      for (let day = 0; day < 7; day += 1) {
        if (dayBuckets[day].length < MAX_BLOCKS_PER_DAY) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + day);
          dayBuckets[day].push({
            assignmentId: assignment.id,
            title: assignment.title,
            courseName: assignment.courseName,
            date: formatDate(date),
            durationMinutes: BLOCK_MINUTES,
            blockIndex: block + 1,
            urgency: assignment.urgency
          });
          break;
        }
      }
    }
  });

  const sessions = dayBuckets.flat();

  return {
    weekStart: formatDate(weekStart),
    weekEnd: formatDate(weekEnd),
    totalHours: weeklyHours,
    sessions,
    unallocatedHours: Math.max(0, weeklyHours - sessions.length * BLOCK_HOURS)
  };
}
