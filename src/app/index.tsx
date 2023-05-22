import React from 'react';
import { Route, HashRouter, Routes, Navigate } from 'react-router-dom';
import { GlobalStyle } from '../styles/GlobalStyle';
import { GlobalProvider } from '../context/GlobalProvider';
import { AuthProvider } from '../context/AuthProvider';
import { SocketProvider } from '../context/SocketProvider';
import { AuthLayout } from '../layout/AuthLayout';
import { UserLayout } from '../layout/UserLayout';

import routes from '../routes/auth.routes';

import { ProtectedRoute } from '../components/protectedRoute';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { SettingsProfile } from '../components/settings/SettingsProfile';
import { SettingsSecurity } from '../components/settings/SettingsSecurity';
import Admin from '../pages/Admin';
import { Home } from '../pages/Home';

const App = (): JSX.Element => {

  const token = localStorage.getItem('token_ev');

  return (
    <>
    <GlobalStyle />
    <HashRouter>
      <GlobalProvider>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route element={<AuthLayout />}>
                {routes.map(({ component: Component, url }) => (
                  <Route key={url} path={url}
                    element={
                    !token
                      ? <Component />
                      : <Navigate to='/' replace />
                    }
                  />
                ))}
                </Route>
              <Route path='/' element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/settings' element={<Settings />}>
                    <Route index element={<SettingsProfile />} />
                    <Route path='profile' element={<SettingsProfile />} />
                    <Route path='security' element={<SettingsSecurity />} />
                  </Route>
                </Route>
                <Route path='/admin' element={
                  <ProtectedRoute roles={['admin']} >
                    <Admin />
                  </ProtectedRoute>}
                />
              </Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </GlobalProvider>
    </HashRouter>
    </>
  )
}

export { App };
