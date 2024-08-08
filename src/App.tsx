import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from 'components/Layout/Layout';
import { routeNames, routes } from 'routes/routes';
import { PageNotFound } from 'pages/PageNotFound';
import Home from 'pages/Home';
import 'assets/css/globals.css';

const App: React.FC = () => {
  return (
    <Router >
      <Layout>
        <Routes>
          <Route path={routeNames.home} element={<Home />} />
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
  );
};

export default App;
