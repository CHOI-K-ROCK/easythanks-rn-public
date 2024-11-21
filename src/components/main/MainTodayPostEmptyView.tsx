import CustomText from 'components/common/CustomText';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from 'components/common/VectorIcon';
import useCustomTheme from 'hooks/useCustomTheme';
import React from 'react';
import { View } from 'react-native';
import { commonStyles } from 'styles';

type Props = { openComposeScreen: () => void };

const MainTodayPostEmptyView = (props: Props) => {
    const { colors } = useCustomTheme();

    const { openComposeScreen } = props;

    return (
        <View
            style={[
                { ...commonStyles.dropShadow },
                {
                    alignItems: 'center',
                    height: 120,
                    backgroundColor: colors.card,
                    borderRadius: 10,
                    justifyContent: 'center',
                },
            ]}
        >
            <CustomText style={{ fontSize: 16, fontWeight: 600 }}>
                아직 작성한 감사일기가 없습니다.
            </CustomText>
            <PushAnimatedPressable
                onPress={openComposeScreen}
                scale={0.98}
                style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <CustomText
                    style={{
                        fontSize: 14,
                        fontWeight: 400,
                        opacity: 0.7,
                    }}
                >
                    바로 작성하러 가볼까요?
                </CustomText>
                <VectorIcon name="chevron-right" size={20} color={colors.text + '70'} />
            </PushAnimatedPressable>
        </View>
    );
};

export default MainTodayPostEmptyView;
