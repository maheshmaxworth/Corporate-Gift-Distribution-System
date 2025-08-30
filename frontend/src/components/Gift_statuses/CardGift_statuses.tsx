import React from 'react';
import ImageField from '../ImageField';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import dataFormatter from '../../helpers/dataFormatter';
import { Pagination } from '../Pagination';
import { saveFile } from '../../helpers/fileSaver';
import LoadingSpinner from '../LoadingSpinner';
import Link from 'next/link';

import { hasPermission } from '../../helpers/userPermissions';

type Props = {
  gift_statuses: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const CardGift_statuses = ({
  gift_statuses,
  loading,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
  const asideScrollbarsStyle = useAppSelector(
    (state) => state.style.asideScrollbarsStyle,
  );
  const bgColor = useAppSelector((state) => state.style.cardsColor);
  const darkMode = useAppSelector((state) => state.style.darkMode);
  const corners = useAppSelector((state) => state.style.corners);
  const focusRing = useAppSelector((state) => state.style.focusRingColor);

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission = hasPermission(
    currentUser,
    'UPDATE_GIFT_STATUSES',
  );

  return (
    <div className={'p-4'}>
      {loading && <LoadingSpinner />}
      <ul
        role='list'
        className='grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-x-8'
      >
        {!loading &&
          gift_statuses.map((item, index) => (
            <li
              key={item.id}
              className={`overflow-hidden ${
                corners !== 'rounded-full' ? corners : 'rounded-3xl'
              } border  ${focusRing} border-gray-200 dark:border-dark-700 ${
                darkMode ? 'aside-scrollbars-[slate]' : asideScrollbarsStyle
              }`}
            >
              <div
                className={`flex items-center ${bgColor} p-6  gap-x-4 border-b border-gray-900/5 bg-gray-50 dark:bg-dark-800 relative`}
              >
                <Link
                  href={`/gift_statuses/gift_statuses-view/?id=${item.id}`}
                  className='text-lg font-bold leading-6 line-clamp-1'
                >
                  {item.status}
                </Link>

                <div className='ml-auto '>
                  <ListActionsPopover
                    onDelete={onDelete}
                    itemId={item.id}
                    pathEdit={`/gift_statuses/gift_statuses-edit/?id=${item.id}`}
                    pathView={`/gift_statuses/gift_statuses-view/?id=${item.id}`}
                    hasUpdatePermission={hasUpdatePermission}
                  />
                </div>
              </div>
              <dl className='divide-y  divide-stone-300   dark:divide-dark-700 px-6 py-4 text-sm leading-6 h-64 overflow-y-auto'>
                <div className='flex justify-between gap-x-4 py-3'>
                  <dt className='  text-gray-500  dark:text-dark-600'>
                    Status
                  </dt>
                  <dd className='flex items-start gap-x-2'>
                    <div className='font-medium line-clamp-4'>
                      {item.status}
                    </div>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        {!loading && gift_statuses.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No data to display</p>
          </div>
        )}
      </ul>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </div>
  );
};

export default CardGift_statuses;
