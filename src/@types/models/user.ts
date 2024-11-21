export type OauthProviderType = 'google' | 'naver' | 'kakao' | 'apple' | 'email';

export type UserDataType = {
    id: string; // 서버에서 생성해서 넘겨줘야함.
    email: string;

    username: string;
    profile_img: string | null;

    oauth_provider: OauthProviderType;
    fcm_token: string | null;
    fcm_platform: 'ios' | 'android' | null;

    profile_setted: boolean;

    created_at: string;
    updated_at: string;
};
