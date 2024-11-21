import React, { ReactElement, useCallback, useRef } from 'react';

import {
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import VectorIcon from 'components/common/VectorIcon';

import useCustomTheme from 'hooks/useCustomTheme';
import CustomText from 'components/common/CustomText';
import { commonStyles } from 'styles';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = TextInputProps & {
    textStyle?: StyleProp<ViewStyle>;

    title?: string;
    titleStyle?: StyleProp<TextStyle>;

    clearButton?: boolean;
    onPressClear?: () => void;

    iconComponent?: ReactElement;
};

const CustomTextInput = (props: Props) => {
    const { colors } = useCustomTheme();
    const inputRef = useRef<TextInput>(null);

    const {
        style,
        textStyle,

        title,
        titleStyle,

        clearButton = false,
        onPressClear,

        iconComponent,
        ...restProps
    } = props;

    const isMultiline = restProps.multiline;

    const indicatorOpacity = useSharedValue(0);

    const handlePressClear = useCallback(() => {
        inputRef.current?.focus();
        onPressClear && onPressClear();
    }, [onPressClear]);

    const _onFocus = useCallback(() => {
        indicatorOpacity.value = withTiming(1, { duration: 100 });
    }, [indicatorOpacity]);

    const _onBlur = useCallback(() => {
        indicatorOpacity.value = withTiming(0, { duration: 100 });
    }, [indicatorOpacity]);

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            opacity: indicatorOpacity.value,
        };
    });

    return (
        <View>
            {title && (
                <CustomText style={[{ color: colors.subtitle }, styles.title, titleStyle]}>
                    {title}
                </CustomText>
            )}
            <Pressable
                onPress={() => {
                    inputRef.current?.focus();
                }}
            >
                <View
                    style={[
                        {
                            justifyContent: isMultiline ? 'flex-start' : 'center',
                            backgroundColor: colors.inputBackground,
                        },
                        styles.field,
                        style,
                    ]}
                >
                    {iconComponent && iconComponent}
                    <TextInput
                        ref={inputRef}
                        style={[
                            {
                                color: colors.text,
                                textAlignVertical: isMultiline ? 'top' : 'center', //ios
                                verticalAlign: isMultiline ? 'top' : 'middle', //android
                            },
                            styles.text,
                            textStyle,
                        ]}
                        placeholderTextColor={colors.text + '80'}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        {...restProps}
                    />

                    {clearButton && (
                        <VectorIcon
                            onPress={handlePressClear}
                            name="close"
                            style={styles.clearButton}
                        />
                    )}

                    {/* 활성화 되었을 때 테두리 */}
                    <Animated.View
                        style={[
                            {
                                borderColor: colors.subtitle,
                            },
                            styles.activeIndicator,
                            indicatorStyle,
                        ]}
                        pointerEvents="none"
                    />
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        ...commonStyles.subject,
    },
    activeIndicator: {
        borderWidth: 2,
        borderRadius: 5,
        ...StyleSheet.absoluteFillObject,
    },
    field: {
        minHeight: 45,
        paddingHorizontal: Platform.select({ ios: 15, android: 10 }),
        paddingVertical: Platform.select({ ios: 5, android: 10 }),
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
        textAlignVertical: 'top',
        paddingVertical: Platform.select({ ios: undefined, android: 0 }),
    },
    clearButton: {
        position: 'absolute',
        right: 15,
        opacity: 0.5,
    },
});
export default React.memo(CustomTextInput);
