import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS',
  },
  {
    href: '/counters/counters-list',
    label: 'Counters',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiMonitor' in icon
        ? icon['mdiMonitor' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_COUNTERS',
  },
  {
    href: '/employees/employees-list',
    label: 'Employees',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiAccount' in icon
        ? icon['mdiAccount' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_EMPLOYEES',
  },
  {
    href: '/gift_statuses/gift_statuses-list',
    label: 'Gift statuses',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiGift' in icon
        ? icon['mdiGift' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_GIFT_STATUSES',
  },
  {
    href: '/logs/logs-list',
    label: 'Logs',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiFileDocumentOutline' in icon
        ? icon['mdiFileDocumentOutline' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_LOGS',
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountVariantOutline ?? icon.mdiTable,
    permissions: 'READ_ROLES',
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountOutline ?? icon.mdiTable,
    permissions: 'READ_PERMISSIONS',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

  {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS',
  },
];

export default menuAside;
