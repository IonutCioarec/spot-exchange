import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'storeManager/store';  // Import AppDispatch
import { fetchPairsData, fetchTokensData, selectIsLoading, selectPairs, selectTokens } from 'storeManager/slices/poolsSlice';
import Loader from 'storeManager/components/Loader';
import { TableContainer, Paper, Table, TableBody, Box, IconButton, TableCell, TableHead, TableRow, Typography, tableCellClasses, Collapse  } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { denomination } from 'utils/formatters';
import { Pair } from 'types/dexTypes';
import 'assets/css/pools.css';
import { styled } from '@mui/material/styles';


interface RowProps {
  pair: Pair;
  index: number;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderRadius: '10px',
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(10,50,50,1)',
    borderRadius: '20px !important',
  },
  '&:last-child td, &:last-child th': {
    border: 0, // Remove border for the last row's cells
  }
}));

const CustomTableRow: React.FC<RowProps> = ({ pair, index }) => {
  const [open, setOpen] = useState(false);
  const token1_img = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png';
  const token2_img = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/MEX-a659d0/icon.png';

  return (
    <Fragment>
      <StyledTableRow
        key={pair.id}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(153, 204, 131, 0.2)', 
            cursor: 'pointer',
          }
        }}
      >
        <TableCell width={'5%'} className='text-center'>
          {index + 1}
        </TableCell>
        {/* Images */}
        <TableCell>
          <img src={token1_img} alt={pair.token1} className='d-inline' style={{ width: 30, height: 30, marginRight: 5 }} />
          <img src={token2_img} alt={pair.token2} className='d-inline' style={{ width: 30, height: 30, marginRight: 5 }} />
          <span> WEGLD / MEX</span>
        </TableCell>
        {/* Liquidity */}
        <TableCell>
          {denomination(parseFloat(pair.liquidity_token1) + parseFloat(pair.liquidity_token2), 4)}
        </TableCell>
        {/*Expand/Collapse Arrow */}
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
      <StyledTableRow
        sx={{
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(10,50,50,1)',
            borderRadius: '20px !important',
          },
          '&:hover': {
            backgroundColor: 'rgba(153, 204, 131, 0.2)', 
            cursor: 'pointer',
          }
        }}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Transactions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>26.7$</TableCell>
                    <TableCell>WEGLD</TableCell>
                    <TableCell>12122</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>0.001$</TableCell>
                    <TableCell>MEX</TableCell>
                    <TableCell>4543</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRow>
    </Fragment>
  );
};

const Pools = () => {
  
  const dispatch: AppDispatch = useDispatch();
  const [initialLoad, setInitialLoad] = useState(true);
  const isLoading = useSelector(selectIsLoading);
  const pairs = useSelector(selectPairs);
  const tokens = useSelector(selectTokens);

  // Fetch data on first mount
  useEffect(() => {
    dispatch(fetchPairsData()).finally(() => setInitialLoad(false));
    dispatch(fetchTokensData()).finally(() => setInitialLoad(false));
  }, [dispatch]);

  useEffect(() => {
		const interval = window.setInterval(() => {
			dispatch(fetchPairsData());
      dispatch(fetchTokensData());
		}, 3000);
		return () => window.clearInterval(interval);
	}, [dispatch]);

  if (initialLoad && isLoading) {
    return (<Loader />);
  }

  return (
    <div className="start-box">
      <Container>
        <Row className='d-flex text-white container align-items-center mb-5'>
          <Col xs={12} lg={12}>
            <div className='mt-5 mb-5'>
              <TableContainer className='b-r-sm' sx={{
                borderRadius: '10px',
                color: 'white',
                overflow: 'hidden'
              }}>
                <Table
                  sx={{
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none"
                    }
                  }}
                >
                  <TableHead className='mb-5'>
                    <TableRow style={{backgroundColor: 'transparent'}}>
                      <TableCell width={'5%'} className='text-center' style={{backgroundColor: 'transparent'}}>#</TableCell>
                      <TableCell style={{backgroundColor: 'transparent'}}>Pool</TableCell>
                      <TableCell style={{backgroundColor: 'transparent'}}>Liquidity</TableCell>
                      <TableCell style={{backgroundColor: 'transparent'}}/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {pairs.map((pair: Pair, index: number) => (
                    <CustomTableRow key={pair.id} pair={pair} index={index}/>
                  ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Pools;