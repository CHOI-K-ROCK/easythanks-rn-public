import React from 'react';
import VectorIcon from 'components/common/VectorIcon';
import useCustomTheme from 'hooks/useCustomTheme';
import CommonModal from './CommonModal';
import { PermissionType } from 'types/models/permission';

type Props = {
    type: PermissionType;
    closeModal: () => void;
    handlePressOpenSetting: () => void;
};

const PermissionOpenSettingModal = (props: Props) => {
    const { colors } = useCustomTheme();

    const { type, closeModal, handlePressOpenSetting } = props;

    const { title, message } = REQUEST_PERMISSION_CONTENT[type];

    const COMMON_MSG = '설정에서 직접 허용 해주세요.';
    const modalMsg = `${message}\n${COMMON_MSG}`;

    return (
        <CommonModal
            title={title}
            titleIcon={<VectorIcon name="alert" color={colors.caution} />}
            text={modalMsg}
            closeModal={closeModal}
            buttons={[
                {
                    content: '설정 바로가기',
                    onPress: handlePressOpenSetting,
                },
                { content: '취소하기', type: 'cancel', onPress: closeModal },
            ]}
        />
    );
};

const REQUEST_PERMISSION_CONTENT: Record<PermissionType, { title: string; message: string }> = {
    camera: {
        title: '카메라 접근 권한 필요',
        message: '카메라에 대한 접근 권한이 없습니다.',
    },
    photoLibrary: {
        title: '사진 앨범 접근 권한 필요',
        message: '사진 앨범에 대한 접근 권한이 없습니다.',
    },
    notification: {
        title: '알림 권한 필요',
        message: '알림 전송에 대한 권한이 없습니다.',
    },
};

export default PermissionOpenSettingModal;
