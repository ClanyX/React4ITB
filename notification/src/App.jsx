import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [second, setSecond] = useState(0);
  const [isRun, setIsRun] = useState(false);

  const add = () => {
    setSecond(second+10);
  };

  const lower = () => {
    if(second > 0){
      setSecond(second-10);
    }
  };

  const startCount = () => {
    if(second <= 0) return;
    setIsRun(true);
  };

  const showNotification = async () => {
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)){
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification("Time ended!");
    } else {
      alert("Please enable notification!");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prew) => {
        if(prew <= 1){
          clearInterval(interval);
          setIsRun(false);
          showNotification();
          return 0;
        }
        return --prew;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRun]);

  return (
    <>
      <h1>Time with notification</h1>
      <h2>{second}s</h2>
      <button onClick={add}>+10s</button> &nbsp;
      <button onClick={lower}>-10s</button> &nbsp;
      <button onClick={startCount}>Start</button>
    </>
  )
}

export default App
