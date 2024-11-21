import React from 'react';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';

type Props = LinearGradientProps & {
    gradientDirection?: GradientDirectionType;
};

type GradientDirectionType = keyof typeof DIRECTION_OPTION;

const LinearGradientView = (props: Props) => {
    const { children, gradientDirection = 'btt', ...restProps } = props;

    const angle = DIRECTION_OPTION[gradientDirection];

    return (
        <LinearGradient useAngle={true} angle={angle} {...restProps}>
            {children}
        </LinearGradient>
    );
};

const DIRECTION_OPTION = {
    ltr: 90,
    rtl: 270,
    btt: 0, // 라이브러리 기본값
    ttb: 180,
    rtttbl: 135,
    ltttbr: 65,
    rtttbr: 45,
    ltttbl: 225,
    btttlr: 315,
    btttrr: 45,
    bttblr: 135,
    bttbrr: 225,
};

export default LinearGradientView;
