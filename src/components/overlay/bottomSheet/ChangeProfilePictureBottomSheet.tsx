import React from 'react';

import BottomSheet from './BottomSheet';
import BottomSheetMenuList from './BottomSheetMenuList';

import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';

import usePermissions from 'hooks/usePermissions';

type Props = {
    closeBottomSheet: () => void;

    onChangeImages: (Assets: Asset[]) => void;
    onDeleteProfile: () => void;

    onCancel?: () => void;

    selectionLimit?: number;
    launchImageLibraryOptions?: ImageLibraryOptions;

    showResetProfileButton?: boolean;
};

const ChangeProfilePictureBottomSheet = (props: Props) => {
    const { checkPermission, requestPermission } = usePermissions();

    const {
        closeBottomSheet,

        onChangeImages,
        onDeleteProfile,

        onCancel,
        selectionLimit = 1,

        launchImageLibraryOptions,
        showResetProfileButton,
    } = props;

    const launchOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        presentationStyle: 'popover',
        selectionLimit: selectionLimit,
        quality: 0.7,

        ...launchImageLibraryOptions,
    };

    // handler

    const handleLaunchImageLibrary = async () => {
        // check permission
        const perm = await checkPermission('photoLibrary');

        if (perm !== 'granted' && perm !== 'limited') {
            // 접근 권한이 없는 경우, 앨범 접근 권한이 제한됨 인 경우.
            const requestRes = await requestPermission('photoLibrary');
            if (requestRes !== 'granted' && requestRes !== 'limited') {
                // 새로 얻은 권한이 없는 경우
                return;
            }
        }

        launchImageLibrary(launchOptions, res => {
            const { assets, errorCode, didCancel } = res;
            if (errorCode) {
                console.log(errorCode);
                return;
            }
            if (didCancel) {
                onCancel && onCancel();
            }
            if (assets) {
                onChangeImages(assets);
            }
        });
    };

    const menuData = [
        {
            title: '앨범에서 업로드하기',
            onPress: () => handleLaunchImageLibrary(),
            iconName: 'image-multiple',
        },
        {
            title: '프로필 이미지 삭제',
            onPress: () => onDeleteProfile(),
            iconName: 'delete',
            visible: showResetProfileButton,
        },
    ];

    return (
        <BottomSheet closeBottomSheet={closeBottomSheet}>
            <BottomSheetMenuList data={menuData} />
        </BottomSheet>
    );
};

export default ChangeProfilePictureBottomSheet;
