import { Platform, useWindowDimensions } from 'react-native';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 *
 * @returns wp - 비율에 따라 디바이스 너비 반환 매소드 / wp(비율)
 * @returns hp - 비율에 따라 디바이스 높이 반환 매소드 / wp(높이)
 * @returns windowWidth - 디바이스의 화면 너비 반환
 * @returns windowHeight - 디바이스의 화면 높이 반환
 */
const useDimensions = () => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const { top: topInset } = useSafeAreaInsets();

    // ios → topInset 을 포함하여 dimensions.height 을 계산함.
    // aos → topInset 을 포함하지 않고 dimesions.height 을 계산함.
    const windowHeightByOs = Platform.OS === 'android' ? windowHeight + topInset : windowHeight;

    const wp = useCallback(
        (ratio: number) => {
            return (windowWidth * ratio) / 100;
        },
        [windowWidth]
    );

    const hp = useCallback(
        (ratio: number) => {
            return (windowHeightByOs * ratio) / 100;
        },
        [windowHeightByOs]
    );

    return { wp, hp, windowWidth, windowHeight };
};

export default useDimensions;
