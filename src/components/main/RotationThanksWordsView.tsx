import React, { useCallback, useEffect, useRef, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import { THANKS_MAXIMS } from 'constants/string';
import VectorIcon from 'components/common/VectorIcon';

import Animated, { withDelay, withTiming } from 'react-native-reanimated';

import { getRandomArrayValue } from 'utils/data';

type Props = {
    rotate?: boolean;
    rotateSec?: number;
};

const RotationThanksWordsView = (props: Props) => {
    const { rotate = true, rotateSec = 10 } = props;

    const [maximData, setMaximData] = useState<{ maxim: string; author: string }>(
        getRandomArrayValue(THANKS_MAXIMS)
    );

    const { maxim, author } = maximData;

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (rotate) {
            timerRef.current = setInterval(() => {
                getOtherMaxim();
            }, rotateSec * 1000);
        }

        return () => {
            if (rotate) {
                clearInterval(timerRef.current as NodeJS.Timeout);
            }
        };
    }, [rotate, rotateSec]);

    //animation
    const createDelayedEntering = useCallback((delay: number) => {
        return () => {
            'worklet';

            const animations = {
                opacity: withDelay(delay, withTiming(1, { duration: 200 })),
                transform: [
                    {
                        translateX: withDelay(delay, withTiming(0, { duration: 200 })),
                    },
                ],
            };
            const initialValues = {
                opacity: 0,
                transform: [
                    {
                        translateX: 20,
                    },
                ],
            };

            return { animations, initialValues };
        };
    }, []);

    const createDelayedExiting = (delay: number) => {
        return () => {
            'worklet';

            const animations = {
                opacity: withDelay(delay, withTiming(0, { duration: 300 })),
                transform: [
                    {
                        translateX: withDelay(delay, withTiming(-20, { duration: 300 })),
                    },
                ],
            };
            const initialValues = {
                opacity: 1,
                transform: [
                    {
                        translateX: 0,
                    },
                ],
            };

            return { animations, initialValues };
        };
    };

    // handler

    const getOtherMaxim = () => {
        setMaximData(getRandomArrayValue(THANKS_MAXIMS));
    };

    return (
        <View style={[styles.container]}>
            <View>
                <Animated.View
                    key={maxim}
                    entering={createDelayedEntering(0)}
                    exiting={createDelayedExiting(0)}
                >
                    <CustomText style={[{}, styles.maxim]}>{maxim}</CustomText>
                </Animated.View>
                <View>
                    <Animated.View
                        key={author}
                        entering={createDelayedEntering(200)}
                        exiting={createDelayedExiting(0)}
                    >
                        <CustomText style={[{}, styles.author]}>{author}</CustomText>
                    </Animated.View>
                    <VectorIcon name="refresh" onPress={getOtherMaxim} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 15,
    },
    maxim: {
        fontSize: 14,
        fontWeight: 500,
    },
    author: {
        fontSize: 12,
        opacity: 0.5,
    },
});

export default RotationThanksWordsView;
