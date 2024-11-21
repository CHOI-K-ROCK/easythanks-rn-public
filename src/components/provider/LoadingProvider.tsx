import React from 'react';

import { useRecoilValue } from 'recoil';
import { isLoadingAtom } from 'states/ui';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';

import useDimensions from 'hooks/useDimensions';
import useCustomTheme from 'hooks/useCustomTheme';
import LottieView from 'lottie-react-native';

import { commonStyles } from 'styles';

const LoadingProvider = () => {
    const loadingState = useRecoilValue(isLoadingAtom);

    return loadingState && <LoadingOverlay />;
};

// ---- components ----

const LoadingOverlay = () => {
    const { wp } = useDimensions();
    const { colors } = useCustomTheme();

    const backgroundSize = Math.min(wp(25), 150);
    const lottieSize = Math.min(wp(50), 200);

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            <View
                style={[
                    {
                        width: backgroundSize,
                        height: backgroundSize,
                        backgroundColor: colors.card + '90',
                    },
                    styles.loadingContainer,
                ]}
            >
                <View style={styles.indicatorContainer}>
                    <LottieView
                        autoPlay
                        source={require('../../../assets/lottie/loading_dots.json')}
                        loop
                        style={{ height: lottieSize, width: lottieSize }}
                    />
                </View>
                <CustomText style={styles.text}>{'잠시만\n기다려주세요'}</CustomText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 999,
        ...commonStyles.centered,
    },
    loadingContainer: {
        maxHeight: 150,
        maxWidth: 150,
        borderRadius: 15,
        ...commonStyles.centered,
    },
    indicatorContainer: {
        justifyContent: 'center',
        height: ' 15%',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.7,
    },
});

export default LoadingProvider;
