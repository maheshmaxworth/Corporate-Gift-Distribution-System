import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/gift_statuses/gift_statusesSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const Gift_statusesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { gift_statuses } = useAppSelector((state) => state.gift_statuses);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View gift_statuses')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View gift_statuses')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/gift_statuses/gift_statuses-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Status</p>
            <p>{gift_statuses?.status ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Employees GiftStatus</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>EmployeeID</th>

                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gift_statuses.employees_gift_status &&
                      Array.isArray(gift_statuses.employees_gift_status) &&
                      gift_statuses.employees_gift_status.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/employees/employees-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='employee_id'>{item.employee_id}</td>

                          <td data-label='name'>{item.name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!gift_statuses?.employees_gift_status?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/gift_statuses/gift_statuses-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Gift_statusesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_GIFT_STATUSES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Gift_statusesView;
