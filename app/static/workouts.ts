
export const WORKOUTMAPPED = {
  "Quads": [
      'Squats', 'Leg press', 'Lunges', 'Leg extensions', 'Hack squats',
      'Bulgarian split squats', 'Step-ups', 'Front squats',
      'Goblet squats', 'Barbell lunges'
  ],
  "Hamstrings": [
      'Deadlifts', 'Romanian deadlifts', 'Hamstring curls', 'One-leg Hamstring Curls',
      'Stiff-legged deadlifts', 'Good mornings', 'Seated hamstring curls',
      'Sumo deadlifts', 'Single-leg Romanian deadlifts', 'Glute-ham raises', 'Kettlebell swings'
  ],
  "Glutes": [
      'Squats', 'Deadlifts', 'Hip thrusts', 'Bulgarian split squats', 'Lunges',
      'Step-ups', 'Glute bridges', 'Donkey kicks', 'Clamshells', 'Cable kickbacks'
  ],
  "Back": [
      'Pull-ups', 'Chin-ups', 'Lat pulldowns', 'Barbell rows', 'Dumbbell rows',
      'T-bar rows', 'Seated cable rows', 'Bent-over rows', 'Good mornings',
      'Deadlifts', 'Back extensions', 'Reverse flyes', 'Supermans', 'Renegade rows',
      'Single-arm dumbbell rows'
  ],
  "Chest": [
      'Bench press', 'Push-ups', 'Dumbbell flyes', 'Incline bench press',
      'Chest dips', 'Cable crossovers', 'Pec deck flyes', 'Dumbbell bench press',
      'Incline dumbbell flyes', 'Machine chest press'
  ],
  "Biceps": [
      'Barbell curls', 'Dumbbell curls', 'Preacher curls', 'Hammer curls',
      'Concentration curls', 'Incline curls', 'EZ bar curls', 'Cable curls',
      'Chin-ups', 'Pull-ups'  
  ],
  "Triceps": [
      'Close-grip bench press', 'Tricep dips', 'Skull crushers',
      'Overhead tricep extensions', 'Tricep pushdowns', 'Dumbbell kickbacks',
      'Bench dips', 'EZ bar skull crushers', 'Diamond push-ups',
      'Single-arm overhead dumbbell extensions'
  ],
  "Shoulders": [
      'Overhead press', 'Dumbbell lateral raises', 'Front raises', 'Rear delt flyes',
      'Arnold press', 'Upright rows', 'Shrugs', 'Barbell shoulder press',
      'Dumbbell shoulder press', 'Seated dumbbell press'
  ]
}
export const WORKOUTGROUPS = Object.keys(WORKOUTMAPPED);
export const WORKOUTS = ([] as string[]).concat(...Object.values(WORKOUTMAPPED));
export const getWorkouts = (group: string) => {
  return WORKOUTMAPPED[group as keyof typeof WORKOUTMAPPED];
}
