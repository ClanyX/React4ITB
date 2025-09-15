import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';
import {
  Container
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
      .then((res) => res.json)
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
      </Container>
    </>
  )
}

export default App