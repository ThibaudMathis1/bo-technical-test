import { loginImagePath, legalText } from '../../config';

import { palette } from '../../muiTheme';

import styles from './login.module.scss';

function LoginView({ onSubmit, errorMsg }) {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.copyrightText}>{legalText}</div>
    </div>
  );
}
export default LoginView;
