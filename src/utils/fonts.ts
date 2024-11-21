import { TextStyle } from 'react-native';

/**
 * 안드로이드에서 fontWeight이 인식되지 않는 문제를 해결하기 위해,
 *
 * fontWeight 을 fontFamily 로 변환하여 반환합니다.(font - Pretendard)
 *
 * @param fontWeight
 * @returns {string} fontFamily
 */
export const convertFontWeightToFontFamily = (fontWeight: TextStyle['fontWeight']) => {
    if (fontWeight === undefined) {
        return 'Pretendard-Regular';
    }

    switch (fontWeight) {
        case '100':
        case 'ultralight':
            return 'Pretendard-Thin';
        case '200':
        case 'thin':
            return 'Pretendard-ExtraLight';
        case '300':
        case 'light':
            return 'Pretendard-Light';
        case 'normal':
        case '400':
            return 'Pretendard-Regular';
        case '500':
        case 'medium':
            return 'Pretendard-Medium';
        case '600':
        case 'semibold':
            return 'Pretendard-SemiBold';
        case 'bold':
        case '700':
            return 'Pretendard-Bold';
        case '800':
        case 'heavy':
            return 'Pretendard-ExtraBold';
        default:
            'Pretendard-Regular';
    }
};
