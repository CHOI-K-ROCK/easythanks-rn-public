import React from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import CustomButton from 'components/common/CustomButton';
import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';
import VectorIcon from 'components/common/VectorIcon';

type Props = {
    onPressOptOut: () => void;
};

const OptOutCautionView = (props: Props) => {
    const { colors } = useCustomTheme();
    const { onPressOptOut } = props;

    return (
        <View style={styles.optOutContainer}>
            <CustomText style={styles.optOutTitle}>{'회원 탈퇴'}</CustomText>

            <View
                style={[{ backgroundColor: colors.settingBackground }, styles.optOutInnerContainer]}
            >
                <VectorIcon
                    name="alert"
                    color={colors.caution}
                    size={40}
                    style={styles.alertIcon}
                />
                <CustomText style={[{ color: colors.subtitle }, styles.optOutCaution]}>
                    {'회원 탈퇴 시 작성된 모든 일기 및 데이터가 초기화됩니다.'}
                </CustomText>
                <CustomText style={[{ color: colors.subtitle }, styles.optOutCaution]}>
                    {'회원 탈퇴 후 데이터를 복구 할 수 없습니다.'}
                </CustomText>
                <CustomText style={[{ color: colors.subtitle }, styles.optOutCaution]}>
                    {'신중하게 고려해주세요!'}
                </CustomText>
                <CustomButton
                    title={'회원탈퇴하기'}
                    onPress={onPressOptOut}
                    style={[{ backgroundColor: colors.warning }, styles.optOutButton]}
                    titleStyle={styles.optOutButtonTitle}
                    triggerHaptic
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    optOutContainer: {},
    optOutTitle: {
        ...commonStyles.subject,
    },
    optOutInnerContainer: {
        borderRadius: 15,
        padding: 20,
        gap: 2,
    },
    alertIcon: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    optOutCaution: {
        fontSize: 13,
    },
    optOutButton: {
        marginTop: 20,
    },
    optOutButtonTitle: {
        color: '#FFF',
        fontWeight: 500,
    },
});

export default OptOutCautionView;
