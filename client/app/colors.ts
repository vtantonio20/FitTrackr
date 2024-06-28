import { Appearance } from 'react-native';

type Colors = {
  primary: string;
  secondary: string;
  darker: string;
  purple: string;
  red: string;
  yellow: string;
  lighter: string;
  white: string;
  back: string;
  lightYellow: string;
};

let colors: Colors;

if (Appearance.getColorScheme() === 'dark') {
  colors = {
    primary: '#181823',
    secondary: '#413543',
    darker: '#0f0f14',
    purple: '#8F43EE',
    red: '#ed5050ff',
    yellow: '#F0EB8D',
    lighter: '#b4b4b4',
    white: '#FFF',
    back: '#000',
    lightYellow: 'rgba(240, 235, 141, 0.54)'
  };
} else {
  colors = {
    primary: '#f0f0eb',
    secondary: '#e7e7dc',
    darker: '#e2e2e2',
    purple: '#8F43EE',
    red: '#ed5050ff',
    yellow: '#000',
    lighter: '#4b4b4b',
    white: '#000',
    back: '#000',
    lightYellow: 'rgba(15, 235, 141, 0.54)'
  };
}

export default colors;
