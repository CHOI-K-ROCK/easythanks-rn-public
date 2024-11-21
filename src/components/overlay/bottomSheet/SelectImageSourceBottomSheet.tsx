import React from 'react';

import BottomSheet from './BottomSheet';
import BottomSheetMenuList from './BottomSheetMenuList';

import {
    Asset,
    CameraOptions,
    ImageLibraryOptions,
    launchCamera,
    launchImageLibrary,
} from 'react-native-image-picker';

import usePermissions from 'hooks/usePermissions';

type Props = {
    type?: 'both' | 'camera' | 'imageLibrary';

    closeBottomSheet: () => void;

    onChangeImages: (Assets: Asset[]) => void;
    onCancel?: () => void;

    selectionLimit?: number;

    launchCameraOptions?: CameraOptions;
    launchImageLibraryOptions?: ImageLibraryOptions;
};

const SelectImageSourceBottomSheet = (props: Props) => {
    const { checkPermission, requestPermission } = usePermissions();

    const {
        type = 'both',

        closeBottomSheet,

        onChangeImages,
        onCancel,

        selectionLimit = 1,

        launchCameraOptions,
        launchImageLibraryOptions,
    } = props;

    const cameraOptions: CameraOptions = {
        mediaType: 'photo',
        presentationStyle: 'currentContext',
        quality: 0.7,

        ...launchCameraOptions,
    };

    const imageLibraryOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        presentationStyle: 'popover',
        selectionLimit: selectionLimit,
        quality: 0.7,

        ...launchImageLibraryOptions,
    };

    // handler

    const handleLaunch = async (launchType: 'camera' | 'photoLibrary') => {
        const IS_LAUNCH_CAMERA = launchType === 'camera';
        const launchMethod = IS_LAUNCH_CAMERA ? launchCamera : launchImageLibrary;
        const launchOptions = IS_LAUNCH_CAMERA
            ? (cameraOptions as CameraOptions)
            : (imageLibraryOptions as ImageLibraryOptions);

        // check permission
        const perm = await checkPermission(launchType);

        if (perm !== 'granted' && perm !== 'limited') {
            // 접근 권한이 없는 경우, 앨범 접근 권한이 제한됨 인 경우.
            const requestRes = await requestPermission(launchType);
            if (requestRes !== 'granted' && requestRes !== 'limited') {
                // 새로 얻은 권한이 없는 경우
                return;
            }
        }

        launchMethod(launchOptions, res => {
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
            title: '사진찍기',
            onPress: () => handleLaunch('camera'),
            iconName: 'camera',
        },
        {
            title: '앨범에서 업로드하기',
            onPress: () => handleLaunch('photoLibrary'),
            iconName: 'image-multiple',
        },
    ];

    const menuDataForEachType = {
        camera: [menuData[0]],
        imageLibrary: [menuData[1]],
        both: menuData,
    };

    return (
        <BottomSheet closeBottomSheet={closeBottomSheet}>
            <BottomSheetMenuList data={menuDataForEachType[type]} />
        </BottomSheet>
    );
};

export default SelectImageSourceBottomSheet;
