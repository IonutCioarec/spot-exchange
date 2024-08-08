import type {
  ExtensionLoginButtonPropsType,
  WebWalletLoginButtonPropsType,
  OperaWalletLoginButtonPropsType,
  LedgerLoginButtonPropsType,
  WalletConnectLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  OperaWalletLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  // XaliasLoginButton
} from 'components/Dapp/sdkDappComponents';
import { nativeAuth } from 'config';
import { RouteNamesEnum } from 'routes/routes';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

export const Unlock = () => {
  const navigate = useNavigate();
  const commonProps: CommonPropsType = {
    callbackRoute: RouteNamesEnum.home,
    nativeAuth,
    onLoginRedirect: () => {
      navigate(RouteNamesEnum.home);
    }
  };

  return (
    <div className="vertical-center-container">
      <div className='container-bg shadow rounded-lg p-2 mt-2 mb-3 text-center'>
          <h2 className='text-2xl text-white pt-4 mb-0'>MultiversX Login</h2>
          <p className='text-center small text-white'>Choose a login method</p>

          <Row className='mt-3 mb-5 p-2'>
            <Col xs={12} lg={{offset: 3, span: 6}}>
              <WalletConnectLoginButton
                loginButtonText='xPortal App'
                {...commonProps}
                buttonClassName='font-bold fullWidth mx-0 btn-dark'
              />
            </Col>
            <Col xs={12} lg={{offset: 3, span: 6}}>
              <LedgerLoginButton 
                loginButtonText='Ledger' 
                {...commonProps}
                buttonClassName='font-bold fullWidth mx-0 btn-dark'
              />
            </Col>
            <Col xs={12} lg={{offset: 3, span: 6}}>
              <ExtensionLoginButton
                loginButtonText='DeFi Wallet'
                {...commonProps}
                buttonClassName='font-bold fullWidth mx-0 btn-dark'
              />
            </Col>
            <Col xs={12} lg={{offset: 3, span: 6}}>
              <OperaWalletLoginButton
                loginButtonText='Opera Crypto Wallet - Beta'
                {...commonProps}
                buttonClassName='font-bold fullWidth mx-0 btn-dark'
              />
            </Col>
            <Col xs={12} lg={{offset: 3, span: 6}}>
              <WebWalletUrlLoginButton
                loginButtonText='Web Wallet'
                {...commonProps}
                buttonClassName='font-bold fullWidth mx-0 btn-dark'
              />
            </Col>        
          </Row>
      </div>
    </div>
  );
};
