import {Appearance} from 'react-native';
let darkMode = Appearance.getColorScheme() === 'light' ? false  : true;

darkMode ?
    colors = {
        primary: '#181823',
        secondary: '#413543',
        darker: '#0f0f14',
        purple: '#8F43EE',
        red:'#ed5050ff',
        yellow: '#F0EB8D',
        lighter: '#b4b4b4',
        white: '#FFF',
        back: '#000'
    }
    :
    colors = {
        primary: '#e2e2e2',
        secondary: '#e7e7dc',
        darker: '#f0f0eb',
        purple: '#8F43EE',
        red:'#ed5050ff',
        yellow: '#0f1472',
        lighter: '#4b4b4b',
        white: '#000',
        back: '#000'
    }
export default colors;