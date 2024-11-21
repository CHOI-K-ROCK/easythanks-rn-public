import React, { ReactElement, useCallback } from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from 'react-native';
import CustomText from 'components/common/CustomText';
import { commonStyles } from 'styles';
import VectorIcon from 'components/common/VectorIcon';
import useCustomTheme from 'hooks/useCustomTheme';
import { handleHapticSimply } from 'utils/haptic';

type Props = {
    title: string;
    subTitle?: string;
    chevron?: boolean;

    leftComponenet?: ReactElement;
    rightComponent?: ReactElement;

    triggerHaptic?: boolean;
    hapticVelocity?: 'light' | 'medium' | 'heavy';
} & TouchableOpacityProps;

const CommonListItem = (props: Props) => {
    const { colors } = useCustomTheme();
    const {
        title,
        subTitle,
        chevron,

        leftComponenet,
        rightComponent,

        triggerHaptic,
        hapticVelocity = 'medium',

        onPress,
        ...restProps
    } = props;

    const _onPress = useCallback(
        (e: GestureResponderEvent) => {
            if (!onPress) return;

            triggerHaptic && handleHapticSimply(hapticVelocity);
            onPress(e);
        },
        [hapticVelocity, onPress, triggerHaptic]
    );

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.container}
                onPress={_onPress}
                {...restProps}
            >
                {leftComponenet && leftComponenet}

                <View>
                    <CustomText style={styles.title}>{title}</CustomText>
                    {subTitle && (
                        <CustomText style={[{ color: colors.subtitle }, styles.subtitle]}>
                            {subTitle}
                        </CustomText>
                    )}
                </View>

                {chevron && <VectorIcon name={'chevron-right'} color={colors.subtitle} />}
                {rightComponent && rightComponent}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.rowCenter,
        justifyContent: 'space-between',
        minHeight: 65,
        borderRadius: 10,
    },
    title: {
        fontSize: 17,
        fontWeight: 600,
    },
    subtitle: {
        marginTop: 5,
        fontSize: 13,
    },
});

export default React.memo(CommonListItem);
