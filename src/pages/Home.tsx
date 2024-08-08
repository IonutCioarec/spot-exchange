import { Container } from 'react-bootstrap';
import 'assets/css/home.css';
import 'assets/scss/home.scss';
import {Row, Col} from 'react-bootstrap';
import { calculateSlippage } from 'utils/slippage';

const Home = () => {

  
// Example usage:
const result = calculateSlippage(6, null, "1274373494", "204275180146006680248921627", 100000, 1);

console.log("Slippage:", result.slippage, "%");
console.log("New Price Token1 in Token2:", result.newPriceToken1InToken2);
  return (
    <div className="start-box">
      <Container>
        <Row className='d-flex text-white container align-items-center'>
          <Col xs={12} lg={12}>
            
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;