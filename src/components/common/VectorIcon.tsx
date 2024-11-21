import React, { useCallback } from 'react';
import {
    ColorValue,
    Platform,
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useCustomTheme from 'hooks/useCustomTheme';

export type iconProviderType =
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'Feather'
    | 'FontAwesome5'
    | 'FontAwesome6'
    | 'Ionicons';

type Props = TouchableOpacityProps & {
    name: string;
    size?: number;
    color?: ColorValue;
    iconProvider?: iconProviderType;
    iconStyle?: StyleProp<TextStyle>;
};

const VectorIcon = (props: Props) => {
    const { colors } = useCustomTheme();

    const {
        name = 'camera',
        color = colors.text,
        size = 20,
        iconProvider = 'MaterialCommunityIcons',
        onPress,
        activeOpacity = 0.7,
        iconStyle,
        ...restProps
    } = props;

    const getIconComponent = useCallback(() => {
        switch (iconProvider) {
            case 'MaterialCommunityIcons':
                return MaterialCommunityIcons;
            case 'MaterialIcons':
                return MaterialIcons;
            case 'Feather':
                return Feather;
            case 'FontAwesome5':
                return FontAwesome5;
            case 'FontAwesome6':
                return FontAwesome6;
            case 'Ionicons':
                return Ionicons;
        }
    }, [iconProvider]);

    const Icon = getIconComponent();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={activeOpacity}
            {...restProps}
        >
            <Icon style={iconStyle} name={name} size={size} color={color} />
        </TouchableOpacity>
    );
};

export default React.memo(VectorIcon);
