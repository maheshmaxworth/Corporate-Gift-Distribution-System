import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/counters/countersSlice';
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

const CountersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { counters } = useAppSelector((state) => state.counters);

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
        <title>{getPageTitle('View counters')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View counters')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/counters/counters-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>CounterNumber</p>
            <p>{counters?.counter_number || 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Logs</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counters.logs &&
                      Array.isArray(counters.logs) &&
                      counters.logs.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/logs/logs-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='timestamp'>
                            {dataFormatter.dateTimeFormatter(item.timestamp)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!counters?.logs?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Logs Counter</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counters.logs_counter &&
                      Array.isArray(counters.logs_counter) &&
                      counters.logs_counter.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/logs/logs-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='timestamp'>
                            {dataFormatter.dateTimeFormatter(item.timestamp)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!counters?.logs_counter?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/counters/counters-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

CountersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_COUNTERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default CountersView;
