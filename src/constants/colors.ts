import { DefaultTheme } from '@react-navigation/native';
import colorsShades from './colorsShades';

const { TAN, WHITE, BLACK, GRAY } = colorsShades;

const COMMON_COLOR = {
    ...DefaultTheme.colors,
    TAN,
    WHITE,
    BLACK,
    GRAY,
};

const DARK_COLOR = {
    ...COMMON_COLOR,

    mainColor: TAN[500],

    text: WHITE[50],
    textReverse: BLACK[1000],
    subtitle: WHITE[700],

    card: BLACK[800],

    divider: GRAY[700],
    bottomSheetDivider: GRAY[600],

    mainBackground: GRAY[800],
    settingBackground: GRAY[900],
    inputBackground: GRAY[900],
    selectorBackground: BLACK[900],

    buttonBackground: GRAY[700],
    buttonBorder: GRAY[700],

    toastBackground: 'rgba(0,0,0,0.6)',

    caution: '#ea8c07',
    complete: '#62c70a',
    warning: '#d42c16',
};

const LIGHT_COLOR = {
    ...COMMON_COLOR,

    mainColor: TAN[600],

    text: BLACK[1000],
    textReverse: WHITE[50],
    subtitle: BLACK[500],

    card: WHITE[50],

    divider: WHITE[300],
    bottomSheetDivider: GRAY[100],

    mainBackground: WHITE[100],
    settingBackground: WHITE[200],
    inputBackground: WHITE[200],
    selectorBackground: GRAY[100],

    buttonBackground: WHITE[200],
    buttonBorder: WHITE[300],

    toastBackground: 'rgba(0,0,0,0.4)',

    caution: '#ffa50a',
    complete: '#75ed0b',
    warning: '#eb4933',
};

export type CustomColorType = typeof DARK_COLOR | typeof LIGHT_COLOR;

export { DARK_COLOR, LIGHT_COLOR };
