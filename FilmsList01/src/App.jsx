import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';
import {
  Box,
  Container, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
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
      if(zanr !== ""){
        pozanr = (item.zanr == zanr);
      }

      return containName && pozanr;
    })
  };

  return (
    <>
      <Container>
        <h1>React filter films</h1>

        {/* Filtrovani */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2}}>
          <TextField label="Filter by name" value={name} onChange={(e) => setName(e.target.value)} />
          
          <FormControl sx={{minWidthL: 160}}>
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
                <TableCell>Rok vydani</TableCell>
                <TableCell>Zanr</TableCell>
                <TableCell>Hodnoceni</TableCell>
                <TableCell>Delka filmu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                getFilerData().map((item) => (
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
      </Container>
    </>
  )
}

export default App