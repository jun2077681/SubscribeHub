import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';

import AuthGuard from '@/components/AuthGuard';
import ErrorPage from '@/pages/ErrorPage';
import MainPage from '@/pages/MainPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SettingPage from '@/pages/SettingPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';

function App() {
  if (Notification) {
    if (Notification.permission !== 'granted') {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <>
      <ErrorBoundary fallbackRender={(props) => <ErrorPage />}>
        <Suspense fallback={<div>loading...</div>}>
          <Routes>
            <Route path="/login" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route element={<AuthGuard />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/setting" element={<SettingPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
