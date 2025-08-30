interface StyleObject {
  aside: string;
  asideScrollbars: string;
  asideBrand: string;
  asideMenuItem: string;
  asideMenuItemActive: string;
  asideMenuDropdown: string;
  navBarItemLabel: string;
  navBarItemLabelHover: string;
  navBarItemLabelActiveColor: string;
  overlay: string;
  activeLinkColor: string;
  bgLayoutColor: string;
  iconsColor: string;
  cardsColor: string;
  focusRingColor: string;
  corners: string;
  cardsStyle: string;
  linkColor: string;
  websiteHeder: string;
  borders: string;
  shadow: string;
  websiteSectionStyle: string;
  textSecondary: string;
}

export const white: StyleObject = {
  aside: 'bg-white dark:text-white',
  asideScrollbars: 'aside-scrollbars-light',
  asideBrand: '',
  asideMenuItem:
    'text-gray-700 hover:bg-gray-100/70 dark:text-dark-500 dark:hover:text-white dark:hover:bg-dark-800',
  asideMenuItemActive: 'font-bold text-black dark:text-white',
  asideMenuDropdown: 'bg-gray-100/75',
  navBarItemLabel: 'text-blue-600',
  navBarItemLabelHover: 'hover:text-black',
  navBarItemLabelActiveColor: 'text-black',
  overlay: 'from-white via-gray-100 to-white',
  activeLinkColor: 'bg-gray-100/70',
  bgLayoutColor: 'bg-gray-50',
  iconsColor: 'text-blue-500',
  cardsColor: 'bg-white',
  focusRingColor:
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none border-gray-300 dark:focus:ring-blue-600 dark:focus:border-blue-600',
  corners: 'rounded',
  cardsStyle: 'bg-white border border-pavitra-400',
  linkColor: 'text-blue-600',
  websiteHeder: 'border-b border-gray-200',
  borders: 'border-gray-200',
  shadow: '',
  websiteSectionStyle: '',
  textSecondary: 'text-gray-500',
};

export const skyBlueTheme: StyleObject = {
  aside:
    'bg-skyBlueTheme-800 text-skyBlueTheme-text dark:text-white  lg:rounded-lg',
  asideScrollbars: 'aside-scrollbars-blue',
  asideBrand: 'text-blue-500 bg-white',
  asideMenuItem:
    'text-skyBlueTheme-text  hover:text-white dark:text-dark-500 dark:hover:text-white dark:hover:bg-dark-800 dark:text-white',
  asideMenuItemActive: 'font-bold text-skyBlueTheme-iconsColor dark:text-white',
  activeLinkColor: 'bg-white rounded-lg',
  asideMenuDropdown: 'bg-blue-700/50',
  navBarItemLabel: 'text-primaryText',
  iconsColor: 'text-skyBlueTheme-iconsColor dark:text-blue-500',
  navBarItemLabelHover: 'hover:text-stone-400',
  navBarItemLabelActiveColor: 'text-skyBlueTheme-800',
  overlay: 'bg-skyBlueTheme-mainBG',
  bgLayoutColor: 'bg-skyBlueTheme-mainBG',
  cardsColor: 'bg-skyBlueTheme-cardColor',
  focusRingColor:
    'focus:ring focus:ring-skyBlueTheme-800 focus:border-skyBlueTheme-800 focus:outline-none dark:focus:ring-blue-600 border-gray-300 dark:focus:border-blue-600',
  corners: 'rounded-lg',
  cardsStyle: 'bg-white border border-pavitra-400',
  linkColor: 'text-skyBlueTheme-buttonColor',
  websiteHeder: 'border-b border-gray-200',
  borders: 'border-gray-200',
  shadow: '',
  websiteSectionStyle: ' bg-skyBlueTheme-webSiteComponentBg',
  textSecondary: 'text-slate-600',
};

export const dataGridStyles = {
  '& .MuiDataGrid-cell': {
    paddingX: 3,
    border: 'none',
  },
  '& .MuiDataGrid-columnHeader': {
    paddingX: 3,
  },
  '& .MuiDataGrid-columnHeaderCheckbox': {
    paddingX: 0,
  },
  '& .MuiDataGrid-columnHeaders': {
    paddingY: 4,
    borderStartStartRadius: 7,
    borderStartEndRadius: 7,
  },
  '& .MuiDataGrid-footerContainer': {
    paddingY: 0.5,
    borderEndStartRadius: 7,
    borderEndEndRadius: 7,
  },
  '& .MuiDataGrid-root': {
    border: 'none',
  },
};

export const basic: StyleObject = {
  aside: 'bg-gray-800',
  asideScrollbars: 'aside-scrollbars-gray',
  asideBrand: 'bg-gray-900 text-white',
  asideMenuItem: 'text-gray-300 hover:text-white',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuDropdown: 'bg-gray-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-blue-500',
  navBarItemLabelActiveColor: 'text-blue-600',
  overlay: 'from-gray-700 via-gray-900 to-gray-700',
  activeLinkColor: 'bg-gray-100/70',
  bgLayoutColor: 'bg-gray-50',
  iconsColor: 'text-blue-500',
  cardsColor: 'bg-white',
  focusRingColor:
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none dark:focus:ring-blue-600 border-gray-300 dark:focus:border-blue-600',
  corners: 'rounded',
  cardsStyle: 'bg-white border border-pavitra-400',
  linkColor: 'text-black',
  websiteHeder: '',
  borders: '',
  shadow: '',
  websiteSectionStyle: '',
  textSecondary: '',
};
