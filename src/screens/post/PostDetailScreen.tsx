import React, { useCallback, useEffect, useState } from 'react';

import { ScrollView, View } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import ImageCarousel from 'components/common/ImageCarousel';
import CustomText from 'components/common/CustomText';
import TextArea from 'components/common/TextArea';
import VectorIcon from 'components/common/VectorIcon';
import ComposeSummaryView from 'components/compose/ComposeSummaryView';
import HorizontalDivider from 'components/common/HorizontalDivider';
import BottomSheet from 'components/overlay/bottomSheet/BottomSheet';
import CommonModal from 'components/overlay/modal/CommonModal';
import BottomSheetMenuList from 'components/overlay/bottomSheet/BottomSheetMenuList';
import PostDetailSkeletonView from 'components/skeleton/PostDetailSkeletonView';

import {
    PostDetailScreenNavigationProps,
    PostDetailScreenRouteProps,
} from 'types/navigations/postStack';
import { PostDataType } from 'types/models/post';

import { useNavigation, useRoute } from '@react-navigation/native';
import useCustomTheme from 'hooks/useCustomTheme';
import useOverlay from 'hooks/useOverlay';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';

import { supabase } from 'services/supabase';
import { getPostById, subscribePost } from 'services/posts';
import { handleDeletePost } from 'logics/posts';

import { commonStyles } from 'styles';
import { HORIZONTAL_GAP } from 'constants/style';

const PostDetailScreen = () => {
    const { colors } = useCustomTheme();
    const { isLoading, setLoading } = useLoading();
    const { openToast } = useToast();

    const navigation = useNavigation<PostDetailScreenNavigationProps>();
    const {
        params: { postId },
    } = useRoute<PostDetailScreenRouteProps>();

    const [postData, setPostData] = useState<PostDataType | null>(null);

    const isLoadingPost = !postData || isLoading;

    const getPostData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getPostById(postId);
            setPostData(res);
        } catch (error) {
            console.log(error);
            openToast({ text: '오류가 발생했어요. 잠시 후 다시 시도해 주세요.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [openToast, postId, setLoading]);

    useEffect(() => {
        getPostData();

        const sub = subscribePost(postId, payload => {
            if (payload.eventType !== 'DELETE') {
                // 삭제된 경우에는 해당 id 의 글을 다시 불러오지 않음.
                getPostData();
            }
        });

        return () => {
            supabase.removeChannel(sub);
        };
    }, [getPostData, postId]);

    // overlays
    const { openOverlay: openMenu, closeOverlay: closeMenu } = useOverlay(
        () => (
            <BottomSheet closeBottomSheet={closeMenu}>
                <BottomSheetMenuList
                    data={[
                        {
                            title: '수정',
                            onPress: handlePressEdit,
                            iconName: 'pencil',
                        },
                        {
                            title: '삭제',
                            onPress: openPostDeleteModal,
                            iconName: 'delete',
                            color: colors.warning,
                        },
                    ]}
                />
            </BottomSheet>
        ),
        'pds-menuBottomSheet'
    );

    const { openOverlay: openPostDeleteModal, closeOverlay: closePostDeleteModal } = useOverlay(
        () => (
            <CommonModal
                title={'감사일기 삭제'}
                text={'삭제된 감사일기는 복구 할 수 없어요.\n정말로 삭제하시겠어요?'}
                closeModal={closePostDeleteModal}
                buttons={[
                    { content: '네', type: 'cancel', onPress: handlePressDeletePost },
                    { content: '아니요', onPress: closePostDeleteModal },
                ]}
            />
        ),
        'pds-postDeleteModal'
    );

    // handler
    const handlePressEdit = useCallback(() => {
        navigation.navigate('ComposeStack', {
            screen: 'ComposeScreen',
            params: { initialData: postData! },
        });
        closeMenu();
    }, [closeMenu, navigation, postData]);

    const handlePressDeletePost = useCallback(async () => {
        try {
            setLoading(true);
            closePostDeleteModal();

            await handleDeletePost(postId);

            closeMenu();
            navigation.goBack();
        } catch (error) {
            console.log(error);
            openToast({ text: '오류가 발생했어요. 잠시 후 다시 시도해 주세요.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [closeMenu, closePostDeleteModal, navigation, openToast, postId, setLoading]);

    return (
        <SafeAreaView>
            <InnerNavigationBar
                screenTitle={postData?.title || '불러오는 중...'}
                goBack={navigation.goBack}
                rightComponent={<VectorIcon name="dots-vertical" size={25} onPress={openMenu} />}
            />

            <ScrollView style={{ paddingHorizontal: HORIZONTAL_GAP, paddingTop: 20 }}>
                {isLoadingPost ? (
                    <PostDetailSkeletonView />
                ) : (
                    <View>
                        <ComposeSummaryView
                            // 서버에 저장된 timestamp 가 UTC 기준이므로 Z 를 뒤에 붙힌다.
                            date={new Date(postData.date + 'Z')}
                        />
                        <HorizontalDivider style={{ marginVertical: 15 }} />
                        <View style={{ gap: 10 }}>
                            {postData.photos.length > 0 && (
                                <View>
                                    <CustomText
                                        style={[{ color: colors.subtitle }, commonStyles.subject]}
                                    >{`사진`}</CustomText>
                                    <ImageCarousel
                                        images={postData.photos}
                                        style={{ borderRadius: 5 }}
                                    />
                                </View>
                            )}
                            <View>
                                <CustomText
                                    style={[{ color: colors.subtitle }, commonStyles.subject]}
                                >{`감사일기`}</CustomText>
                                <TextArea content={postData.content} />
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default PostDetailScreen;
