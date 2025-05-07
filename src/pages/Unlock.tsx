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
import xlogo from 'assets/img/xlogo.svg';
import xPortalLogo from 'assets/img/xPortalLogo.svg';
import ledgerLogo from 'assets/img/legderLogo.svg';
import walletLogo from 'assets/img/xWalletLogo.svg';
import walletLogoBlack from 'assets/img/xWalletLogoBlack.svg';
import extensionLogo from 'assets/img/extensionLogo.svg';
import { useGetIsLoggedIn } from 'hooks';
import { useEffect } from 'react';

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
    callbackRoute: RouteNamesEnum.portfolio,
    nativeAuth,
    onLoginRedirect: () => {
      navigate(RouteNamesEnum.portfolio);
    }
  };
  const isLoggedIn = useGetIsLoggedIn();

  //Redirect the user to the potfolio page if he is logged in
    useEffect(() => {
      if (isLoggedIn) {
        navigate('/portfolio');
      }
    }, [isLoggedIn, navigate]);

  return (
    <div className="container unlock-page-height">
      <div className={`container-bg rounded-lg ${isMobile ? '' : 'p-4'} mb-3 text-center`}>
        <Row className={`mt-3 mb-5 ${isMobile ? '' : 'p-5'}`}>
          <Col xs={12} lg={{ offset: 3, span: 6 }}>
            <div className='login-container'>
              <h2 className='text-2xl text-white pt-4 mb-0'>MultiversX Login</h2>
              <p className='text-center small text-white'>Choose a login method</p>
              <Row className='g-2'>
                {/* Extension button */}
                <Col xs={6}>
                  <ExtensionLoginButton
                    {...commonProps}
                    buttonClassName='btn-login mx-0 p-2 full-width hover-btn green-box-shadow'
                  >
                    <div className='bg-black b-r-lg login2'>
                      <img
                        src={extensionLogo}
                        alt={extensionLogo}
                        className='d-inline my-4'
                        style={{ width: 30, height: 35 }}
                      />
                    </div>
                    <p className='mt-3 mb-2 font-size-sm'>DEFI Wallet</p>
                  </ExtensionLoginButton>
                </Col>

                {/* xPortal button */}
                <Col xs={6}>
                  <WalletConnectLoginButton
                    {...commonProps}
                    buttonClassName='btn-login p-2 mx-0 full-width hover-btn green-box-shadow'
                  >
                    <div className='b-r-lg bg-xportal login'>
                      <img
                        src={xPortalLogo}
                        alt={xPortalLogo}
                        className='d-inline my-4'
                        style={{ width: 85, height: 35 }}
                      />
                    </div>
                    <p className='mt-3 mb-2 font-size-sm'>xPortal App</p>
                  </WalletConnectLoginButton>
                </Col>
              </Row>
              <Row>
                {/* Ledger button */}
                <Col xs={12}>
                  <LedgerLoginButton
                    {...commonProps}
                    buttonClassName='btn-login full-width hover-btn p-1 green-box-shadow mx-0'
                  >
                    <div className='d-flex justify-content-start align-items-center py-2'>
                      <img
                        src={ledgerLogo}
                        alt={ledgerLogo}
                        className='ms-3 me-2 login'
                        style={{ width: '20px' }}
                      />
                      <p className='mb-0 font-size-sm'>Ledger</p>
                    </div>
                  </LedgerLoginButton>
                </Col>

                {/* Web Wallet button */}
                <Col xs={12}>
                  <WebWalletUrlLoginButton
                    {...commonProps}
                    buttonClassName='btn-login full-width hover-btn p-1 green-box-shadow mx-0 mb-4 wallet-container'
                  >
                    <div className='d-flex justify-content-start align-items-center py-2'>
                      <img
                        src={walletLogo}
                        alt="wallet logo"
                        className='wallet-logo normal ms-3 me-2'
                        style={{ width: '20px' }}
                      />
                      <img
                        src={walletLogoBlack}
                        alt="wallet logo black"
                        className='wallet-logo hover ms-3 me-2'
                        style={{ width: '20px' }}
                      />
                      <p className='mb-0 font-size-sm'>Web Wallet</p>
                    </div>
                  </WebWalletUrlLoginButton>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y={isMobile ? '35%' : '30%'} color="rgba(63, 172, 90, 0.3)" intensity={1} />
      </div>
    </div>
  )
};
