import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';
import {
  Box,
  Container, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField
} from "@mui/material";

function App() {

  //API url
  const API_URL = "https://www.johanovsti.eu/RestAPI/api.php/filmy";
  const [data, setData] = useState([]);

  //Filter
  const [name, setName] = useState("");
  const [zanr, setZanr] = useState("");

  //Array unique zanr
  const [uzanr, setUzanr] = useState([]);

  //Strankovani
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

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
        const zanry = [... new Set(data.map((item) => item.zanr))];
        setUzanr(zanry);
      })
      .catch((err) => console.log("Err: " + err));
  }, []);

  const getFilerData = () => {
    return data.filter((item) => {
      //Filter name
      const containName = item.nazev.toLowerCase().includes(name.toLowerCase());

      //Filter zanr
      let pozanr = true;
      if (zanr !== "") {
        pozanr = (item.zanr == zanr);
      }

      return containName && pozanr;
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
        <h1>React filter films</h1>

        {/* Filtrovani */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <TextField label="Filter by name" value={name} onChange={(e) => setName(e.target.value)} />

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Zanr</InputLabel>
            <Select label="Zanr" value={zanr} onChange={(e) => setZanr(e.target.value)}>
              <MenuItem value="">Vse</MenuItem>
              {
                uzanr.map((item) => (
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
                <TableCell>Nazev</TableCell>
                <TableCell><TableSortLabel
                  active={orderby === "rok"}
                  direction={orderby === "rok" ? orderDirect : "asc"}
                  onClick={() => handleSort("rok")}
                >Rok vydani</TableSortLabel></TableCell>
                <TableCell>Zanr</TableCell>
                <TableCell><TableSortLabel
                  active={orderby === "hodnoceni"}
                  direction={orderby === "hodnoceni" ? orderDirect : "asc"}
                  onClick={() => handleSort("hodnoceni")}
                >Hodnoceni</TableSortLabel></TableCell>
                <TableCell><TableSortLabel
                  active={orderby === "delka"}
                  direction={orderby === "delka" ? orderDirect : "asc"}
                  onClick={() => handleSort("delka")}
                >Delka filmu</TableSortLabel></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                getFilteredDataSliced().map((item) => (
                  <TableRow>
                    <TableCell>{item.nazev}</TableCell>
                    <TableCell>{item.rok}</TableCell>
                    <TableCell>{item.zanr}</TableCell>
                    <TableCell>{item.hodnoceni}</TableCell>
                    <TableCell>{item.delka}</TableCell>
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
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Container>
    </>
  )
}

export default App