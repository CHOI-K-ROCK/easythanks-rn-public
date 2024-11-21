import { CustomColorType, DARK_COLOR, LIGHT_COLOR } from '../constants/colors';
import { Theme, useTheme } from '@react-navigation/native';

export type AppThemeType = 'light' | 'dark' | 'device';
export type CustomThemeType = Theme & { colors: CustomColorType };
/**
 * @returns colors - 현재 테마의 색상 정보
 * @returns dark - 현재 다크 테마 여부
 */

const light = {
    dark: false,
    colors: LIGHT_COLOR,
};

const dark = {
    dark: true,
    colors: DARK_COLOR,
};

export const customTheme = {
    light,
    dark,
};

const useCustomTheme = useTheme as () => CustomThemeType;

export default useCustomTheme;
