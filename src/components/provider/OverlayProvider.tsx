import React from 'react';

import { useRecoilValue } from 'recoil';
import { overlaysAtom } from 'states/ui';

const OverlayProvider = () => {
    const openedOverlays = useRecoilValue(overlaysAtom);

    return openedOverlays.map((modal: { id: string; component: React.FC; props: any }) => {
        const { id, component, props } = modal;

        return <Component component={component} key={id} {...props} />;
    });
};
const Component = ({ component, ...rest }: { component: React.FC }) => {
    return component({ ...rest });
};
export default OverlayProvider;
