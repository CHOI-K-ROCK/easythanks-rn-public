import React, { useCallback, useState } from 'react';

import {
    ColorValue,
    LayoutChangeEvent,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    ViewToken,
} from 'react-native';
import CustomImage from './CustomImage';

import Animated, {
    SharedValue,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    images: string[];

    width?: number;
    height?: number;
    aspectRatio?: number;

    backgroundColor?: ColorValue;
    style?: StyleProp<ViewStyle>;
};

const ImageCarousel = (props: Props) => {
    const { colors } = useCustomTheme();

    const {
        images,
        width,
        height,
        aspectRatio = 4 / 3,
        backgroundColor = colors.inputBackground,
        style,
    } = props;

    const [layoutWidth, setLayoutWidth] = useState<number>(0);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const IS_MULTIPLE_IMAGE = images.length > 1;

    const _onLayout = useCallback((e: LayoutChangeEvent) => {
        setLayoutWidth(e.nativeEvent.layout.width);
    }, []);

    const _onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]) {
                // 한 화면에 여러개가 보이는 경우 viewableItems 배열에 보이는 모든 요소를 담는다.
                // 하지만, 현재는 요소의 너비를 layoutWidth 로 처리하였고, 한번에 보이는 요소가 하나 뿐 이므로
                // 배열의 0번째 요소의 인덱스만을 참고한다.
                const { index } = viewableItems[0];
                setCurrentImageIndex(index as number);
            }
        },
        []
    );

    // animation
    const scrollX = useSharedValue(0);

    const onAnimatedScroll = useAnimatedScrollHandler({
        onScroll: e => {
            scrollX.value = e.contentOffset.x;
        },
    });

    // ui
    const _renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => (
            <FadeAnimatedCarouselImage
                aspectRatio={aspectRatio}
                index={index}
                uri={item}
                scrollX={scrollX}
                width={layoutWidth}
            />
        ),
        [aspectRatio, layoutWidth, scrollX]
    );

    const _keyExtractor = useCallback((item: string) => {
        return item;
        // 테스트 단계에선 index 를 쓰나, 실사용에서는 서로 다른 url이 key로 사용돼야함
    }, []);

    return (
        <View
            onLayout={_onLayout}
            style={[
                {
                    width,
                    height,
                    backgroundColor,
                },
                style,
            ]}
        >
            <Animated.FlatList
                data={images}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={IS_MULTIPLE_IMAGE}
                snapToInterval={layoutWidth}
                decelerationRate={'fast'}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                onViewableItemsChanged={_onViewableItemsChanged}
                onScroll={onAnimatedScroll}
            />
            <View
                style={[
                    { width: layoutWidth, bottom: layoutWidth * 0.02 },
                    styles.indicatorContainer,
                ]}
            >
                {IS_MULTIPLE_IMAGE && (
                    <CarouselIndicator length={images.length} currentIndex={currentImageIndex} />
                )}
            </View>
        </View>
    );
};

// deps component

const FadeAnimatedCarouselImage = (props: {
    uri: string;
    index: number;
    scrollX: SharedValue<number>;
    width: number;
    aspectRatio: number;
}) => {
    const { uri, index, scrollX, width, aspectRatio } = props;

    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * width + width * 0.2,
            index * width,
            (index + 1) * width - width * 0.2,
        ];
        const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], 'clamp');

        return {
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    width: width,
                    aspectRatio,
                },
                animatedStyle,
            ]}
        >
            <CustomImage
                resizeMode="contain"
                source={{ uri: uri }}
                style={styles.image}
                loadingIndicator
            />
        </Animated.View>
    );
};

const CarouselIndicator = (props: {
    length: number;
    currentIndex: number;

    gap?: number;

    activeColor?: string;
    deactiveColor?: string;
}) => {
    const {
        length,
        currentIndex,
        gap = 7,
        activeColor = '#ffffff',
        deactiveColor = '#ffffff50',
    } = props;

    return (
        <View style={[{ gap }, styles.indicatorWrapper]}>
            {Array.from({ length }).map((_, idx) => {
                const IS_ACTIVE_INDICATOR = currentIndex === idx;

                return (
                    <AnimatedDot
                        key={idx.toString()}
                        active={IS_ACTIVE_INDICATOR}
                        activeColor={activeColor}
                        deactiveColor={deactiveColor}
                    />
                );
            })}
        </View>
    );
};

const AnimatedDot = (props: { active: boolean; activeColor: string; deactiveColor: string }) => {
    const { active, activeColor, deactiveColor } = props;

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(active ? activeColor : deactiveColor, { duration: 200 }),
    }));

    return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    indicatorContainer: {
        position: 'absolute',
    },
    indicatorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        aspectRatio: 1,
        borderRadius: 999,
    },
});

export default ImageCarousel;
