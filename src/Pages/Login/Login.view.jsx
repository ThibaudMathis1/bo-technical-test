import { loginImagePath, legalText } from '../../config';

import styles from './login.module.scss';
import React from 'react';
import LoginForm from '../../Forms/LoginForm/index.js';
import { palette } from '../../muiTheme.js';

function LoginView() {
  const loginWraperstyle = loginImagePath
    ? { backgroundImage: `url(${loginImagePath})` }
    : { backgroundColor: palette.primary.main };

  return (
    <div style={loginWraperstyle} className={styles.loginWrapper}>
      <LoginForm />
      <div className={styles.copyrightText}>{legalText}</div>
    </div>
  );
}
export default LoginView;
