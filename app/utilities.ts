export const daysOfTheWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
export const dateToWDDDMMYY = (f: Date) => {
    return (daysOfTheWeek[f.getDay()] + ', ' + f.toLocaleString('default', { month: 'long' })) + ' ' + f.getDate() + ', ' + f.getFullYear();
}