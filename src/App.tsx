import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from 'components/Layout/Layout';
import { routeNames, routes } from 'routes/routes';
import { PageNotFound } from 'pages/PageNotFound';
import Home from 'pages/Home';
import {Unlock} from 'pages/Unlock';
import 'assets/css/globals.css';

import {
  DappProvider,
  TransactionsToastList,
  NotificationModal,
  SignTransactionsModals
} from 'components/Dapp/sdkDappComponents';
import {
  apiTimeout,
  walletConnectV2ProjectId,
  environment,
} from 'config';

const App: React.FC = () => {
  return (
    <DappProvider
        environment={environment}
        customNetworkConfig={{
          name: 'customConfig',
          apiTimeout: apiTimeout,
          walletConnectV2ProjectId: walletConnectV2ProjectId
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
          logoutRoute: '/home'
        }}
        customComponents={{
          transactionTracker: {
            props: {
              onSuccess: (sessionId: string) => {
                console.log(`Session ${sessionId} successfully completed`);
              },
              onFail: (sessionId: string, errorMessage: string) => {
                console.log(
                  `Session ${sessionId} failed. ${errorMessage ?? ''}`
                );
              }
            }
          }
        }}
      >
        <Router >
          <Layout>
            <TransactionsToastList transactionToastClassName='dark-toast'/>
            <NotificationModal />
            <SignTransactionsModals />
            <Routes>
              <Route path={routeNames.unlock} element={<Unlock />} />
              {routes.map((route) => (
                <Route
                  path={route.path}
                  key={`route-key-'${route.path}`}
                  element={<route.component />}
                />
              ))}
              <Route path='*' element={<PageNotFound />} />
            </Routes>      
          </Layout>
        </Router>
      </DappProvider>
  );
};

export default App;
