import React, { useMemo } from 'react';

import CommonModal from 'components/overlay/modal/CommonModal';
import CustomTextInput from 'components/common/CustomTextInput';

import useCustomTheme from 'hooks/useCustomTheme';
import { CommonModalButtonType } from 'types/models/modal';

import useInput from 'hooks/useInput';
import CustomText from 'components/common/CustomText';
import { StyleSheet, View } from 'react-native';

type Props = {
    onConfirm: () => void;
    closeOverlay: () => void;
};

const OptOutDialogModal = (props: Props) => {
    const { colors } = useCustomTheme();
    const { value, handleChange } = useInput();
    const { onConfirm, closeOverlay } = props;

    const buttons: CommonModalButtonType[] = useMemo(
        () => [
            {
                content: '네 탈퇴할게요',
                onPress: onConfirm,
                backgroundColor: colors.warning,
                textColor: '#FFF',
                disabled: value !== '회원탈퇴',
            },
            {
                content: '좀 더 생각해볼게요',
                onPress: closeOverlay,
            },
        ],
        [closeOverlay, colors.warning, onConfirm, value]
    );

    return (
        <CommonModal
            buttons={buttons}
            closeModal={closeOverlay}
            title="회원탈퇴"
            text={'정말로 탈퇴하시겠어요?\n모든 데이터가 초기화 되고 \n되돌릴 수 없습니다!'}
        >
            <View style={styles.container}>
                <CustomTextInput value={value} onChangeText={handleChange} placeholder="회원탈퇴" />
                <CustomText style={styles.help}>
                    *탈퇴를 원하시면 회원탈퇴를 입력해주세요.
                </CustomText>
            </View>
        </CommonModal>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
    },
    help: {
        fontSize: 13,
        opacity: 0.5,
        marginLeft: 5,
        marginTop: 5,
    },
});

export default OptOutDialogModal;
