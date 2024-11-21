import React, { useCallback } from 'react';

import GoogleIcon from '../../../assets/images/logos/profile_oauth_google.png';
import NaverIcon from '../../../assets/images/logos/profile_oauth_naver.png';
import KakaoIcon from '../../../assets/images/logos/profile_oauth_kakao.png';
import AppleIcon from '../../../assets/images/logos/profile_oauth_apple.png';
import EmailIcon from '../../../assets/images/logos/profile_oauth_email.png';

import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import CustomImage from './CustomImage';

import { OauthProviderType } from 'types/models/user';
import { StyleProp } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';

type Props = {
    provider: OauthProviderType;
    style: StyleProp<ImageStyle>;
    onPress?: () => void;
};

const OauthIcon = (props: Props) => {
    const { provider, style, onPress } = props;

    const getSource = useCallback(() => {
        switch (provider) {
            case 'google':
                return GoogleIcon;
            case 'naver':
                return NaverIcon;
            case 'kakao':
                return KakaoIcon;
            case 'apple':
                return AppleIcon;
            case 'email':
                return EmailIcon;
        }
    }, [provider]);

    return (
        <PushAnimatedPressable onPress={onPress} disabled={!onPress}>
            <CustomImage source={getSource()} style={style} />
        </PushAnimatedPressable>
    );
};

export default OauthIcon;
