import React, { useState } from 'react';

import { View, StyleSheet } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import LottieView from 'lottie-react-native';

type Props = FastImageProps & {
    loadingIndicator?: boolean;
};

const CustomImage = (props: Props) => {
    const { loadingIndicator = false, onLoadEnd, ...restProps } = props;

    const [loaded, setLoaded] = useState<boolean>(false);

    return (
        <FastImage
            onLoadEnd={() => {
                onLoadEnd && onLoadEnd();
                setLoaded(true);
            }}
            {...restProps}
        >
            {loadingIndicator && !loaded && (
                <View style={styles.indicatorContainer}>
                    <LottieView
                        autoPlay
                        source={require('../../../assets/lottie/loading_dots.json')}
                        loop
                        style={styles.indicator}
                    />
                </View>
            )}
        </FastImage>
    );
};

const styles = StyleSheet.create({
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        height: 200,
        width: 200,
        position: 'absolute',
    },
});

export default React.memo(CustomImage);
