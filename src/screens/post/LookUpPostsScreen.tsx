import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FlatList, StyleSheet, View } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';

import CustomText from 'components/common/CustomText';
import ScreenLayout from 'components/common/ScreenLayout';
import PostThumbnail from 'components/common/PostThumbnail';
import YearMonthSelectorBottomSheet from 'components/overlay/bottomSheet/YearMonthSelectorBottomSheet';
import PostReachEndMessageView from 'components/posts/PostReachEndMessageView';
import PostChangeLookUpDateButton from 'components/posts/PostChangeLookUpDateButton';
import InnerNavigationBar from 'components/common/InnerNavigationBar';

import { PostDataType } from 'types/models/post';

import { useNavigation, useRoute } from '@react-navigation/native';
import useOverlay from 'hooks/useOverlay';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';

import { handleHapticSimply } from 'utils/haptic';

import { supabase } from 'services/supabase';
import { lookupPost, subscribeLookUpPost } from 'services/posts';

import { useRecoilValue } from 'recoil';
import { userDataAtom } from 'states/user';

import { commonStyles } from 'styles';
import {
    LookUpPostScreenNavigationProps,
    LookUpPostScreenRouteProps,
} from 'types/navigations/postStack';
import { isDateInRange } from 'utils/date';
import moment from 'moment-timezone';
import { HORIZONTAL_GAP } from 'constants/style';
import useCustomTheme from 'hooks/useCustomTheme';

