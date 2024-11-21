import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Platform, StyleSheet } from 'react-native';

import SafeAreaView from 'components/common/SafeAreaView';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CommonListItem from 'components/common/CommonListItem';
import ScreenLayout from 'components/common/ScreenLayout';
import HorizontalDivider from 'components/common/HorizontalDivider';
import ReminderSummaryView from 'components/setting/reminder/ReminderSummaryView';
import ReminderSettingBottomSheet from 'components/overlay/bottomSheet/ReminderSettingBottomSheet';
import CustomText from 'components/common/CustomText';
import CustomSwitch from 'components/common/CustomSwitch';
import ReminderPermissionCautionView from 'components/setting/reminder/ReminderPermissionCautionView';

import { ReminderScreenNavigationProps } from 'types/navigations/settingStack';

import { useNavigation } from '@react-navigation/native';
import { openSettings } from 'react-native-permissions';

import useOverlay from 'hooks/useOverlay';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';
import usePermissions from 'hooks/usePermissions';
import useAppState from 'hooks/useAppState';

import { createOrUpdateReminder } from 'services/reminders';
import { getUserReminderDataOrCreateNew } from 'logics/reminders';
import { requestFcmToken } from 'utils/notification';

import { handleUpdateUserFcmToken } from 'logics/users';

import { commonStyles } from 'styles';

import { useRecoilValue } from 'recoil';
import { userDataAtom } from 'states/user';

const ReminderScreen = () => {
    const navigation = useNavigation<ReminderScreenNavigationProps>();
    const { setLoading } = useLoading();
    const { openToast } = useToast();
    const { checkPermission, requestPermission } = usePermissions();
    const { appState } = useAppState();

    const userData = useRecoilValue(userDataAtom);

    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

    const [active, setActive] = useState<boolean>(false);
    const [time, setTime] = useState<Date>(new Date(1970, 0, 1, 18, 0));
    const [week, setWeek] = useState<boolean[]>([true, true, true, true, true, true, true]);

    const reminderIdRef = useRef<string>('');

    const { openOverlay: openSettingBottomSheet, closeOverlay: closeSettingBottomSheet } =
        useOverlay(
            () => (
                <ReminderSettingBottomSheet
                    closeBottomSheet={closeSettingBottomSheet}
                    initialTime={time}
                    initialWeek={week}
                    onConfirm={handleConfirm}
                />
            ),
            'rs-reminderSettingBottomSheet'
        );

    useLayoutEffect(() => {
        if (!userData) return;
        // 리마인더 데이터 체크
        const checkReminderData = async () => {
            setLoading(true);
            try {
                const reminderData = await getUserReminderDataOrCreateNew(userData.id);

                setActive(reminderData.active);
                setTime(new Date(reminderData.time + 'Z')); // UTC 기준 시간으로 변경
                setWeek(reminderData.week);

                reminderIdRef.current = reminderData.id;
                // upsert 위해서 primary key 저장
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        checkReminderData();
    }, [setLoading, userData]);

    useEffect(() => {
        if (!userData) return;

        // 권한 체크 및 fcm 토큰 요청
        const checkPerm = async () => {
            const perm = await checkPermission('notification');
            const PERMISSION_GRANTED = perm === 'granted';

            setPermissionGranted(PERMISSION_GRANTED);

            if (PERMISSION_GRANTED) {
                const fcmToken = await requestFcmToken();
                console.log('fcmToken', fcmToken);

                if (fcmToken) {
                    await handleUpdateUserFcmToken(
                        userData.id,
                        fcmToken,
                        Platform.OS as 'ios' | 'android'
                    );
                }
            }
        };

        // 앱 상태가 active일 때만 권한 체크 및 fcm 토큰 요청
        // 백그라운드로 이동하여 앱 권한 재설정하는 경우 처리
        if (appState === 'active') {
            checkPerm();
        }
    }, [appState, checkPermission, userData]);

    // event handler
    const onPressShourcut = async () => {
        openSettings();
    };

    const toggleActive = async () => {
        try {
            // 권한이 없으나, 활성화 시 권한 요청
            if (!permissionGranted && !active) {
                const requestRes = await requestPermission('notification');
                if (requestRes !== 'granted') {
                    return;
                }
            }

            // 리마인더 활성화 요청시작
            setLoading(true);

            const res = await createOrUpdateReminder({
                id: reminderIdRef.current,
                active: !active,
            });
            setActive(res.active);

            const newActiveState = res.active ? '활성화' : '비활성화'; //변경 후 상태

            openToast({ text: `리마인더가 ${newActiveState} 되었어요!`, type: 'complete' });
        } catch (error) {
            console.log(error);
            openToast({ text: '오류가 발생했습니다.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (data: { time: Date; week: boolean[] }) => {
        const IS_NOT_SET_WEEK = data.week.every(e => e === false);

        if (IS_NOT_SET_WEEK) {
            openToast({ text: '요일을 1개 이상 선택해주세요', type: 'caution' });
            return;
        }

        setLoading(true);
        try {
            const res = await createOrUpdateReminder({
                id: reminderIdRef.current,
                time: data.time.toISOString(),
                week: data.week,
            });

            setTime(new Date(res.time + 'Z'));
            setWeek(res.week);
            // 전달받은 데이터 서버로 전달
            // 정상적으로 변경 완료된 경우에 상태 변경
            closeSettingBottomSheet();
            openToast({ text: '리마인더 설정이 변경되었어요!', type: 'complete' });
        } catch (error) {
            console.log(error);
            openToast({ text: '오류가 발생했습니다.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView>
            <InnerNavigationBar screenTitle="감사 리마인더 설정" goBack={navigation.goBack} />
            <ScreenLayout style={styles.container}>
                {!permissionGranted && (
                    <ReminderPermissionCautionView onPressShortcut={onPressShourcut} />
                )}

                <CustomText style={commonStyles.subject}>{'리마인더 설정 미리보기'}</CustomText>
                <ReminderSummaryView time={time} week={week} />

                <CommonListItem
                    title="리마인더 활성화"
                    subTitle="활성화 시 설정에 따라 알림을 드려요."
                    disabled
                    rightComponent={
                        <CustomSwitch active={active} onChange={toggleActive} triggerHaptic />
                    }
                />

                <HorizontalDivider type="block" />

                <CommonListItem
                    title="리마인더 설정"
                    subTitle="리마인더의 시간과 요일을 설정합니다."
                    onPress={openSettingBottomSheet}
                    chevron
                />
            </ScreenLayout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
    },
});

export default ReminderScreen;
