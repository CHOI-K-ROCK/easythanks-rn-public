import React from 'react';

import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradientView from './LinearGradientView';
import CustomText from './CustomText';
import CustomImage from './CustomImage';
import CardBox from './CardBox';

import { PostDataType } from 'types/models/post';

import useCustomTheme from 'hooks/useCustomTheme';

import { convertDateToString } from 'utils/date';
import moment from 'moment-timezone';

import { commonStyles } from 'styles';

type Props = {
    data: PostDataType;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

const PostThumbnail = (props: Props) => {
    const { colors, dark } = useCustomTheme();
    const { data, style, onPress } = props;

    const { title, content, photos = [], date } = data;

    const timeZone = moment.tz.guess();
    const convertedDate = moment.utc(date).tz(timeZone);
    // 전달 받는 date -> utc 시간이므로 현재 타임존의 시간으로 변환이 필요함 (moment.js 사용)

    const dateString = convertDateToString(convertedDate.toDate());
    const defaultImage = photos[0]; // 첫번째 이미지가 썸네일에 표시된다.

    const textColor = !dark && defaultImage ? '#FFF' : colors.text;

    return (
        <CardBox
            style={[styles.container, style]}
            scale={0.98}
            activeOpacity={0.9}
            onPress={onPress}
        >
            {photos && defaultImage && (
                <View style={[StyleSheet.absoluteFill, styles.imageContainer]}>
                    <CustomImage
                        source={{ uri: defaultImage }}
                        style={[StyleSheet.absoluteFill]}
                        resizeMode="cover"
                        loadingIndicator
                    />
                    <LinearGradientView
                        colors={['rgba(0,0,0,0.9)', 0]}
                        locations={[0.1, 0.7]}
                        gradientDirection="ltr"
                        style={StyleSheet.absoluteFill}
                    />
                </View>
            )}
            <View style={styles.titleContainer}>
                <CustomText style={[{ color: textColor }, styles.title]}>{title}</CustomText>
                <CustomText style={[{ color: textColor }, styles.date]}>{dateString}</CustomText>
            </View>
            <CustomText style={[{ color: textColor }, styles.content]} numberOfLines={2}>
                {content}
            </CustomText>
        </CardBox>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 120,
        padding: 15,
        justifyContent: 'space-between',

        ...commonStyles.dropShadow,
    },
    imageContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    titleContainer: {
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 600,
    },
    date: {
        fontWeight: 300,
    },
    content: {},
});

export default React.memo(PostThumbnail);
