import React from 'react';

import { useRecoilValue } from 'recoil';
import { userDataAtom } from 'states/user';

import { ScrollView, StyleSheet, View } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import UserProfileView from 'components/setting/UserProfileView';
import CommonListItem from 'components/common/CommonListItem';
import SettingFooter from 'components/setting/SettingFooter';
import HorizontalDivider from 'components/common/HorizontalDivider';
import CommonModal from 'components/overlay/modal/CommonModal';
import FastImage from 'react-native-fast-image';

import { SettingScreenNavigationProps } from 'types/navigations/settingStack';

import { useNavigation } from '@react-navigation/native';
import useCustomTheme from 'hooks/useCustomTheme';
import useAuth from 'hooks/useAuth';
import useOverlay from 'hooks/useOverlay';
import useToast from 'hooks/useToast';
import useLoading from 'hooks/useLoading';

import { openUrl } from 'utils/linking';

import { HORIZONTAL_GAP } from 'constants/style';

import { APP_NOTICE_URL, APP_POLICY_URL, PRIVATE_POLICY_URL } from 'constants/links';

export type SettingListType = {
    title: string;
    subtitle: string;
    onPress: () => void;
};

export type dividerType = {
    divider: boolean;
};

export type SettingDataType = SettingListType | dividerType;

const SettingScreen = () => {
    const navigation = useNavigation<SettingScreenNavigationProps>();
    const { colors } = useCustomTheme();
    const { logout } = useAuth();
    const { setLoading } = useLoading();
    const { openToast } = useToast();

    const userData = useRecoilValue(userDataAtom);

    const { openOverlay: openLogoutModal, closeOverlay: closeLogoutModal } = useOverlay(
        () => (
            <CommonModal
                title="로그아웃"
                text="로그아웃 하시겠어요?"
                closeModal={closeLogoutModal}
                buttons={[
                    { content: '네', type: 'cancel', onPress: handleLogout },
                    { content: '아니요', onPress: closeLogoutModal },
                ]}
            />
        ),
        'ss-logoutModal'
    );

    const { openOverlay: openClearImageCacheModal, closeOverlay: closeClearImageCacheModal } =
        useOverlay(
            () => (
                <CommonModal
                    title="이미지 캐시 삭제"
                    text={'이미지 캐시를 삭제 하시겠어요?\n이미지 로딩이 길어질 수 있습니다.'}
                    closeModal={closeClearImageCacheModal}
                    buttons={[
                        { content: '네', type: 'cancel', onPress: handleClearImageCache },
                        { content: '아니요', onPress: closeClearImageCacheModal },
                    ]}
                />
            ),
            'ss-clearImageCacheModal'
        );

    const openNoticePage = () => {
        openUrl(APP_NOTICE_URL);
    };

    const handleLogout = async () => {
        try {
            setLoading(true);

            closeLogoutModal();
            await logout();

            openToast({ text: '로그아웃 완료', type: 'complete' });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearImageCache = async () => {
        try {
            await FastImage.clearDiskCache();
            await FastImage.clearMemoryCache();

            closeClearImageCacheModal();
            openToast({ text: '삭제 되었습니다.', type: 'complete' });
        } catch (error) {
            console.log('handleClearImageCache error : ', error);
        }
    };

    return (
        <SafeAreaView>
            <InnerNavigationBar screenTitle={'설정'} goBack={navigation.goBack} />

            <ScrollView showsVerticalScrollIndicator={false} style={[styles.container]}>
                <View style={styles.section}>
                    {userData && (
                        <UserProfileView
                            userData={userData}
                            onPressEdit={() => navigation.navigate('UserProfileEditScreen')}
                            style={styles.header}
                        />
                    )}

                    <HorizontalDivider type={'block'} />

                    <CommonListItem
                        title={'공지사항 확인'}
                        subTitle={'앱 공지사항을 확인할 수 있어요!'}
                        onPress={openNoticePage}
                        chevron
                    />

                    <HorizontalDivider type={'block'} />

                    <CommonListItem
                        title={'감사 리마인더 설정'}
                        subTitle={'설정한 시간에 감사일기를 쓸 수 있도록 알림을 드려요!'}
                        onPress={() => navigation.navigate('ReminderScreen')}
                        chevron
                    />
                    <CommonListItem
                        title={'앱 테마 설정'}
                        subTitle={'앱의 기본 테마(다크/라이트)를 설정합니다.'}
                        onPress={() => navigation.navigate('AppThemeSettingScreen')}
                        chevron
                    />
                    <CommonListItem
                        title={'앱 이미지 캐시 삭제'}
                        subTitle={'앱에 저장된 이미지 캐시를 삭제합니다.'}
                        onPress={openClearImageCacheModal}
                        chevron
                    />

                    <HorizontalDivider type={'block'} />

                    <CommonListItem
                        title={'로그아웃'}
                        subTitle={'앱에서 로그아웃 합니다.'}
                        onPress={openLogoutModal}
                    />

                    <HorizontalDivider type={'block'} />

                    <SettingFooter
                        onPressOpenSource={() => navigation.navigate('OpenSourceScreen')}
                        onPressPrivacyPolicy={() => openUrl(PRIVATE_POLICY_URL)}
                        onPressTermsOfService={() => openUrl(APP_POLICY_URL)}
                        style={styles.footer}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {},
    section: {
        paddingHorizontal: HORIZONTAL_GAP,
    },
    header: {
        marginVertical: 20,
    },
    footer: {
        marginTop: 15,
    },
});

export default SettingScreen;
