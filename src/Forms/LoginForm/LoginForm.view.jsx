import { Link } from 'react-router-dom';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';

import RenderTextInput from '../../Renderers/RenderTextInput';
import { PrimaryButton } from '../../widgets/Buttons/Buttons';

import styles from './loginForm.module.scss';
import React from 'react';
import { Form, Field } from 'react-final-form';

function LoginFormView({ onSubmit, validate, initialValues, errorMsg, t }) {
  return (
    <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
      {({ handleSubmit, invalid, pristine }) => {
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field
              name="username"
              label={t('username')}
              component={RenderTextInput}
              fullWidth
              InputProps={{
                startAdornment: <FaUser className={styles.ficon} />,
              }}
            />
            <Field
              name={'password'}
              label={t('password')}
              type="password"
              component={RenderTextInput}
              fullWidth
              InputProps={{
                startAdornment: <RiLockPasswordFill className={styles.ficon} />,
              }}
            />
            <Link to="/forgotpassword" className={styles.link}>
              {'Forgot password ?'}
            </Link>
            <PrimaryButton label={'login'} type="submit" disabled={invalid || pristine} fullWidth />
            <span className={styles.errorMsg}>{errorMsg ?? ''}</span>
          </form>
        );
      }}
    </Form>
  );
}
export default LoginFormView;
