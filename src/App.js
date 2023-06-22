import './App.css';
import {useEffect, useState} from "react"
import axios from "./libs/axios"
import BackendHandler from './handlers/BackendHandler'
import RawData from "./components/RawData"
import Game from "./components/Game"


const handler = new BackendHandler()

function App() {
  const [turn, setTurn] = useState(-1)

  const advanceAction = (gameNumber) => {
    axios.get(`/api/games/${gameNumber}/changes/${turn + 1}`)
    .then(response => response.data)
    .then(actions => {
      if (actions != null) {
        handler.doAction(actions)
        setTurn(prev => prev + 1)
      }
    })
  }

  const game0Actions = () => advanceAction(1)

  const undoAction = () => {
    if (turn >= 0) {
      handler.undoAction()
      setTurn(prev => prev - 1)
    }
  }
  return ( 
    <div className="App">
      <button onClick={game0Actions}>Forward</button>
      <div>{turn}</div>
      <button onClick={undoAction}>Back</button>
      {
        handler && handler.objects.length !== 0 && <Game handler={handler}/>
      }
      {
        handler && <RawData handler={handler}/>
      }
      
    </div>
  );
}

export default App;
