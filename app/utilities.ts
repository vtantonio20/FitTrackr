import colors from "./colors";

export const daysOfTheWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
export const dateToWDDDMMYY = (f: Date) => {
    return (daysOfTheWeek[f.getDay()] + ', ' + f.toLocaleString('default', { month: 'long' })) + ' ' + f.getDate() + ', ' + f.getFullYear();
}

export const dateToDDMMYY = (f: Date) => {
    return f.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })
}

export const dateToWD = (f: Date) => {
    return daysOfTheWeek[f.getDay()];
}

export const muscleSvgProps = (targetMuscles:string[]) => {
    const dynamicProps: { [key: string]: string } = {};
    dynamicProps['Border'] = '#2B2B2B'
    dynamicProps['FillAll'] = colors.white
    for (const key of targetMuscles) {
      dynamicProps[key] = colors.red;
    }
    return dynamicProps;
};
export const MUSCLEMAP = {
    Border: "#2B2B2B",
    Hair: "#e5e5e5",
    Neck: "#e6e6e6",
    Face: "#e4e4e4",
    Traps: "#e7e7e7",
    Upper_Back: "#e8e8e8",
    Shoulders: "#e9e9e9",
    Scapula: "#ededed",
    Pectorals: "#eeeeee",
    Triceps: "#eaeaea",
    Lats: "#ebebeb",
    Biceps: "#f0f0f0",
    Obliques: "#ececec",
    Abs: "#f3f3f3",
    Forearms: "#f2f2f2",
    Lower_Back: "#f4f4f4",
    Lower_Core: "#f5f5f5",
    Abductors: "#f6f6f6",
    Ass: "#f7f7f7",
    Quadriceps: "#f8f8f8",
    Hands: "#f9f9f9",
    Hamstrings: "#fafafa",
    Knees: "#fbfbfb",
    Back_Knee: "#fcfcfc" ,
    Shins: "#fdfdfd",
    Calves: "#fefefe",
    Foot: "#ffffff"
  }
export const fakeData = [
    { day: 'Monday', workoutName: 'Quads & Glutes', date: new Date(), id:'1' },
    { day: 'Wednesday', workoutName: 'Chest & Bi', date: new Date(), id:'2' },
    { day: 'Friday', workoutName: 'Shoulders', date: new Date(), id: '3' },
    { day: 'Thursday', workoutName: 'ASS DAY', date: new Date(), id: '4' },
    { day: 'Tuesday', workoutName: 'Legs', date: new Date(), id: '5' },
    { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '6' },
    { day: 'Monday', workoutName: 'Quads & Glutes', date: new Date(), id:'7' },
    { day: 'Wednesday', workoutName: 'Chest & Bi', date: new Date(), id:'8' },
    { day: 'Friday', workoutName: 'Shoulders', date: new Date(), id: '9' },
    { day: 'Thursday', workoutName: 'ASS DAY', date: new Date(), id: '10' },
    { day: 'Tuesday', workoutName: 'Legs', date: new Date(), id: '50' },
    { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '60' },
    { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '66' },
    { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '65' }
]; 

export const fonts = {
    "Lato-Bold": require("../assets/fonts/Lato/Lato-Bold.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato/Lato-Regular.ttf"),
    "Lato-Light": require("../assets/fonts/Lato/Lato-Light.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito/Nunito-Regular.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito/Nunito-Light.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito/Nunito-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter/static/Inter-Regular.ttf"),
    "Inter-Light": require("../assets/fonts/Inter/static/Inter-Light.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter/static/Inter-Bold.ttf"),
}
/* 
export const images = {
    blank: require('./assets/images/muscleMap/blank.png'),
    chest: require('./assets/images/muscleMap/chest.png'),
    back: require('./assets/images/muscleMap/back.png'),
    arms: require('./assets/images/muscleMap/arms.png'),
    legs: require('./assets/images/muscleMap/legs.png'),
    shoulders: require('./assets/images/muscleMap/shoulders.png'),
    abs: require('./assets/images/muscleMap/abs.png'),
    calves: require('./assets/images/muscleMap/calves.png'),
    hamstrings: require('./assets/images/muscleMap/hamstrings.png'),
    quads: require('./assets/images/muscleMap/quads.png'),
    ass: require('./assets/images/muscleMap/ass.png'),
    biceps: require('./assets/images/muscleMap/biceps.png'),
    triceps: require('./assets/images/muscleMap/triceps.png'),
    forearms: require('./assets/images/muscleMap/forearms.png'),
    traps: require('./assets/images/muscleMap/traps.png'),
    lats: require('./assets/images/muscleMap/lats.png')
}

export const muscleMap = (muscles: string) => {
    switch (muscles) {
        case 'chest': return images.chest
        case 'back': return images.back
        case 'arms': return images.arms
        case 'legs': return images.legs
        case 'shoulders': return images.shoulders
        case 'abs': return images.abs
        case 'calves': return images.calves
        case 'hamstrings': return images.hamstrings
        case 'quads': return images.quads
        case 'ass': return images.ass
        case 'biceps': return images.biceps
        case 'triceps': return images.triceps
        case 'forearms': return images.forearms
        case 'traps': return images.traps
        case 'lats': return images.lats
        default : return images.blank
    }
}

export const GROUPS = [
    "border",
    "hair",
    "face",
    "neck",
    "traps",
    "upper-back",
    "delts",
    "scapula",
    "pecs",
    "triceps",
    "lats",
    "biceps",
    "obliques",
    "abs",
    "forearms",
    "lower-back",
    "abs",
    "lower-core",
    "abductors",
    "ass",
    "quads",
    "hands",
    "hamstrings",
    "knees",
    "back",
    "calves",
    "foot"
]*/