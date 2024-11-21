import React from 'react';

import { Platform, StyleSheet, ViewStyle } from 'react-native';

import VectorIcon from 'components/common/VectorIcon';
import CustomText from 'components/common/CustomText';
import CardBox from 'components/common/CardBox';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCustomTheme from 'hooks/useCustomTheme';

import { hapticMedium } from 'utils/haptic';

import { HORIZONTAL_GAP } from 'constants/style';

type Props = {
    containerStyle?: ViewStyle;
    onPress: () => void;
};

const MainComposeFloatButton = (props: Props) => {
    const { colors } = useCustomTheme();
    const { bottom: bottomInset } = useSafeAreaInsets();

    const { containerStyle, onPress } = props;

    return (
        <CardBox
            onPress={() => {
                hapticMedium();
                onPress();
            }}
            scale={0.98}
            style={[
                {
                    bottom: Platform.OS === 'android' ? bottomInset + 20 : bottomInset, //safeAreaInsets
                    backgroundColor: colors.card,
                },
                styles.container,
                containerStyle,
            ]}
        >
            <VectorIcon
                style={styles.icon}
                name={'book-open'}
                color={colors.mainColor}
                size={15}
                iconProvider="FontAwesome6"
            />
            <CustomText style={[{ color: colors.mainColor }, styles.text]}>{'일기작성'}</CustomText>
        </CardBox>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        marginHorizontal: HORIZONTAL_GAP,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        width: 120,
        height: 60,

        right: 0,
    },
    text: {
        fontWeight: 600,
        fontSize: 16,
    },
    icon: {
        marginRight: 7,
    },
});

export default React.memo(MainComposeFloatButton);
