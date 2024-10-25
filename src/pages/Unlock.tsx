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
import 'assets/scss/unlock.scss';
import { useMobile } from 'utils/responsive';
import LightSpot from 'components/LightSpot';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

export const Unlock = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const commonProps: CommonPropsType = {
    callbackRoute: RouteNamesEnum.home,
    nativeAuth,
    onLoginRedirect: () => {
      navigate(RouteNamesEnum.pools);
    }
  };

  return (
    <div className="container unlock-page-height">
      <div className='container-bg rounded-lg p-2 mb-3 text-center'>
        <h2 className='text-2xl text-white pt-4 mb-0'>MultiversX Login</h2>
        <p className='text-center small text-white'>Choose a login method</p>

        <Row className='mt-3 mb-5 p-2'>
          <Col xs={12} lg={{ offset: 4, span: 4 }}>
            <WalletConnectLoginButton
              loginButtonText='xPortal App'
              {...commonProps}
              buttonClassName='btn-intense-green mx-0 full-width hover-btn green-box-shadow'
            />
          </Col>
          <Col xs={12} lg={{ offset: 4, span: 4 }}>
            <LedgerLoginButton
              loginButtonText='Ledger'
              {...commonProps}
              buttonClassName='btn-intense-green mx-0 full-width hover-btn green-box-shadow'
            />
          </Col>
          <Col xs={12} lg={{ offset: 4, span: 4 }}>
            <ExtensionLoginButton
              loginButtonText='DeFi Wallet'
              {...commonProps}
              buttonClassName='btn-intense-green mx-0 full-width hover-btn green-box-shadow'
            />
          </Col>
          <Col xs={12} lg={{ offset: 4, span: 4 }}>
            <OperaWalletLoginButton
              loginButtonText='Opera Crypto Wallet - Beta'
              {...commonProps}
              buttonClassName='btn-intense-green mx-0 full-width hover-btn green-box-shadow'
            />
          </Col>
          <Col xs={12} lg={{ offset: 4, span: 4 }}>
            <WebWalletUrlLoginButton
              loginButtonText='Web Wallet'
              {...commonProps}
              buttonClassName='btn-intense-green mx-0 full-width hover-btn green-box-shadow'
            />
          </Col>
        </Row>
        <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y={isMobile ? '35%' : '30%'} color="rgba(63, 172, 90, 0.3)" intensity={1} />
      </div>
    </div>
  )
};
