import React from 'react';

import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { commonStyles } from 'styles';

import ProfilePlaceholder from '../../../assets/images/profile_placeholder.png';

import CustomImage from './CustomImage';

type Props = { uri: string | null | undefined; style?: StyleProp<ViewStyle> };

const ProfilePicture = (props: Props) => {
    const { uri, style } = props;

    return (
        <View style={[styles.profileImageContainer, style]}>
            <CustomImage
                style={styles.profileImage}
                source={uri ? { uri } : ProfilePlaceholder}
                loadingIndicator
            />
        </View>
    );
};
const styles = StyleSheet.create({
    profileImageContainer: {
        width: 100,
        aspectRatio: 1,

        borderRadius: 15,

        backgroundColor: '#000',
        ...commonStyles.dropShadow,
    },
    profileImage: {
        borderRadius: 15,
        width: '100%',
        height: '100%',
    },
});

export default React.memo(ProfilePicture);
