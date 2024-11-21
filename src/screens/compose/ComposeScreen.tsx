import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BackHandler, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomText from 'components/common/CustomText';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import CustomTextInput from 'components/common/CustomTextInput';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import HorizontalDivider from 'components/common/HorizontalDivider';
import CustomButton from 'components/common/CustomButton';
import ComposeSummaryView from 'components/compose/ComposeSummaryView';
import CommonModal from 'components/overlay/modal/CommonModal';
import DatePickerBottomSheet from 'components/overlay/bottomSheet/DatePickerBottomSheet';
import SelectImageSourceBottomSheet from 'components/overlay/bottomSheet/SelectImageSourceBottomSheet';
import ComposePhotoAddButton from 'components/compose/ComposePhotoAddButton';
import ComposePhotoThumbnailButton from 'components/compose/ComposePhotoThumbnailButton';

import {
    ComposeScreenNavigationProps,
    ComposeScreenRouteProps,
} from 'types/navigations/composeStack';
import { PostDataType } from 'types/models/post';
import { Asset } from 'react-native-image-picker';

import useInput from 'hooks/useInput';
import useOverlay from 'hooks/useOverlay';
import useKeyboard from 'hooks/useKeyboard';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';
import useCustomTheme from 'hooks/useCustomTheme';

import { getInitialPostNameByDate } from 'utils/string';
import { checkPostEdited } from 'utils/posts';
import { v4 } from 'uuid';
import { handleCreateOrUpdatePost } from 'logics/posts';

import { commonStyles } from 'styles';
import { HORIZONTAL_GAP } from 'constants/style';

