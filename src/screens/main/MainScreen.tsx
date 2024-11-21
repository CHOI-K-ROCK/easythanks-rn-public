import React, { useCallback, useEffect, useState } from 'react';

import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import MainNavigationBar from 'components/main/MainNavigationBar';
import VectorIcon from 'components/common/VectorIcon';
import ScreenLayout from 'components/common/ScreenLayout';
import MainMonthlySummaryView from 'components/main/MainMonthlySummaryView';
import MainSummaryButton from 'components/main/MainSummaryButton';

import { MainStackNavigationProps } from 'types/navigations/mainStack';
import { PostSummaryDataType } from 'types/models/post';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useCustomTheme from 'hooks/useCustomTheme';
import useToast from 'hooks/useToast';

import { checkPostSummaryDataWithTimezone, subscribeMainScreen } from 'services/posts';
import { supabase } from 'services/supabase';
import moment from 'moment-timezone';

import { useRecoilValue } from 'recoil';
import { userDataAtom } from 'states/user';

import MainComposeFloatButton from 'components/main/MainComposeFloatButton';
import { getLookUpPostsScreenParams } from 'utils/data';

const MainScreen = () => {
    const { colors } = useCustomTheme();
    const { openToast } = useToast();

    const navigation = useNavigation<MainStackNavigationProps>();

    const userData = useRecoilValue(userDataAtom);

    const [refresh, setRefresh] = useState<boolean>(false); // 새로고침 상태 (onRefresh)
    const [postSummaryData, setPostSummaryData] = useState<PostSummaryDataType>({
        today_count: 0,
        monthly_count: 0,
        month_overview: {},
    });

    const isOpenProfileInitializeScreen = userData && !userData.profile_setted;
    const isNotWrittenToday = postSummaryData.today_count === 0;

    useFocusEffect(() => {
        // 프로필 설정 여부에 의해 프로필 초기화 화면 이동
        console.log('check profile setted', userData?.profile_setted);

        if (isOpenProfileInitializeScreen) {
            navigation.navigate('SettingStack', {
                screen: 'UserProfileInitializeScreen',
            });
        }
    });

    const getPostSummaryData = useCallback(async () => {
        if (!userData) return;

        try {
            const res = await checkPostSummaryDataWithTimezone(
                userData!.id, // 유저 id
                new Date().getFullYear(), // 현재 년도
                new Date().getMonth() + 1, // 현재 월
                moment.tz.guess() // 유저의 타임존 정보
            );

            const { today_count, monthly_count, month_overview } = res;

            setPostSummaryData({
                today_count,
                monthly_count,
                month_overview,
            });
        } catch (error) {
            console.log(error);
            openToast({
                text: '월 요약 데이터를 가져올 수 없어요.',
                type: 'error',
            });
        }
    }, [openToast, userData]);

    useEffect(() => {
        (async () => {
            await getPostSummaryData();
        })();
    }, [getPostSummaryData]);

    useEffect(() => {
        // DB 구독
        // 글이 변경되는 경우 메인 스크린 요약 데이터 업데이트
        if (!userData) return;

        const sub = subscribeMainScreen(userData.id, async () => {
            try {
                await getPostSummaryData();
            } catch (error) {
                console.log(error);
            }
        });

        return () => {
            supabase.removeChannel(sub);
            console.log('unsubscribed');
        };
    }, [getPostSummaryData, userData]);

    const onRefresh = useCallback(async () => {
        try {
            setRefresh(true);

            await getPostSummaryData();

            setRefresh(false);
        } catch (error) {
            console.log(error);
        }
    }, [getPostSummaryData]);

    // navigation
    const toAppMenu = useCallback(() => {
        navigation.navigate('SettingStack', {
            screen: 'SettingScreen',
        });
    }, [navigation]);

    const openComposeScreen = useCallback(() => {
        navigation.navigate('BottomSheetComposeStack', {
            screen: 'ComposeScreen',
            params: { initialData: undefined },
        });
    }, [navigation]);

    const toTodayPostsScreen = useCallback(() => {
        navigation.navigate('PostStack', {
            screen: 'LookUpPostScreen',
            params: getLookUpPostsScreenParams('today'),
        });
    }, [navigation]);

    const toCurrentMonthlyPostsScreen = useCallback(() => {
        navigation.navigate('PostStack', {
            screen: 'LookUpPostScreen',
            params: getLookUpPostsScreenParams('currentMonthly'),
        });
    }, [navigation]);

    const toMonthlyPostsScreen = useCallback(() => {
        navigation.navigate('PostStack', {
            screen: 'LookUpPostScreen',
            params: getLookUpPostsScreenParams('monthly'),
        });
    }, [navigation]);

    return (
        <SafeAreaView
            style={{ backgroundColor: colors.mainBackground }}
            topAreaBackgroundColor={colors.mainBackground}
            bottomAreaBackgroundColor={colors.mainBackground}
        >
            <MainNavigationBar
                leftComponent={
                    <VectorIcon onPress={toAppMenu} name="cog" size={25} color={colors.text} />
                }
            />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
            >
                <ScreenLayout>
                    <View style={styles.headerContainer}>
                        <MainMonthlySummaryView data={postSummaryData.month_overview} />
                    </View>
                    <View style={styles.summaryButtonContainer}>
                        {/* 오늘 작성 요약 */}
                        <MainSummaryButton
                            amount={postSummaryData.today_count}
                            title={
                                isNotWrittenToday
                                    ? '오늘의 일기를\n아직 쓰지 않으셨네요!'
                                    : `오늘의 감사일기`
                            }
                            linkText={isNotWrittenToday ? '지금 작성하러 가기' : '바로가기'}
                            onPress={isNotWrittenToday ? openComposeScreen : toTodayPostsScreen}
                            hideIndicator={isNotWrittenToday}
                            style={styles.summaryButton}
                        />

                        {/* 이번달 요약 */}
                        <MainSummaryButton
                            amount={postSummaryData.monthly_count}
                            title={`${new Date().getMonth() + 1}월 모아보기`}
                            onPress={toCurrentMonthlyPostsScreen}
                            style={styles.summaryButton}
                        />
                    </View>

                    {/* 월별 조회 바로가기 */}
                    <MainSummaryButton
                        style={styles.monthlyPostButton}
                        title={`월별 감사일기 조회하기`}
                        hideIndicator
                        onPress={toMonthlyPostsScreen}
                    />
                </ScreenLayout>
            </ScrollView>

            {/* 글 작성 버튼 */}
            <MainComposeFloatButton onPress={openComposeScreen} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 20,
        marginBottom: 15,
    },
    summaryButtonContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    summaryButton: {
        flex: 1,
        aspectRatio: 4 / 3,
    },
    monthlyPostButton: {
        aspectRatio: 4 / 1.5,
    },
});

export default MainScreen;
