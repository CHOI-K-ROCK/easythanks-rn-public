import React, { useCallback, useEffect } from 'react';

import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import Modal from './Modal';
import CustomButton from 'components/common/CustomButton';
import HorizontalDivider from 'components/common/HorizontalDivider';

import { CommonModalType } from 'types/models/modal';

import useCustomTheme from 'hooks/useCustomTheme';
import useDimensions from 'hooks/useDimensions';

import { commonStyles } from 'styles';

const CommonModal = (props: CommonModalType) => {
    const { hp } = useDimensions();
    const { colors } = useCustomTheme();

    const {
        title,
        titleIcon,
        text,

        buttons,

        closeModal,

        backdrop = true,
        closingByBackdropPress = true,

        closingByAndroidBackPress = true,

        children,
        childrenPosition = 'bottom',
    } = props;

    const handleBackdropPress = () => {
        closingByBackdropPress && closeModal && closeModal();
    };

    // ui

    useEffect(() => {
        // 안드로이드 백버튼 동작 정의
        if (Platform.OS === 'android') {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                closingByAndroidBackPress && closeModal();
                return true;
            });

            return () => {
                backHandler.remove();
            };
        }
    }, [closeModal, closingByAndroidBackPress]);

    const renderButtons = useCallback(() => {
        return buttons?.map(button => {
            const IS_CANCEL_BUTTON = button.type === 'cancel';

            const {
                content: buttonContent,
                onPress,
                backgroundColor = IS_CANCEL_BUTTON ? colors.warning : colors.text,
                textColor = IS_CANCEL_BUTTON ? '#FFF' : colors.textReverse,
                disabled,
            } = button;

            const buttonHandler = () => {
                onPress && onPress();
            };

            return (
                <CustomButton
                    disabled={disabled}
                    key={buttonContent}
                    title={buttonContent}
                    onPress={buttonHandler}
                    titleStyle={{ color: textColor }}
                    style={[
                        {
                            backgroundColor,
                        },
                        styles.button,
                    ]}
                    triggerHaptic
                />
            );
        });
    }, [buttons, colors]);

    return (
        <Modal onPressBackdrop={handleBackdropPress} backdrop={backdrop}>
            <View>
                {title && (
                    <View>
                        <View style={styles.titleWrapper}>
                            {titleIcon && titleIcon}
                            <CustomText style={styles.title}>{title}</CustomText>
                        </View>
                        <HorizontalDivider style={styles.divider} />
                    </View>
                )}
                {childrenPosition === 'top' && children}
                {text && (
                    <View
                        style={{
                            minHeight: children ? hp(2) : hp(14),
                            justifyContent: 'center',
                        }}
                    >
                        <CustomText style={styles.text}>{text}</CustomText>
                    </View>
                )}
                {childrenPosition === 'bottom' && children}

                <View style={styles.buttonContainer}>{renderButtons()}</View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        gap: 10,
    },
    button: {
        height: undefined,
        paddingVertical: 10,
        borderRadius: 10,
    },
    divider: {
        marginTop: 8,
    },
    titleWrapper: {
        ...commonStyles.rowCenter,
        gap: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 500,
    },
    text: {
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 25,
        paddingVertical: 20,
    },
});

export default CommonModal;
