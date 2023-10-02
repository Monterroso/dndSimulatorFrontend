import './App.css';
import {useEffect, useState} from "react"
import axios from "./libs/axios"
import BackendHandler from './handlers/BackendHandler'
import RawData from "./components/RawData"
import Game from "./components/Game"

function App() {
  const [turn, setTurn] = useState(-1)
  const [handler, setHandler] = useState(new BackendHandler())
  const [gameNumber, setGameNumber] = useState(2)

  const advanceAction = () => {
    axios.get(`games/${gameNumber}/changes/${turn + 1}`)
    .then(response => response.data)
    .then(actions => {
      if (actions != null) {
        handler.doAction(actions)
        setTurn(prev => prev + 1)
        setHandler(prev => prev.clone())
      }
    })
  }

  const handleActionSubmit = (event, actor, action) => {
    event.preventDefault()

    axios.post(`addAction/${gameNumber}/`, {
      params: { actor, action }
    }).catch(error => {
      const a = error
    })
  }

  const game0Actions = () => advanceAction(gameNumber)

  const undoAction = () => {
    if (turn >= 0) {
      handler.undoAction()
      setTurn(prev => prev - 1)
      setHandler(prev => prev.clone())
    }
  }
  return ( 
    <div className="App">
      <button onClick={game0Actions}>Forward</button>
      <div>{turn}</div>
      <button onClick={undoAction}>Back</button>
      {
        handler && handler.objects.length !== 0 && <Game handler={handler} actionSubmit={handleActionSubmit}/>
      }
      {
        handler && <RawData handler={handler}/>
      }
      
    </div>
  );
}

export default App;
