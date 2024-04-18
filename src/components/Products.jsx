import React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const data = [
  {
    Id: "348d3dea-d647-4925-9784-08dc5d5b23d3",
    ReferenceName: "test Reference",
    StationID: "b5efd8f7-2837-4db0-b11d-b18edf961566",
    isDeleted: false,
    PsnPos: "7;15",
    RefPos: "3;7",
    RefCompare: "Test Reference",
    LastStation: null,
    ParameterChecks: [
      {
        Id: "b708dd66-0a85-465f-a684-023489f4177f",
        Description: "Cek Label",
        Order: 1
      },
      {
        Id: "abd354cf-038c-454b-8c0b-2f204ea19391",
        Description: "Cek LED",
        Order: 2
      },
      {
        Id: "3c0e89ad-fa3e-4b14-b649-63924bdbaba2",
        Description: "Cek Cover",
        Order: 3
      }
    ]
  },
  {
    Id: "5b93a59c-9987-4fe8-9785-08dc5d5b23d3",
    ReferenceName: "Refernce 1",
    StationID: "b5efd8f7-2837-4db0-b11d-b18edf961566",
    isDeleted: false,
    PsnPos: "7;15",
    RefPos: "3;7",
    RefCompare: "Refernce 1",
    LastStation: null,
    ParameterChecks: [
      {
        Id: "4b60781c-b05d-4998-9e86-96ed99887ac7",
        Description: "Cek Label",
        Order: 1
      }
    ]
  }
];

function Row({ dataItem, index }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
          },
          
          backgroundColor: index % 2 === 0 ? 'white' : 'lightgrey', // Warna latar belakang baris bergantung pada indeks (ganjil/genap)
        }}
      >
        <TableCell className='w-1'>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ p: 1 }} // Set padding to 1
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {dataItem.ReferenceName}
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="edit" sx={{ color: 'blue' }}> {/* Edit button color set to yellow */}
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" sx={{ color: 'red' }}> {/* Delete button color set to red */}
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Parameter Checks
              </Typography>
              <Table size="small" aria-label="parameter-checks">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Order</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataItem.ParameterChecks.map((check) => (
                    <TableRow key={check.Id}>
                      <TableCell>{check.Description}</TableCell>
                      <TableCell>{check.Order}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead className='bg-green-600 text-white'>
          <TableRow>
            <TableCell/>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reference Name</TableCell> {/* Gaya teks diubah menjadi putih dan tebal */}
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell> {/* Gaya teks diubah menjadi putih dan tebal */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <Row key={item.Id} dataItem={item} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CollapsibleTable;
