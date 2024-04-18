import React, { useState, useEffect } from 'react';
import { makeStyles } from "@mui/styles";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box } from '@mui/styles';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import axios from 'axios';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
const responsedata=[
    {
      "id": 1,
      "name": "Frozen yoghurt",
      "calories": 159,
      "fat": 6.0,
      "carbs": 24,
      "protein": 4.0,
      "history": [
        { "date": "2023-01-05", "customerId": "110917", "amount": 3 }
      ]
    },
    {
      "id": 2,
      "name": "Ice cream sandwich",
      "calories": 237,
      "fat": 9.0,
      "carbs": 37,
      "protein": 4.3,
      "history": [
        { "date": "2023-01-02", "customerId": "110915", "amount": 1 }
      ]
    },
    // Data makanan lainnya...
  ]
  
function Row({ row }) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Fat&nbsp;(g)</TableCell>
                    <TableCell>Carbs&nbsp;(g)</TableCell>
                    <TableCell>Protein&nbsp;(g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{historyRow.amount}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.calories)}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.fat)}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.carbs)}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.protein)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://example.com/api/foods');
        setData(responsedata);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
