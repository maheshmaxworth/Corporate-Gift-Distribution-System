import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/employees/employeesSlice';
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

const EmployeesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);

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
        <title>{getPageTitle('View employees')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View employees')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/employees/employees-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>EmployeeID</p>
            <p>{employees?.employee_id}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{employees?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>GiftStatus</p>

            <p>{employees?.gift_status?.status ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Logs Employee</p>
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
                    {employees.logs_employee &&
                      Array.isArray(employees.logs_employee) &&
                      employees.logs_employee.map((item: any) => (
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
              {!employees?.logs_employee?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/employees/employees-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

EmployeesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_EMPLOYEES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EmployeesView;