const LookUpPostScreen = () => {
    const { colors } = useCustomTheme();
    const { setLoading } = useLoading();
    const { openToast } = useToast();

    const navigation = useNavigation<LookUpPostScreenNavigationProps>();
    const route = useRoute<LookUpPostScreenRouteProps>();
    const {
        title,
        monthChangeable = false,

        beginDate: initialBeginDate,
        endDate: initialEndDate,

        ascending: _ascending = true,
        usePagination: _usePagination = true,
        pagePerLoad: _pagePerLoad = 10,
        goBackOnPostEmpty = false,
    } = route.params;

    const userData = useRecoilValue(userDataAtom); // 메인에서 받아오기

    const [isInit, setIsInit] = useState<boolean>(false); // 초기 로딩 여부
    const [postData, setPostData] = useState<PostDataType[]>([]);

    // 조회기간
    const beginDateRef = useRef<Date>(new Date(initialBeginDate));
    const endDateRef = useRef<Date>(new Date(initialEndDate));

    const curPageRef = useRef<number>(0); // 현재 페이지
    const maxPostLengthRef = useRef<number>(0); // 불러오는 일기 데이터의 전체 행 수
    const flatListScrollRef = useRef<FlatList | null>(null);

    const CURRENT_POST_LENGTH = postData.length; // 불러온 일기 수
    const IS_LOAD_ALL_POSTS = CURRENT_POST_LENGTH >= maxPostLengthRef.current; // 전체 일기를 불러왔는지 여부

    const getPosts = useCallback(
        async (options: {
            beginDate: Date;
            endDate: Date;
            page: number;
            ascending: boolean;
            usePagination: boolean;
            pagePerLoad: number;
        }) => {
            const { beginDate, endDate, page, ascending, usePagination, pagePerLoad } = options;

            console.log(`page ${page} loaded`);
            try {
                const { data, count } = await lookupPost(
                    userData!.id,
                    beginDate,
                    endDate,
                    usePagination,
                    {
                        page,
                        perLoad: pagePerLoad,
                    },
                    ascending
                );

                return { data, count };
            } catch (error) {
                console.log(error);
                openToast({
                    text: '일기를 불러오지 못했습니다.',
                    type: 'error',
                });
            }
        },
        [openToast, userData]
    );

    // effects

    useEffect(() => {
        const loadInitialPosts = async () => {
            try {
                setLoading(true);
                const res = await getPosts({
                    beginDate: beginDateRef.current,
                    endDate: endDateRef.current,
                    page: 0,
                    ascending: _ascending,
                    usePagination: _usePagination,
                    pagePerLoad: _pagePerLoad,
                });

                if (!res) return;

                maxPostLengthRef.current = res.count;

                setPostData(res.data);
                setIsInit(true);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        // 초기 게시글 로딩
        loadInitialPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!userData) return;
        const sub = subscribeLookUpPost(userData.id, payload => {
            const { eventType } = payload;

            setPostData(prev => {
                const copied = [...prev];

                if (eventType === 'UPDATE') {
                    const NEW_POST = payload.new as PostDataType; // INSERT / UPDATE

                    const timeZone = moment.tz.guess();
                    const convertedDate = moment.utc(NEW_POST.date).tz(timeZone).toDate();
                    // post 데이터의 date -> utc
                    // 현재 타임존의 시간으로 변환하여 비교

                    const IS_NEW_POST_DATE_IN_RANGE = isDateInRange(
                        convertedDate,
                        beginDateRef.current,
                        endDateRef.current
                    );

                    const EDITTED_POST_INDEX = copied.findIndex(post => post.id === NEW_POST.id);

                    if (IS_NEW_POST_DATE_IN_RANGE) {
                        // 수정된 글이 기간 내에 있는 경우, 업데이트
                        copied[EDITTED_POST_INDEX] = NEW_POST;
                    }

                    if (!IS_NEW_POST_DATE_IN_RANGE) {
                        // 날짜가 수정되어 수정된 글이 기간 내에 없는 경우, 삭제

                        copied.splice(EDITTED_POST_INDEX, 1);
                        maxPostLengthRef.current = maxPostLengthRef.current - 1;
                    }
                }

                if (eventType === 'DELETE') {
                    // DELETE 가 발생한 경우, 삭제된 게시글의 date 를 조회할 수 없다.(payload.old)
                    // 현재 조회 중인 월과 같은지 비교할 수 없으므로, 매 실행마다 비교 후 처리함.

                    const OLD_POST = payload.old as PostDataType; // DELETE

                    const DELETED_POST_INDEX = copied.findIndex(post => post.id === OLD_POST.id);

                    copied.splice(DELETED_POST_INDEX, 1);
                    maxPostLengthRef.current = maxPostLengthRef.current - 1;
                }

                return copied;
            });
        });
        return () => {
            console.log('remove look up post sub');
            supabase.removeChannel(sub);
        };
    }, [setPostData, userData]);

    useEffect(() => {
        if (goBackOnPostEmpty && postData.length === 0 && isInit) {
            // 일기가 없는 경우, 메인화면으로 이동
            navigation.popToTop();
        }
    }, [isInit, postData.length, navigation, goBackOnPostEmpty]);

    // overlays

    const {
        openOverlay: openYearMonthSelectorBottomSheet,
        closeOverlay: closeYearMonthSelectorBottomSheet,
    } = useOverlay(
        () => (
            <YearMonthSelectorBottomSheet
                date={beginDateRef.current}
                closeBottomSheet={closeYearMonthSelectorBottomSheet}
                onConfirm={handleDateChange}
            />
        ),
        'lups-yearMonthSelectorBottomSheet'
    );

    // handler
    const handleDateChange = useCallback(
        async (data: { beginDate: Date; endDate: Date }) => {
            const { beginDate: newBeginDate, endDate: newEndDate } = data;

            const newYear = newBeginDate.getFullYear();
            const newMonth = newBeginDate.getMonth() + 1;

            beginDateRef.current = newBeginDate;
            endDateRef.current = newEndDate;

            try {
                setLoading(true);
                setIsInit(false);

                curPageRef.current = 0; // 현재 페이지 인덱스 초기화

                const res = await getPosts({
                    beginDate: beginDateRef.current,
                    endDate: endDateRef.current,
                    page: 0,
                    ascending: _ascending,
                    usePagination: _usePagination,
                    pagePerLoad: _pagePerLoad,
                });

                if (!res) return;

                maxPostLengthRef.current = res.count;
                flatListScrollRef.current?.scrollToOffset({ animated: false, offset: 0 }); // 스크롤 위치 초기화

                setLoading(false);
                setPostData(res.data);

                // 년월 선택 창 닫기
                closeYearMonthSelectorBottomSheet();

                setIsInit(true);

                openToast({
                    text: `${newYear}년 ${newMonth}월을 불러왔어요!`,
                    type: 'complete',
                });
            } catch (error) {
                console.log(error);
                openToast({ text: '오류가 발생했습니다.', type: 'error' });
            } finally {
                setLoading(false);
            }
        },
        [
            _ascending,
            _pagePerLoad,
            _usePagination,
            closeYearMonthSelectorBottomSheet,
            getPosts,
            openToast,
            setLoading,
        ]
    );

    // ui
    const renderReachEndView = () => {
        return (
            // 초기 로딩 상태를 비교하여, 렌더링 깜빡임 방지
            isInit &&
            IS_LOAD_ALL_POSTS && (
                <PostReachEndMessageView
                    lookUpDate={beginDateRef.current}
                    handleDate={handleDateChange}
                    isNothingToLoad={maxPostLengthRef.current <= 0 && CURRENT_POST_LENGTH <= 0}
                    hideChangeMonthButton={!monthChangeable}
                />
            )
        );
    };

    // flatlist

    const _renderItem = useCallback(
        ({ item }: { item: PostDataType }) => {
            return (
                <PostThumbnail
                    data={item}
                    style={styles.postThumbnail}
                    onPress={() => navigation.navigate('PostDetailScreen', { postId: item.id })}
                />
            );
        },
        [navigation]
    );

    const _keyExtractor = useCallback((item: PostDataType) => {
        return item.id;
    }, []);

    const _onEndReached = useCallback(async () => {
        if (IS_LOAD_ALL_POSTS || !isInit) {
            // isInit 상태를 사용함으로써, 날짜 변경 후 바로 _onEndReached 가 실행되는 것 방지
            // 첫 게시글을 불러오지 않으면(page = 0) 해당 이벤트 실행을 막음
            return;
        }

        try {
            setLoading(true);

            const res = await getPosts({
                beginDate: beginDateRef.current,
                endDate: endDateRef.current,
                page: curPageRef.current + 1,
                ascending: _ascending,
                usePagination: _usePagination,
                pagePerLoad: _pagePerLoad,
            });

            if (!res) return;

            curPageRef.current = curPageRef.current + 1;
            setPostData(prev => [...prev, ...res.data]);
        } catch (error) {
            console.log('onEndReached error :', error);
        } finally {
            setLoading(false);
            handleHapticSimply('light');
        }
    }, [IS_LOAD_ALL_POSTS, _ascending, _pagePerLoad, _usePagination, getPosts, isInit, setLoading]);

    return (
        <SafeAreaView>
            <InnerNavigationBar screenTitle={title} goBack={navigation.goBack} />

            <View style={styles.container}>
                {monthChangeable && (
                    <View style={styles.lookUpDateContainer}>
                        <CustomText style={[{ color: colors.subtitle }, commonStyles.subject]}>
                            조회 시기 선택
                        </CustomText>
                        <PostChangeLookUpDateButton
                            date={beginDateRef.current}
                            onPress={openYearMonthSelectorBottomSheet}
                        />
                    </View>
                )}
                <CustomText style={[{ color: colors.subtitle }, styles.lookUpPostTitle]}>
                    조회 결과
                </CustomText>

                <FlatList
                    key={beginDateRef.current.getDate()}
                    ref={flatListScrollRef}
                    data={postData}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    onEndReached={_onEndReached}
                    ListFooterComponent={renderReachEndView}
                    ListFooterComponentStyle={styles.listFooterComponent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.lookUpPostContainer}
                />
            </View>
        </SafeAreaView>
    );
};

// styles
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
    },
    lookUpDateContainer: {
        marginBottom: 15,
        paddingHorizontal: HORIZONTAL_GAP,
    },

    lookUpPostTitle: {
        marginHorizontal: HORIZONTAL_GAP,
        ...commonStyles.subject,
    },
    lookUpPostContainer: {
        paddingHorizontal: HORIZONTAL_GAP,
    },
    postThumbnail: { marginBottom: 15 },
    listFooterComponent: {
        marginBottom: 50,
    },
});

export default LookUpPostScreen;
