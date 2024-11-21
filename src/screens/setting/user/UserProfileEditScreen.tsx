import React, { useCallback, useMemo, useState } from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomButton from 'components/common/CustomButton';
import ProfilePicture from 'components/common/ProfilePicture';
import CustomTextInput from 'components/common/CustomTextInput';
import VectorIcon from 'components/common/VectorIcon';
import CustomText from 'components/common/CustomText';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import OptOutDialogModal from 'components/overlay/modal/OptOutDialogModal';
import OptOutCautionView from './OptOutCautionView';
import ChangeProfilePictureBottomSheet from 'components/overlay/bottomSheet/ChangeProfilePictureBottomSheet';
import HorizontalDivider from 'components/common/HorizontalDivider';

import { UserProfileEditScreenNavigationProps } from 'types/navigations/settingStack';
import { UserDataType } from 'types/models/user';
import { Asset } from 'react-native-image-picker';

import { useNavigation } from '@react-navigation/native';
import useInput from 'hooks/useInput';
import useOverlay from 'hooks/useOverlay';
import useToast from 'hooks/useToast';
import useLoading from 'hooks/useLoading';
import useAuth from 'hooks/useAuth';
import useKeyboard from 'hooks/useKeyboard';
import useCustomTheme from 'hooks/useCustomTheme';

import { handleUpdateUserProfile } from 'logics/users';
import { sliceStringByBytesSize, getStringBytesSize } from 'utils/string';

import { useRecoilState } from 'recoil';
import { userDataAtom } from 'states/user';

import { HORIZONTAL_GAP } from 'constants/style';
import ProfileChangeConfirmModal from 'components/overlay/modal/ProfileChangeConfirmModal';

