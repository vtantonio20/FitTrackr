
export const MUSCLESMAPPED = {
    "Legs": [
        "Quadriceps", "Hamstrings", "Calves", "Ass", "Abductors", "Knees", "Foot",
    ],
    "Core": [
        "Lower_Core", "Abs", "Lower_Back", "Obliques", 
    ],
    "Back": [
        "Scapula", "Upper_Back", "Traps", "Lats"
    ],
    "Arms": [
        "Shoulders", "Triceps", "Biceps", "Forearms", "Hands"
    ],
    "Chest": [
        "Pectorals"
    ],
    "Head": [
        "Neck", "Face"
    ]
}
export const MUSCLEGROUPS = Object.keys(MUSCLESMAPPED);
export const MUSCLES = ([] as string[]).concat(...Object.values(MUSCLESMAPPED));
export const getMuscles = (group: string) => {
  return MUSCLESMAPPED[group as keyof typeof MUSCLESMAPPED];
}
