import React, { useContext } from 'react';

import { PermissionContext } from 'contexts/PermissionContext';

const usePermissions = () => {
    const { checkPermission, requestPermission } = useContext(PermissionContext);

    return { checkPermission, requestPermission };
};

export default usePermissions;
