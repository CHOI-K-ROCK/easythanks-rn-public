import React from 'react';

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from 'components/common/VectorIcon';
import CustomImage from 'components/common/CustomImage';

import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    onPress?: () => void;
    onPressClose?: () => void;
    imgUri: string;

    style?: StyleProp<ViewStyle>;
};

const ComposePhotoThumbnailButton = (props: Props) => {
    const { colors } = useCustomTheme();

    const { onPress, onPressClose, imgUri, style } = props;

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
            <CustomImage source={{ uri: imgUri }} style={styles.thumbnail} loadingIndicator />
            <PushAnimatedPressable onPress={onPressClose} style={styles.closeButtonConainer}>
                <VectorIcon name="close" size={17} color={'#fff'} style={styles.closeButtonIcon} />
            </PushAnimatedPressable>
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

    thumbnail: {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    closeButtonConainer: {
        position: 'absolute',
        top: -10,
        right: -15,
        padding: 5,
    },
    closeButtonIcon: {
        backgroundColor: '#000',
        borderRadius: 999,
        padding: 3,
    },
});

export default ComposePhotoThumbnailButton;
