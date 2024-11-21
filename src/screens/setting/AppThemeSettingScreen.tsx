import React, { useCallback, useEffect, useState } from 'react';

import { StyleSheet } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CommonListItem from 'components/common/CommonListItem';
import ScreenLayout from 'components/common/ScreenLayout';
import CustomCheckBox from 'components/common/CustomCheckBox';

import { AppThemeSettingScreenNavigationProps } from 'types/navigations/settingStack';

import { useNavigation } from '@react-navigation/native';
import { AppThemeType } from 'hooks/useCustomTheme';
import useAppTheme from 'hooks/useAppTheme';
import useToast from 'hooks/useToast';

const AppThemeSettingScreen = () => {
    const navigation = useNavigation<AppThemeSettingScreenNavigationProps>();
    const [appTheme, setAppTheme] = useState<AppThemeType>('device');

    const { setCurrentAppTheme, getCurrentAppTheme } = useAppTheme();
    const { openToast } = useToast();

    useEffect(() => {
        const checkCurrentAppTheme = async () => {
            const currentAppTheme = await getCurrentAppTheme();
            setAppTheme(currentAppTheme as AppThemeType);
        };
        checkCurrentAppTheme();
    }, [getCurrentAppTheme]);

    const handleChangeAppTheme = useCallback(
        (type: AppThemeType) => {
            if (appTheme === type) return;

            setCurrentAppTheme(type);
            setAppTheme(type);

            openToast({ text: getThemeName(type), type: 'complete' });
        },
        [appTheme, openToast, setCurrentAppTheme]
    );

    const deviceOnPress = useCallback(() => handleChangeAppTheme('device'), [handleChangeAppTheme]);
    const lightOnPress = useCallback(() => handleChangeAppTheme('light'), [handleChangeAppTheme]);
    const darkOnPress = useCallback(() => handleChangeAppTheme('dark'), [handleChangeAppTheme]);

    const getThemeName = (type: AppThemeType) => {
        switch (type) {
            case 'light': {
                return '라이트 모드로 설정 되었어요';
            }
            case 'dark': {
                return '다크 모드로 설정 되었어요';
            }
            case 'device': {
                return '기기 설정으로 설정 되었어요';
            }
        }
    };

    return (
        <SafeAreaView>
            <InnerNavigationBar screenTitle={'앱 테마 설정'} goBack={navigation.goBack} />
            <ScreenLayout>
                <CommonListItem
                    title={'기기 설정'}
                    subTitle={'앱의 테마가 기기에 설정된 테마를 따릅니다.'}
                    rightComponent={
                        <CustomCheckBox checked={appTheme === 'device'} style={styles.checkBox} />
                    }
                    onPress={deviceOnPress}
                    triggerHaptic
                />
                <CommonListItem
                    title={'라이트 모드'}
                    subTitle={'앱의 테마를 라이트 모드로 고정합니다.'}
                    rightComponent={
                        <CustomCheckBox checked={appTheme === 'light'} style={styles.checkBox} />
                    }
                    onPress={lightOnPress}
                    triggerHaptic
                />
                <CommonListItem
                    title={'다크 모드'}
                    subTitle={'앱의 테마를 다크모드로 고정합니다.'}
                    rightComponent={
                        <CustomCheckBox checked={appTheme === 'dark'} style={styles.checkBox} />
                    }
                    onPress={darkOnPress}
                    triggerHaptic
                />
            </ScreenLayout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    checkBox: {
        marginRight: 5,
    },
});

export default AppThemeSettingScreen;
