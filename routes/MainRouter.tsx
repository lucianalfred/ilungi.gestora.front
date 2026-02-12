import React from 'react';
import { useApp } from '../hooks/useApp';
import { LoginPage } from '../components/auth/LoginPage';
import { SetPasswordPage } from '../components/auth/SetPasswordPage';
import { PasswordResetPage } from '../components/auth/PasswordResetPage';
import { LandingPage } from '../components/landing/LandingPage';

import { AppPage } from '../pages/App';

export const MainRouter = () => {
  const { view } = useApp();

  switch (view) {
    case 'landing':
      return <LandingPage/>;
    case 'login':
      return <LoginPage />;
    case 'set-password':
      return <SetPasswordPage />;
    case 'reset-password':
      return <PasswordResetPage />;
    case 'app':
      return <AppPage />;
    default:
      return <LoginPage />;
  }
};