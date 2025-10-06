import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';
import {
  Box, Button,
  Container, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField
} from "@mui/material";

function App() {

  //API url
  const API_URL = "https://www.johanovsti.eu/RestAPI/api.php/auta";
  const [data, setData] = useState([]);

  //Filter
  const [model, setModel] = useState("");
  const [karoserie, setKaroserie] = useState("");

  //Array unique zanr
  const [ukar, setUkar] = useState([]);

  //Strankovani
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const pageChangeHandler = (event, newPage) => {
    setPage(newPage);
  };

  const rowsPerPageChangeHandler = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0);
  };

  //usestate pro razeni
  const [orderby, setOrderby] = useState("");
  const [orderDirect, setOrderDirect] = useState("asc");

  const handleSort = (x) => {
    setOrderby(x);
    const isASC = (orderby === x) && (orderDirect === "asc");

    setOrderDirect(isASC ? "desc" : "asc");
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setData(data);

        //filer
        const kar = [... new Set(data.map((item) => item.karoserie))];
        setUkar(kar);
      })
      .catch((err) => console.log("Err: " + err));
  }, []);

  //click
  const handleClick = () => {
    setRowsPerPage(10);
    setModel("");
    setKaroserie("");
    setOrderby("");
    setOrderDirect("asc");
  };

  const getFilerData = () => {
    return data.filter((item) => {
      //Filter name
      const containName = item.model.toLowerCase().includes(model.toLowerCase());

      //Filter zanr
      let pokar = true;
      if (karoserie !== "") {
        pokar = (item.karoserie == karoserie);
      }

      return containName && pokar;
    })
  };

  const getFilteredDataCount = () => {
    return getFilerData().length;
  }

  const getFilteredDataSliced = () => {
    const sli_filter = getFilerData();

    if (orderby) {
      sli_filter.sort((a, b) => {
        const aV = a[orderby] ?? "";
        const bV = b[orderby] ?? "";

        const botNumbers = (!isNaN(aV) && !isNaN(bV));
        if (botNumbers) {
          return orderDirect === "asc" ? Number(aV) - Number(bV) : Number(bV) - Number(aV);
        }
        return orderDirect === "asc" ? String(aV).localeCompare(String(bV)) : String(bV).localeCompare(String(aV))
      });

    }


    return sli_filter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }

  return (
    <>
      <Container>
        <h1>React filter car</h1>

        {/* Filtrovani */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <TextField label="Filter by model" value={model} onChange={(e) => setModel(e.target.value)} />

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Karoserie</InputLabel>
            <Select label="Karoserie" value={karoserie} onChange={(e) => setKaroserie(e.target.value)}>
              <MenuItem value="">Vse</MenuItem>
              {
                ukar.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>


        {/* Tabulka */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>znacka</TableCell>
                <TableCell>model</TableCell>
                <TableCell>rok</TableCell>
                <TableCell><TableSortLabel
                  active={orderby === "palivo"}
                  direction={orderby === "palivo" ? orderDirect : "asc"}
                  onClick={() => handleSort("palivo")}
                >
                  palivo</TableSortLabel></TableCell>
                <TableCell>karoserie</TableCell>
                <TableCell><TableSortLabel
                  active={orderby === "vykon"}
                  direction={orderby === "vykon" ? orderDirect : "asc"}
                  onClick={() => handleSort("vykon")}
                >
                  vykon</TableSortLabel></TableCell>
                <TableCell><TableSortLabel
                  active={orderby === "cena"}
                  direction={orderby === "cena" ? orderDirect : "asc"}
                  onClick={() => handleSort("cena")}
                >
                  cena</TableSortLabel></TableCell>
                <TableCell>spotreba</TableCell>
              </TableRow>
              <TableRow><TableCell>
                <Button onClick={handleClick}>Reset</Button>
              </TableCell></TableRow>
            </TableHead>
            <TableBody>
              {
                getFilteredDataSliced().map((item) => (
                  <TableRow>
                    <TableCell>{item.znacka}</TableCell>
                    <TableCell>{item.model}</TableCell>
                    <TableCell>{item.rok}</TableCell>
                    <TableCell>{item.palivo}</TableCell>
                    <TableCell>{item.karoserie}</TableCell>
                    <TableCell>{item.vykon}</TableCell>
                    <TableCell>{item.cena}</TableCell>
                    <TableCell>{item.spotreba === "0" ? "nezměřeno" : item.spotreba}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paging */}
        <TablePagination
          component="div"
          count={getFilteredDataCount()}
          page={page}
          onPageChange={pageChangeHandler}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={rowsPerPageChangeHandler}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Container>
    </>
  )
}

export default App