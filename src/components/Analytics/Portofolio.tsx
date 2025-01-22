import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import 'assets/scss/analytics.scss';
import ClipboardCopy from 'components/ClipboardCopy';
import { useGetAccountInfo } from 'hooks';
import { Col, Row } from 'react-bootstrap';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { Link } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PortofolioChart from 'components/Analytics/PortofolioChart';
import { PortofolioDataObject, PortofolioProps } from 'types/frontendTypes';
import { portofolioImages, portofolioColors } from 'config';


const Portofolio: React.FC<PortofolioProps> = ({ data }) => {
  const { account, address } = useGetAccountInfo();

  return (
    <>
      <h3 className='mt-5 text-white mb-1'>Your Portofolio Stats</h3>
      {address && <p className='adress-text'><span className='address-copy-text'>Account: {address.slice(0, 5)} ... {address.slice(58, 62)} <ClipboardCopy text={address} /></span></p>}
      {address ? (
        <Row className='g-0'>
          <Col xs={12} lg={7}>
            <div className='portofolio-container'>
              <Row>
                <Col xs={12} lg={6} className=''>
                  <p className='font-size-sm text-silver mb-0'>Total Balance</p>
                  <p className='text-white mb-0' style={{ fontSize: '40px' }}>$453.78</p>
                  <div className='flex'>
                    <Link to={'/pools'}>
                      <Button
                        size='small'
                        className='btn-intense-default btn-intense-info hover-btn p-2 b-r-sm font-size-sm'
                        style={{ minWidth: '100px' }}
                      >
                        <CurrencyExchangeIcon fontSize='small' />
                        <span className='ms-2'>Invest</span>
                      </Button>
                    </Link>
                    <Link to={'/'}>
                      <Button
                        size='small'
                        className='ms-2 btn-intense-default btn-intense-success2 hover-btn p-2 b-r-sm font-size-sm'
                        style={{ minWidth: '100px' }}
                      >
                        <SyncAltIcon fontSize='small' />
                        <span className='ms-2'>Swap</span>
                      </Button>
                    </Link>
                  </div>

                  <p className='font-size-sm mt-5 mb-1 text-silver'>Distribution</p>
                  <table className='text-white font-size-sm'>
                    <tbody>
                      {data.map((item: PortofolioDataObject, index: number) => (
                        <tr>
                          <td style={{ color: portofolioColors[index] }} width={'35%'}>{portofolioImages[index]} {item.name}</td>
                          <td width={'35%'} align='right'>${item.value}</td>
                          <td width={'30%'} align='right'>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
                <Col xs={12} lg={6}>
                  <PortofolioChart data={data} />
                </Col>
              </Row>
              <div>

              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className='portofolio-container'>
          <p className='h5 text-silver mb-0 text-center mt-2'>Connect to see details</p>
        </div>
      )}
    </>
  );
};

export default Portofolio;