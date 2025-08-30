import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/gift_statuses/gift_statusesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditGift_statuses = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    status: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { gift_statuses } = useAppSelector((state) => state.gift_statuses);

  const { gift_statusesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: gift_statusesId }));
  }, [gift_statusesId]);

  useEffect(() => {
    if (typeof gift_statuses === 'object') {
      setInitialValues(gift_statuses);
    }
  }, [gift_statuses]);

  useEffect(() => {
    if (typeof gift_statuses === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = gift_statuses[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [gift_statuses]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: gift_statusesId, data }));
    await router.push('/gift_statuses/gift_statuses-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit gift_statuses')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit gift_statuses'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Status' labelFor='status'>
                <Field name='status' id='status' component='select'>
                  <option value='NotCollected'>NotCollected</option>

                  <option value='Collected'>Collected</option>
                </Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() =>
                    router.push('/gift_statuses/gift_statuses-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditGift_statuses.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_GIFT_STATUSES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditGift_statuses;
