import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';

import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';
import { WEEK_DAYS } from 'constants/string';
import { handleHapticSimply } from 'utils/haptic';

type Props = {
    initialValue: boolean[];
    onSelect: (data: boolean[]) => void;

    triggerHaptic?: boolean;
    hapticVelocity?: 'light' | 'medium' | 'heavy';
};

const WeekDaySelector = (props: Props) => {
    const { colors } = useCustomTheme();
    const { initialValue, onSelect, triggerHaptic, hapticVelocity = 'medium' } = props;

    const [selected, setSelected] = useState<boolean[]>(
        initialValue || [false, false, false, false, false, false, false]
    );

    const SELECTED_BACKGROUND_COLOR = '#000';
    const DISABLED_BACKGROUND_COLOR = colors.inputBackground;
    const SELECTED_TEXT_COLOR = '#FFF';
    const DISABLED_TEXT_COLOR = colors.text;

    const onSelectHandler = (idx: number) => {
        const temp = [...selected];
        temp[idx] = !selected[idx];

        setSelected(temp);
        onSelect(temp);

        if (triggerHaptic) {
            handleHapticSimply(hapticVelocity);
        }
    };

    return (
        <View style={styles.container}>
            {WEEK_DAYS.map((_, idx) => {
                const isSelected = selected[idx];

                return (
                    <PushAnimatedPressable
                        key={idx.toString()}
                        onPress={() => onSelectHandler(idx)}
                        style={[
                            {
                                backgroundColor: isSelected
                                    ? SELECTED_BACKGROUND_COLOR
                                    : DISABLED_BACKGROUND_COLOR,
                            },
                            styles.day,
                        ]}
                    >
                        <CustomText
                            style={[
                                {
                                    opacity: isSelected ? 1 : 0.3,
                                    color: isSelected ? SELECTED_TEXT_COLOR : DISABLED_TEXT_COLOR,
                                },
                                styles.text,
                            ]}
                        >
                            {WEEK_DAYS[idx]}
                        </CustomText>
                    </PushAnimatedPressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    day: {
        padding: 10,
        borderRadius: 5,
        ...commonStyles.dropShadow,
    },
    text: {
        fontSize: 16,
        fontWeight: 500,
    },
});

export default WeekDaySelector;
