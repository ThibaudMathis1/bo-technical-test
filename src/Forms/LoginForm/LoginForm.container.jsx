import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../../context/userContext';
import { LanguageContext } from '../../context/languageContext';
import languageConstants from '../../constants/languagesConstants';
import { AuthAPI, UsersAPI } from '../../utils/api/api';
import Session from '../../utils/Session';

import { MODULES, ROLES } from '../../models/User/User.constants';
import useTranslate from '../../utils/hooks/useTranslate';
import text from './loginForm.text';

import LoginFormView from './LoginForm.view';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Accept-Version': 'v6',
};

const INITIAL_VALUES = {
  username: '',
  password: '',
};

function LoginFormContainer() {
  const { t } = useTranslate(text);
  const [errorMsg, setErrorMsg] = useState(null);
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const { toggleLanguage } = useContext(LanguageContext);
  const [initialValues] = useState(INITIAL_VALUES);

  const validate = (values) => {
    const errors = {};

    if (!values?.username) {
      errors.username = t('required');
    }
    if (!values?.password) {
      errors.password = t('required');
    }
    return errors;
  };

  const setInitialLanguage = (lang) => {
    if (!!lang && languageConstants.some((l) => l === lang)) {
      toggleLanguage(lang);
    } else {
      toggleLanguage(languageConstants[0]);
    }
  };

  const redirectUser = () => {
    Session.loadUser();
    const isAllowed =
      Session.user.hasModules([MODULES.WARREN]) && Session.user.hasRoles([ROLES.USE_NEWS]);
    const landingPage = Session.user.homepage.toString();

    if (isAllowed) {
      history.push(landingPage);
    } else {
      history.push('/login');
      setUser({});
    }
  };

  const handleSubmit = async (values) => {
    setErrorMsg(null);
    try {
      const auth = await AuthAPI.login(values);
      const headersWithToken = { ...headers, Authorization: `Bearer ${auth.accessToken}` };
      const userMainData = await UsersAPI.fetchMe(headersWithToken);
      const userData = await UsersAPI.fetchContext(headersWithToken);
      axios.defaults.headers.common = { ...headersWithToken, 'x-account-key': userData.accountKey };
      delete userData.password;

      setUser({ ...userData, ...userMainData, ...auth });
      setInitialLanguage(userMainData?.meta?.language);
      redirectUser();
    } catch (error) {
      setErrorMsg('Connection error');
    }
  };

  useEffect(() => {
    if (!!user?.id && !!user?.accessToken) {
      setInitialLanguage(user?.meta?.language);
      redirectUser();
    }
  }, []);

  return (
    <div>
      <LoginFormView
        onSubmit={handleSubmit}
        errorMsg={errorMsg}
        t={t}
        initialValues={initialValues}
        validate={validate}
      />
    </div>
  );
}

export default LoginFormContainer;
