import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'home',
        title: 'Home',
        type: 'item',
        icon: 'home',
        url: '/home'
    },
    {
        id: 'admin-menus',
        title: 'Admin',
        type: 'group',
        hidden: true,
        children: [
            {
                id: 'audit-logs',
                title: 'Audit Logs',
                type: 'item',
                icon: 'list',
                url: '/admin/audit-logs'
            }
        ]
    }
];
