import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomText from 'components/common/CustomText';

import useDimensions from 'hooks/useDimensions';
import useCustomTheme from 'hooks/useCustomTheme';

import HorizontalDivider from 'components/common/HorizontalDivider';
import { HORIZONTAL_GAP } from 'constants/style';
import { commonStyles } from 'styles';

type Props = {
    leftComponent?: React.ReactElement;
};

const MainNavigationBar = (props: Props) => {
    const { wp, hp } = useDimensions();
    const { colors } = useCustomTheme();

    const { leftComponent } = props;

    return (
        <View>
            <View
                style={[
                    {
                        paddingHorizontal: wp(5),
                        paddingTop: hp(0.5),
                        paddingBottom: hp(1.5),
                        backgroundColor: colors.mainBackground,
                    },
                    styles.container,
                ]}
            >
                <View style={{ flex: 1 }}>
                    <View>
                        <CustomText style={[{ color: colors.mainColor }, styles.logo]}>
                            {'EasyThanks'}
                        </CustomText>
                        <CustomText style={styles.catch}>매일매일, 감사일기</CustomText>
                    </View>
                </View>

                {leftComponent && leftComponent}
            </View>
            <HorizontalDivider
                style={styles.divider}
                color={colors.divider}
                width={wp(100) - HORIZONTAL_GAP * 2}
                height={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.rowCenter,
    },
    logo: {
        fontSize: 20,
        fontWeight: 700,
    },
    catch: {
        fontSize: 12,
        fontWeight: 500,
    },
    divider: {
        alignSelf: 'center',
        opacity: 1,
    },
});

export default MainNavigationBar;
