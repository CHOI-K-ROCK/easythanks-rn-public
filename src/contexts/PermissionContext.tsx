import React, { ReactNode, createContext, useCallback, useRef } from 'react';

import { Platform } from 'react-native';

import { PermissionType } from 'types/models/permission';

import useOverlay from 'hooks/useOverlay';

import {
    PERMISSIONS,
    Permission,
    PermissionStatus,
    check,
    checkNotifications,
    openSettings,
    request,
    requestNotifications,
} from 'react-native-permissions';
import PermissionOpenSettingModal from 'components/overlay/modal/PermissionOpenSettingModal';

type PermissionContextType = {
    checkPermission: (type: PermissionType) => Promise<PermissionStatus>;
    requestPermission: (type: PermissionType) => Promise<PermissionStatus>;
};

const PermissionContext = createContext<PermissionContextType>({
    checkPermission: () => new Promise<PermissionStatus>(() => { }),
    requestPermission: () => new Promise<PermissionStatus>(() => { }),
});

const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const IS_IOS = Platform.OS === 'ios';
    const IS_ANDROID = Platform.OS === 'android';
    const IS_AVOBE_ANDROID_SDK_33 = IS_ANDROID && Number(Platform.Version) >= 33;

    let requiredPermission = useRef<PermissionType>('camera');

    const { openOverlay: openPermissionModal, closeOverlay: closePermissionModal } = useOverlay(
        () => (
            <PermissionOpenSettingModal
                type={requiredPermission.current}
                closeModal={closePermissionModal}
                handlePressOpenSetting={handlePressOpenSetting}
            />
        ),
        'pc-permissionModal'
    );

    const getPermission = useCallback(
        (type: PermissionType) => {
            // 가독성을 위해 case 내부 if문 분리하여 사용
            switch (type) {
                case 'camera': {
                    console.log('camera permission');
                    if (IS_IOS) {
                        return PERMISSIONS.IOS.CAMERA;
                    }
                    if (IS_ANDROID) {
                        return PERMISSIONS.ANDROID.CAMERA;
                    }
                    break;
                }
                case 'photoLibrary': {
                    console.log('library permission');
                    if (IS_IOS) {
                        return PERMISSIONS.IOS.PHOTO_LIBRARY;
                    }
                    if (IS_ANDROID) {
                        return IS_AVOBE_ANDROID_SDK_33
                            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
                    }
                    break;
                }
                case 'notification': {
                    console.log('notification permission');
                    // notiification 에 대한 권한 체크는 requestNotifications 로 따로 진행
                    break;
                }
            }
        },
        [IS_ANDROID, IS_AVOBE_ANDROID_SDK_33, IS_IOS]
    );

    const checkPermission = useCallback(
        async (type: PermissionType): Promise<PermissionStatus> => {
            try {
                const IS_CHECK_NOTIFICATION = type === 'notification';

                let permissionStatus: PermissionStatus = 'denied';

                if (IS_CHECK_NOTIFICATION) {
                    const notificationPermStatus = await checkNotifications();
                    permissionStatus = notificationPermStatus.status;
                } else {
                    const permission = getPermission(type) as Permission;
                    permissionStatus = await check(permission);
                }

                return permissionStatus;
            } catch (error) {
                console.log('permission check error', error);
                throw error;
            }
        },
        [getPermission]
    );

    const requestPermission = useCallback(
        async (type: PermissionType): Promise<PermissionStatus> => {
            try {
                requiredPermission.current = type;
                const IS_CHECK_NOTIFICATION = type === 'notification';

                const permission = getPermission(type) as Permission;
                let permissionStatus: PermissionStatus = 'denied';

                if (IS_CHECK_NOTIFICATION) {
                    const notificationPermStatus = await requestNotifications(['alert', 'sound']);
                    permissionStatus = notificationPermStatus.status;
                } else {
                    const res = await request(permission);
                    permissionStatus = res;
                }

                if (
                    permissionStatus === 'blocked' ||
                    permissionStatus === 'denied' ||
                    permissionStatus === 'unavailable'
                ) {
                    openPermissionModal();
                }

                return permissionStatus;
            } catch (error) {
                console.log('requestPermission error : ', error);
                throw error;
            }
        },
        [getPermission, openPermissionModal]
    );

    const handlePressOpenSetting = useCallback(() => {
        closePermissionModal();
        openSettings();
    }, [closePermissionModal]);

    return (
        <PermissionContext.Provider value={{ checkPermission, requestPermission }}>
            {children}
        </PermissionContext.Provider>
    );
};

export { PermissionContext, PermissionProvider };