const UserProfileEditScreen = () => {
    const navigation = useNavigation<UserProfileEditScreenNavigationProps>();

    const { optOut } = useAuth();
    const { openToast } = useToast();
    const { dismiss: keyboardDismiss } = useKeyboard();
    const { setLoading } = useLoading();
    const { colors } = useCustomTheme();

    const [userData, setUserData] = useRecoilState(userDataAtom);

    const {
        value: username,
        handleChange: setUsername,
        clearValue: clearUsername,
    } = useInput(userData?.username || '');

    const [profileImg, setProfileImg] = useState<string | null>(userData?.profile_img || null);

    const isProfileImgChanged = userData?.profile_img !== profileImg;
    const isUsernameChanged = userData?.username !== username;

    const isSetProfileImage = profileImg !== null;
    const userEmail = userData?.email || '';
    const isEmailUser = userData?.oauth_provider === 'email';

    const MAX_USERNAME_BYTES = 20;

    const isProfileEdited = useMemo(() => {
        if (isProfileImgChanged) return true;
        if (isUsernameChanged) return true;

        return false;
    }, [isProfileImgChanged, isUsernameChanged]);

    // overlays
    const {
        openOverlay: openChangeProfilePictureBottomSheet,
        closeOverlay: closeChangeProfilePictureBottomSheet,
    } = useOverlay(
        () => (
            <ChangeProfilePictureBottomSheet
                closeBottomSheet={closeChangeProfilePictureBottomSheet}
                onChangeImages={handleChangeProfile}
                onDeleteProfile={handleDeleteProfile}
                showResetProfileButton={isSetProfileImage}
            />
        ),
        'upes-changeProfilePictureBottomSheet'
    );

    const { openOverlay: openEditProfileConfirmModal, closeOverlay: closeEditProfileConfirmModal } =
        useOverlay(
            () => (
                <ProfileChangeConfirmModal
                    isUsernameChanged={isUsernameChanged}
                    isProfileImgChanged={isProfileImgChanged}
                    closeEditProfileModal={closeEditProfileConfirmModal}
                    handleEditProfile={handleEditProfile}
                />
            ),
            'upes-editProfileConfirmModal'
        );

    const { openOverlay: openOptOutModal, closeOverlay: closeOptOutModal } = useOverlay(
        () => <OptOutDialogModal closeOverlay={closeOptOutModal} onConfirm={onConfirmOptOut} />,
        'upes-optOutModal'
    );

    const onPressEditProfilePic = () => {
        keyboardDismiss();
        openChangeProfilePictureBottomSheet();
    };

    const handleChangeProfile = (assets: Asset[]) => {
        const { uri } = assets[0];

        setProfileImg(uri!);
        closeChangeProfilePictureBottomSheet();
    };

    const handleDeleteProfile = () => {
        setProfileImg(null);
        closeChangeProfilePictureBottomSheet();
    };

    const onChangeUsername = (text: string) => {
        setUsername(sliceStringByBytesSize(text, MAX_USERNAME_BYTES));
    };

    const onPressEditProfile = () => {
        keyboardDismiss();
        openEditProfileConfirmModal();
    };

    const onPressEditPassword = () => {
        keyboardDismiss();

        navigation.navigate('ChangePasswordScreen', {
            isDeepLink: false,
            email: userEmail,
        });
    };

    const handleEditProfile = async () => {
        if (!userData) return;

        try {
            setLoading(true);

            let changed: Partial<UserDataType> = {};

            if (username !== userData.username) {
                changed.username = username;
            }
            if (profileImg !== userData.profile_img) {
                changed.profile_img = profileImg;
            }

            const updatedUserData = await handleUpdateUserProfile(userData.id, userData, changed);

            setUserData(updatedUserData);

            closeEditProfileConfirmModal();

            openToast({ text: '프로필 변경이 완료되었습니다!', type: 'complete' });
            navigation.goBack();
        } catch (error: any) {
            openToast({ text: '오류가 발생했습니다.', type: 'error' });
            console.log('profile edit error : ', error.message);
        } finally {
            setLoading(false);
        }
    };

    const onPressOptOut = () => {
        keyboardDismiss();
        openOptOutModal();
    };

    const onConfirmOptOut = useCallback(async () => {
        try {
            setLoading(true);
            await optOut();

            closeOptOutModal();
            openToast({ text: '회원탈퇴가 완료되었습니다.', type: 'complete' });
        } catch (error: any) {
            openToast({ text: '오류가 발생했습니다.', type: 'error' });
            console.log('opt out error : ', error.message);
        } finally {
            setLoading(false);
        }
    }, [closeOptOutModal, openToast, optOut, setLoading]);

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding={false}>
            <InnerNavigationBar screenTitle={'프로필 수정'} goBack={navigation.goBack} />

            <View style={styles.container}>
                <View style={styles.editContainer}>
                    <View style={styles.profileContainer}>
                        <ProfilePicture style={styles.profile} uri={profileImg} />

                        <TouchableOpacity
                            style={styles.profileEditButtonContainer}
                            onPress={onPressEditProfilePic}
                        >
                            <CustomText style={[{ color: colors.subtitle }]}>
                                {'이미지 변경'}
                            </CustomText>
                            <VectorIcon name={'image-multiple'} size={13} color={colors.subtitle} />
                        </TouchableOpacity>
                    </View>

                    <CustomTextInput
                        value={username}
                        onChangeText={onChangeUsername}
                        clearButton
                        onPressClear={clearUsername}
                        title={`닉네임 (${getStringBytesSize(
                            username
                        )}/${MAX_USERNAME_BYTES} byte)`}
                        placeholder={username}
                    />
                </View>

                <CustomButton
                    title={'수정하기'}
                    disabled={!isProfileEdited || username === ''}
                    onPress={onPressEditProfile}
                    triggerHaptic
                />
                {isEmailUser && (
                    <CustomButton
                        style={styles.passwordChangeButton}
                        title={'비밀번호 변경'}
                        onPress={onPressEditPassword}
                        iconComponent={<VectorIcon name={'lock'} size={13} />}
                        triggerHaptic
                    />
                )}
                <HorizontalDivider type="block" style={styles.divider} />

                <OptOutCautionView onPressOptOut={onPressOptOut} />
            </View>
        </KeyboardDismissSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: HORIZONTAL_GAP,
        paddingTop: 20,
    },
    editContainer: {
        marginBottom: 20,
    },
    profileContainer: {
        alignItems: 'center',
    },
    profile: {
        marginBottom: 7,
    },
    profileEditButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 3,
    },
    passwordChangeButton: {
        marginTop: 15,
    },
    divider: {
        marginVertical: 25,
    },
});

export default UserProfileEditScreen;
