export function getOnTrackStatus(progress: number) {
  if (progress >= 75) return "On-track";
  if (progress >= 50) return "At risk";
  return "Behind";
}


