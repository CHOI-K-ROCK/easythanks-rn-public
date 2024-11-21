import React from 'react';

import { View } from 'react-native';
import BaseSkeleton from './BaseSkeleton';
import HorizontalDivider from 'components/common/HorizontalDivider';

import useDimensions from 'hooks/useDimensions';
import useCustomTheme from 'hooks/useCustomTheme';

import { HORIZONTAL_GAP } from 'constants/style';

const PostDetailSkeletonView = () => {
    const { colors } = useCustomTheme();
    const { wp } = useDimensions();

    return (
        <View>
            <BaseSkeleton
                width={150}
                height={30}
                backgroundColor={colors.inputBackground}
                style={{
                    borderRadius: 5,
                    marginBottom: 10,
                }}
            />
            <BaseSkeleton
                width={120}
                height={25}
                backgroundColor={colors.inputBackground}
                style={{
                    borderRadius: 5,
                }}
            />
            <HorizontalDivider style={{ marginVertical: 15 }} />
            <BaseSkeleton
                width={wp(100) - HORIZONTAL_GAP * 2}
                height={120}
                backgroundColor={colors.inputBackground}
                style={{
                    borderRadius: 5,
                }}
            />
        </View>
    );
};

export default React.memo(PostDetailSkeletonView);
