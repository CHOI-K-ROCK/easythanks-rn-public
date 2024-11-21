import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomText from 'components/common/CustomText';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomTextInput from 'components/common/CustomTextInput';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import ScreenLayout from 'components/common/ScreenLayout';
import ProfilePicture from 'components/common/ProfilePicture';
import VectorIcon from 'components/common/VectorIcon';
import ChangeProfilePictureBottomSheet from 'components/overlay/bottomSheet/ChangeProfilePictureBottomSheet';
import CustomButton from 'components/common/CustomButton';

import { UserProfileInitializeScreenNavigationProps } from 'types/navigations/settingStack';

import useCustomTheme from 'hooks/useCustomTheme';
import useInput from 'hooks/useInput';
import useKeyboard from 'hooks/useKeyboard';
import useOverlay from 'hooks/useOverlay';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';

import { handleUpadateUserProfileSettedToTrue, handleUpdateUserProfile } from 'logics/users';

import { getStringBytesSize, sliceStringByBytesSize } from 'utils/string';
import { Asset } from 'react-native-image-picker';
import { useRecoilState } from 'recoil';
import { userDataAtom } from 'states/user';

const UserProfileInitializeScreen = () => {
    const navigation = useNavigation<UserProfileInitializeScreenNavigationProps>();

    const { colors } = useCustomTheme();
    const { openToast } = useToast();
    const { dismiss: keyboardDismiss } = useKeyboard();
    const { setLoading } = useLoading();

    const [userData, setUserData] = useRecoilState(userDataAtom);

    const [profileImg, setProfileImg] = useState<string | null>(userData!.profile_img);
    const { value: username, handleChange: setUsername } = useInput(userData!.username);

    const buttonDisabled = !username;

    const MAX_USERNAME_BYTES = 20;

    useEffect(() => {
        if (Platform.OS === 'android') {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });

            return () => backHandler.remove();
        }
    }, []);

    // overlays
    const { openOverlay: openPhotoBottomSheet, closeOverlay: closePhotoBottomSheet } = useOverlay(
        () => (
            <ChangeProfilePictureBottomSheet
                closeBottomSheet={closePhotoBottomSheet}
                onChangeImages={onChangeProfile}
                onDeleteProfile={onDeleteProfile}
                showResetProfileButton={profileImg !== null}
            />
        ),
        'upis-changeProfilePictureBottomSheet'
    );

    useEffect(() => {
        // 유저데이터 변경으로 인한 재실행 방지
        if (!userData || userData.profile_setted) return;

        // 프로필 설정 여부 업데이트
        handleUpadateUserProfileSettedToTrue(userData.id); // 서버
        setUserData(prev => ({ ...prev!, profile_setted: true })); //전역 상태
    }, [userData, setUserData]);

    // handler
    const onChangeProfile = (assets: Asset[]) => {
        const { uri } = assets[0];
        setProfileImg(uri!);
        closePhotoBottomSheet();
    };

    const onDeleteProfile = () => {
        setProfileImg(null);
        closePhotoBottomSheet();
    };

    const onPressEditProfilePic = () => {
        keyboardDismiss();
        openPhotoBottomSheet();
    };

    const onChangeUsername = (text: string) => {
        setUsername(sliceStringByBytesSize(text, MAX_USERNAME_BYTES));
    };

    const onConfirm = async () => {
        keyboardDismiss();

        if (!userData) return;

        try {
            setLoading(true);

            const changedUserData = await handleUpdateUserProfile(userData.id, userData, {
                profile_img: profileImg!,
                username,
            });

            setUserData(changedUserData);

            navigation.goBack();
        } catch (error) {
            openToast({ text: '오류가 발생했습니다.', type: 'error' });
            console.log('update initial user profile error :', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding>
            <InnerNavigationBar screenTitle="프로필 설정" />
            <ScreenLayout style={styles.container}>
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
                <View style={styles.inputContainer}>
                    <CustomTextInput
                        value={username}
                        onChangeText={onChangeUsername}
                        title={`닉네임 (${getStringBytesSize(
                            username
                        )}/${MAX_USERNAME_BYTES} byte)`}
                        placeholder={username}
                    />
                </View>
                <CustomButton title="확인" onPress={onConfirm} disabled={buttonDisabled} />
                <CustomText
                    style={[{ color: colors.subtitle }, styles.link]}
                    onPress={navigation.goBack}
                >
                    {'수정하지 않을게요!'}
                </CustomText>
            </ScreenLayout>
        </KeyboardDismissSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
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
    inputContainer: {
        marginBottom: 30,
        gap: 15,
    },
    link: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 500,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default UserProfileInitializeScreen;
