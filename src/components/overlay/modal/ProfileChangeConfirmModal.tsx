import React from 'react';

import CommonModal from 'components/overlay/modal/CommonModal';

interface Props {
    isUsernameChanged: boolean;
    isProfileImgChanged: boolean;
    closeEditProfileModal: () => void;
    handleEditProfile: () => void;
}

const ProfileChangeConfirmModal = (props: Props) => {
    const { isUsernameChanged, isProfileImgChanged, closeEditProfileModal, handleEditProfile } =
        props;

    let changed = '';

    if (isUsernameChanged) changed = '닉네임을';
    if (isProfileImgChanged) changed = '프로필 이미지를';
    if (isUsernameChanged && isProfileImgChanged) changed = '닉네임과 프로필 이미지를';

    const content = `${changed}\n수정하시겠어요?`;

    return (
        <CommonModal
            title={'프로필 수정'}
            text={content}
            closeModal={closeEditProfileModal}
            buttons={[
                {
                    content: '네',
                    onPress: handleEditProfile,
                },
                {
                    content: '아니요',
                    onPress: closeEditProfileModal,
                    type: 'cancel',
                },
            ]}
        />
    );
};

export default ProfileChangeConfirmModal;
