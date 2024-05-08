export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  // Flatten the list of downtime logs
  const mergedLogs: [Date, Date][] = args.reduce((acc, log) => acc.concat(log), []);

  // Sort the downtime logs by start time
  mergedLogs.sort((a, b) => a[0].getTime() - b[0].getTime());

  // Initialize an array to store the merged downtime logs
  const merged: [Date, Date][] = [];

  // Iterate through each downtime period and merge overlapping or adjacent periods
  let currentStart = mergedLogs[0][0];
  let currentEnd = mergedLogs[0][1];
  for (let i = 1; i < mergedLogs.length; i++) {
    const [start, end] = mergedLogs[i];
    if (start.getTime() <= currentEnd.getTime()) {
      // Merge overlapping periods
      currentEnd = new Date(Math.max(currentEnd.getTime(), end.getTime()));
    } else {
      // Add the merged downtime period to the result and start a new one
      merged.push([currentStart, currentEnd]);
      currentStart = start;
      currentEnd = end;
    }
  }

  // Add the last merged downtime period
  merged.push([currentStart, currentEnd]);

  return merged;
}