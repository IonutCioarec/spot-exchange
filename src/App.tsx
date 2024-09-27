import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from 'components/Layout/Layout';
import { routeNames, routes } from 'routes/routes';
import { PageNotFound } from 'pages/PageNotFound';
import { Unlock } from 'pages/Unlock';
import 'assets/css/globals.css';
import { Provider } from 'react-redux';
import { store } from 'storeManager/store';
import { DataLoader } from 'storeManager/loaders/DataLoader';
import { IntlProvider } from 'react-intl';

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
        logoutRoute: routeNames.home
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
      <IntlProvider locale='en' >
        <Provider store={store}>
          <DataLoader />
          <Router >
            <Layout>
              <TransactionsToastList transactionToastClassName='dark-toast' />
              <NotificationModal />
              <SignTransactionsModals />
              <Routes>
                <Route path={routeNames.unlock} element={<Unlock />} />
                {routes.map((route, index) => {
                  const ComponentToRender = route.component;

                  return (
                    <Route
                      key={'route-key-' + index}
                      path={route.path}
                      element={<ComponentToRender />}
                    />
                  );
                })}
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </Layout>
          </Router>
        </Provider>
      </IntlProvider>
    </DappProvider>
  );
};

export default App;
