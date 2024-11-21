import React from 'react';

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from 'components/common/VectorIcon';

import useCustomTheme from 'hooks/useCustomTheme';
import CustomText from 'components/common/CustomText';

type Props = {
    onPress: () => void;

    style?: StyleProp<ViewStyle>;

    amountIndicator?: boolean;
    currentAmount?: number;
    maxAmount?: number;
};

const ComposePhotoAddButton = (props: Props) => {
    const { colors } = useCustomTheme();

    const { onPress, style, amountIndicator = false, currentAmount = 0, maxAmount = 0 } = props;

    return (
        <PushAnimatedPressable
            onPress={onPress}
            scale={0.98}
            style={[
                {
                    backgroundColor: colors.inputBackground,
                },
                styles.container,
                style,
            ]}
        >
            <VectorIcon name="camera" size={20} style={styles.icon} />
            {amountIndicator && (
                <CustomText style={styles.amountIndicator}>
                    {`${currentAmount}/${maxAmount}`}
                </CustomText>
            )}
        </PushAnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 65,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    icon: {
        opacity: 0.6,
    },
    amountIndicator: {
        fontSize: 12,
        fontWeight: 500,
        opacity: 0.6,
        letterSpacing: 0.8,
    },
});

export default ComposePhotoAddButton;