const ComposeScreen = () => {
    const navigation = useNavigation<ComposeScreenNavigationProps>();
    const { params } = useRoute<ComposeScreenRouteProps>();

    const { setLoading } = useLoading();
    const { colors } = useCustomTheme();
    const { dismiss: keyBoardDismiss } = useKeyboard();
    const { openToast } = useToast();

    const initialData = params?.initialData as PostDataType;
    const isCreatePost = params?.initialData === undefined;

    const {
        id: postId,
        content: initialContent,
        photos: initialPhotos,
        title: initialTitle,
        date: initialDate,
    } = initialData || {};

    const [date, setDate] = useState<Date>(new Date(initialDate ? initialDate + 'Z' : Date.now())); // 작성 Date
    // 서버에 저장된 timestamp 가 UTC 기준이므로 Z 를 뒤에 붙힌다.
    const [photos, setPhotos] = useState<string[]>(initialPhotos || []);
    const [editedPhotos, setEditedPhotos] = useState<{ added: string[]; deleted: string[] }>({
        added: [],
        deleted: [],
    });

    const {
        value: title,
        handleChange: setTitle,
        clearValue: clearTitle,
    } = useInput(initialTitle || '');
    const { value: content, handleChange: setContent } = useInput(initialContent || '');

    const originalDate = useRef<Date>(new Date());

    const defaultTitle = useMemo(() => getInitialPostNameByDate(date), [date]);
    const isPostEdited = checkPostEdited(
        isCreatePost,
        { title, content, date: date.toISOString(), photos },
        initialData,
        originalDate.current
    );

    const MAX_PHOTO_AMOUNT = 1;

    // overlays

    const { openOverlay: openComposeDismissModal, closeOverlay: closeComposeDismissModal } =
        useOverlay(
            () => (
                <CommonModal
                    title={'작성 취소'}
                    text={'변경된 내용이 있어요!\n작성을 취소하시겠어요?'}
                    closeModal={closeComposeDismissModal}
                    buttons={[
                        { content: '네', onPress: handleCancelWhileCompose, type: 'cancel' },
                        { content: '아니요', onPress: closeComposeDismissModal },
                    ]}
                />
            ),
            'upes-composeDismissModal'
        );

    const { openOverlay: openEditDateBottomSheet, closeOverlay: closeEditDateBottomSheet } =
        useOverlay(
            () => (
                <DatePickerBottomSheet
                    closeBottomSheet={closeEditDateBottomSheet}
                    onConfirm={e => onChangeDate('date', e)}
                    initialDate={date}
                    type={'date'}
                />
            ),
            'upes-editDateBottomSheet'
        );

    const { openOverlay: openEditTimeBottomSheet, closeOverlay: closeEditTimeBottomSheet } =
        useOverlay(
            () => (
                <DatePickerBottomSheet
                    closeBottomSheet={closeEditTimeBottomSheet}
                    onConfirm={e => onChangeDate('time', e)}
                    initialDate={date}
                    type={'time'}
                />
            ),
            'upes-editTimeBottomSheet'
        );

    const { openOverlay: openPhotoBottomSheet, closeOverlay: closePhotoBottomSheet } = useOverlay(
        () => (
            <SelectImageSourceBottomSheet
                closeBottomSheet={closePhotoBottomSheet}
                onChangeImages={handleAddPhoto}
                selectionLimit={MAX_PHOTO_AMOUNT - photos.length}
            />
        ),
        'upes-photoBottomSheet'
    );

    useEffect(() => {
        if (Platform.OS === 'android') {
            // 안드로이드 뒤로가기 버튼 이벤트
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (isPostEdited) {
                    keyBoardDismiss();
                    openComposeDismissModal();
                    return true;
                }
                return false;
            });

            return () => backHandler.remove();
        }
    }, [isCreatePost, isPostEdited, openComposeDismissModal, keyBoardDismiss]);

    //handler

    const onCancelCompose = () => {
        if (isPostEdited) {
            keyBoardDismiss();
            openComposeDismissModal();
            return;
        }

        navigation.goBack();
    };

    const handleCancelWhileCompose = useCallback(() => {
        closeComposeDismissModal();
        navigation.goBack();
    }, [closeComposeDismissModal, navigation]);

    const onChangeDate = useCallback(
        (type: 'date' | 'time', newDate: Date) => {
            const tempDate = new Date(newDate);

            if (type === 'date') {
                tempDate.setDate(newDate.getDate());
                tempDate.setMonth(newDate.getMonth());

                setDate(tempDate);
                closeEditDateBottomSheet();
            }

            if (type === 'time') {
                tempDate.setHours(newDate.getHours());
                tempDate.setMinutes(newDate.getMinutes());

                setDate(tempDate);
                closeEditTimeBottomSheet();
            }
        },
        [closeEditDateBottomSheet, closeEditTimeBottomSheet]
    );

    const handleAddPhoto = (assets: Asset[]) => {
        const uris = assets.map(e => {
            const { uri } = e;
            return uri!;
        });

        setEditedPhotos(prev => {
            return { ...prev, added: [...prev.added, ...uris] };
        });
        setPhotos(prev => [...prev, ...uris]);
        closePhotoBottomSheet();
    };

    const handleDeletePhoto = (idx: number) => {
        const tempPhoto = [...photos];
        const splicedPath = tempPhoto.splice(idx, 1)[0];

        setEditedPhotos(prev => {
            const { added, deleted } = prev;

            if (added.includes(splicedPath)) {
                return {
                    added: added.filter(path => path !== splicedPath),
                    deleted,
                };
            } else {
                return {
                    added,
                    deleted: [...deleted, splicedPath],
                };
            }
        });

        setPhotos(tempPhoto);
    };

    const handleWritePost = async () => {
        if (content.trim().length === 0) {
            // 내용에 띄어쓰기와 줄바꿈만 있는 경우
            openToast({ text: '작성된 내용이 없습니다!', type: 'error' });
            return;
        }

        const postTime = date.toISOString(); // UTC 시간 사용

        const postData = {
            id: postId ?? v4(), // 기존 postId 가 없는 경우(글 작성) uuidv4 사용
            title: title === '' ? defaultTitle : title,
            content,
            photos,
            date: postTime,
        };

        try {
            setLoading(true);

            await handleCreateOrUpdatePost(postData, editedPhotos);

            navigation.goBack();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding>
            <InnerNavigationBar
                screenTitle={isCreatePost ? '글 쓰기' : '글 수정하기'}
                rightComponent={
                    <PushAnimatedPressable onPress={onCancelCompose} style={styles.cancelButton}>
                        <CustomText style={styles.cancel}>취소</CustomText>
                    </PushAnimatedPressable>
                }
            />
            <ScrollView style={styles.container}>
                <ComposeSummaryView
                    date={date}
                    onPressEditDate={openEditDateBottomSheet}
                    onPressEditTime={openEditTimeBottomSheet}
                    // onPressEditLocation={onPressEditLocation}
                    editable
                />
                <HorizontalDivider style={styles.divider} />
                <View style={styles.textFieldContainer} onStartShouldSetResponder={() => true}>
                    <CustomTextInput
                        value={title}
                        title={'제목을 작성해주세요!'}
                        placeholder={defaultTitle}
                        onChangeText={setTitle}
                        onPressClear={clearTitle}
                        clearButton
                    />

                    <CustomTextInput
                        value={content}
                        title={'오늘의 감사일기를 작성해보세요!'}
                        placeholder={'내용'}
                        onChangeText={setContent}
                        textStyle={styles.contentTextField}
                        multiline
                    />

                    <View>
                        <CustomText style={[{ color: colors.subtitle }, styles.addPhotoTitle]}>
                            {'오늘 가장 기억에 남는 한 장이 있으신가요? (선택)'}
                        </CustomText>
                        <View style={styles.photoContainer}>
                            {photos.length < MAX_PHOTO_AMOUNT && (
                                <ComposePhotoAddButton
                                    onPress={openPhotoBottomSheet}
                                    amountIndicator
                                    currentAmount={photos.length}
                                    maxAmount={MAX_PHOTO_AMOUNT}
                                />
                            )}
                            {photos.map((photo, idx) => {
                                return (
                                    <ComposePhotoThumbnailButton
                                        key={idx.toString()}
                                        imgUri={photo}
                                        onPressClose={() => handleDeletePhoto(idx)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    <View style={{ height: 50 }} />
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <CustomButton
                    title={isCreatePost ? '작성 완료' : '수정 완료'}
                    onPress={handleWritePost}
                    disabled={content.trim() === ''}
                    triggerHaptic
                />
            </View>
        </KeyboardDismissSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: HORIZONTAL_GAP,
    },
    divider: {
        marginVertical: 15,
    },
    addPhotoTitle: {
        ...commonStyles.subject,
    },
    textFieldContainer: { gap: 15 },
    contentTextField: {
        height: 250,
    },
    cancelButton: {
        paddingHorizontal: 10,
    },
    cancel: {
        fontSize: 15,
        fontWeight: 600,
    },
    photoContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    buttonContainer: {
        paddingHorizontal: HORIZONTAL_GAP,
        marginVertical: 15,
    },
});

export default ComposeScreen;
