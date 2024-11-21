import React, { useEffect, useRef, useState } from 'react';

import { BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';

import { BottomSheetType } from 'types/models/bottomSheet';

import useDimensions from 'hooks/useDimensions';
import useCustomTheme from 'hooks/useCustomTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useDelay from 'hooks/useDelay';

const AnimatedPressble = Animated.createAnimatedComponent(Pressable);

const BottomSheet = (props: BottomSheetType) => {
    const { hp } = useDimensions();
    const { bottom: bottomInset } = useSafeAreaInsets();
    const { colors } = useCustomTheme();
    const delay = useDelay();

    const {
        children,
        closeBottomSheet,
        closeButton = true,
        closeByBackdrop = true,
        rawElement,
    } = props;

    const [visible, setVisible] = useState<boolean>(false);

    const [sheetHeight, setSheetHeight] = useState<number>(0);

    const ANIMATION_DURATION = 300;
    const easingBazier = Easing.bezier(0.25, 0.1, 0.25, 1);

    const sheetRef = useRef<View>(null);

    useEffect(() => {
        if (sheetRef.current) {
            // 시트 높이 설정
            // onLayout 사용하지 않는 이유 -> 시트의 높이가 변경될 여지가 거의 없으므로, 불필요한 계산이 생길 가능성 줄이기 위해
            sheetRef.current.measure((x, y, width, height) => {
                setSheetHeight(height);
            });
        }

        setVisible(true);
        // 초기 애니메이션 재생
    }, [bottomInset]);

    useEffect(() => {
        // 안드로이드 뒤로가기 버튼 처리
        if (Platform.OS === 'android') {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                setVisible(false);

                const handleClose = async () => {
                    await delay(ANIMATION_DURATION);
                    closeBottomSheet();
                };

                handleClose();
                return true;
            });

            return () => backHandler.remove();
        }
    }, [closeBottomSheet, delay]);

    const animatedOpacity = useAnimatedStyle(() => {
        return {
            opacity: withTiming(visible ? 1 : 0, {
                duration: ANIMATION_DURATION,
                easing: easingBazier,
            }),
        };
    }, [visible]);

    const animatedContentOpacity = useAnimatedStyle(() => {
        return {
            opacity: withTiming(visible ? 1 : 0, {
                duration: visible ? 500 : 100,
                easing: easingBazier,
            }),
        };
    }, [visible]);

    const animatedAppear = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withTiming(visible ? -sheetHeight : 0, {
                        duration: ANIMATION_DURATION,
                        easing: easingBazier,
                    }),
                },
            ],
        };
    }, [sheetHeight, visible]);

    const handleCloseBottomSheet = async () => {
        setVisible(false);
        await delay(ANIMATION_DURATION);
        closeBottomSheet();
    };

    const handleBackdropPress = () => {
        closeByBackdrop && handleCloseBottomSheet();
    };

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
            <AnimatedPressble
                onPress={handleBackdropPress}
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999 },
                    animatedOpacity,
                ]}
            />
            <Animated.View
                ref={sheetRef}
                style={[
                    {
                        // 화면의 높이 만큼 하단으로 밀어넣은 뒤,
                        // animatedAppear로 sheetHeight 만큼 올라오게끔 한다.
                        top: hp(100),
                        zIndex: 999,
                    },
                    animatedAppear,
                ]}
            >
                {rawElement ? ( // 요소 그대로 표시
                    <View>{children}</View>
                ) : (
                    <View>
                        {closeButton && <BottomSheetCloseButton onPress={handleCloseBottomSheet} />}
                        {/* container */}
                        <Animated.View
                            style={[
                                {
                                    backgroundColor: colors.card,
                                    paddingBottom: bottomInset,
                                },
                                styles.contentContainer,
                            ]}
                        >
                            {/* content */}
                            <Animated.View style={[animatedContentOpacity]}>
                                {children}
                            </Animated.View>
                        </Animated.View>
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

// deps components

const BottomSheetCloseButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <PushAnimatedPressable onPress={onPress} style={styles.closeButtonContainer}>
            <CustomText style={styles.closeButtonText}>{'닫기'}</CustomText>
            <VectorIcon name="close" color={'#FFF'} />
        </PushAnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    contentContainer: {
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
        paddingTop: 15,
    },
    closeButtonContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
    },
    closeButtonText: {
        color: '#FFF',
        fontWeight: 600,
    },
});

export default BottomSheet;
