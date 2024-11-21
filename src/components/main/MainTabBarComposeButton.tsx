import React from 'react';

import { StyleSheet, ViewStyle } from 'react-native';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';

import useCustomTheme from 'hooks/useCustomTheme';
import VectorIcon from 'components/common/VectorIcon';
import CustomText from 'components/common/CustomText';

import { commonStyles } from 'styles';
import useDimensions from 'hooks/useDimensions';
import { HORIZONTAL_GAP } from 'constants/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticMedium } from 'utils/haptic';

type Props = {
    containerStyle?: ViewStyle;
    onPress: () => void;
};

//! deprecated
const MainTabBarComposeButton = (props: Props) => {
    const { wp } = useDimensions();
    const { colors } = useCustomTheme();
    const { bottom: bottomInset } = useSafeAreaInsets();

    const { containerStyle, onPress } = props;

    return (
        <PushAnimatedPressable
            style={[
                {
                    width: wp(100) - HORIZONTAL_GAP * 2,
                    bottom: 10 + bottomInset,
                    backgroundColor: colors.card,
                    ...commonStyles.dropShadow,
                },
                styles.container,
                containerStyle,
            ]}
            onPress={() => {
                hapticMedium();
                onPress();
            }}
        >
            <VectorIcon style={styles.icon} name={'plus'} color={colors.mainColor} size={30} />
            <CustomText style={[{ color: colors.mainColor }, styles.text]}>{'write'}</CustomText>
        </PushAnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        marginHorizontal: HORIZONTAL_GAP,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        borderRadius: 15,
    },
    icon: {
        ...commonStyles.textShadow,
    },
    text: {
        fontWeight: 600,
        fontSize: 12,
        ...commonStyles.textShadow,
    },
});

export default React.memo(MainTabBarComposeButton);
