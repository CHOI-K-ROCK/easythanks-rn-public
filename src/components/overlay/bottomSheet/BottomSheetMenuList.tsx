import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import CustomText from 'components/common/CustomText';
import HorizontalDivider from 'components/common/HorizontalDivider';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from 'components/common/VectorIcon';

import useCustomTheme from 'hooks/useCustomTheme';

type MenuItem = {
    title: string;
    onPress: () => void;
    color?: string;
    iconName?: string;

    visible?: boolean;
};

type Props = {
    data: MenuItem[];
};

const BottomSheetMenuList = ({ data }: Props) => {
    const { colors } = useCustomTheme();

    const _renderItem = ({ item }: { item: MenuItem }) => {
        const { title, onPress, color = colors.text, iconName, visible = true } = item;

        if (!visible) return null;

        return (
            <PushAnimatedPressable key={title} onPress={onPress} style={styles.menuWapper}>
                <CustomText style={[{ color }, styles.text]}>{title}</CustomText>
                {iconName && <VectorIcon name={iconName} size={17} color={color} />}
            </PushAnimatedPressable>
        );
    };

    const expetedNoneVisibleData = useMemo(
        () => data.filter(item => item.visible !== false),
        [data]
    );

    return (
        <FlatList
            data={expetedNoneVisibleData}
            renderItem={_renderItem}
            keyExtractor={e => e.title}
            bounces={false}
            ItemSeparatorComponent={() => (
                <HorizontalDivider
                    width={'95%'}
                    style={[{ backgroundColor: colors.bottomSheetDivider }, styles.separator]}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    menuWapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingVertical: 15,
    },
    text: {
        fontSize: 16,
        fontWeight: 500,
    },
    separator: {
        alignSelf: 'center',
    },
});

export default BottomSheetMenuList;
