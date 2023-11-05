import './App.css';
import {useEffect, useState} from "react"
import axios from "./libs/axios"
import BackendHandler from './handlers/BackendHandler'
import RawData from "./components/RawData"
import Game from "./components/Game"

function App() {
  const [gameId, setGameId] = useState()
  const [handler, _setHandler] = useState(new BackendHandler())
  const setHandler = () => _setHandler( prev => prev.clone())
  const [gameNumber, setGameNumber] = useState(2)

  const advanceAction = (gameNumber) => {
    axios.get(`/games/${gameNumber}/changes/${handler.changes.length}`)
    .then(response => response.data)
    .then(actions => {
      if (actions != null) {
        handler.doAction(actions)
        setHandler()    
      }
    })
  }

  const advanceToPresent = (gameNumber) => {
    axios.get(`/games/${gameNumber}/changelength`)
    .then(response => response.data)
    .then(numChanges => {
      for (let cur = handler.changes.length; cur < numChanges; cur++) {
        advanceAction(gameNumber)
      }
    })
  }

  const resumeGame = (gameNumber) => {
    axios.get(`/resumeGame/${gameNumber}/`)
    .then(response => response.data)
    .then(data => {
      if (data != null) {
        console.log("gameResumed")
      } else {
        console.log("gameError")
      }
    })
  }

  const setAction = (gameNumber, actor, action) => {
    axios.post(`/addAction/${gameNumber}`, {actor, action})
    .then(response => response.data)
    .then(data => {
      if (data != null) {
        
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
    if (handler.changes.length > 0) {
      handler.undoAction()
      setHandler()
    }
  }
  return ( 
    <div className="App">
      <button onClick={game0Actions}>Forward</button>
      <div>{handler.changes.length}</div>
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
