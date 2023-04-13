import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react"
import createGeneralObjectCreator from './constructors/newObjectCreator';
import Display from './components/Display';
import axios from "axios"

const filterOut = ["dict", "int", "float", "list", "str", "tuple", "NoneType"]



/**
 * Function that creates an object with two functions, that increase or decreate the turn counter
 *
 * @param {*} turn turn integer
 * @param {*} setTurn function to set turn
 * @param {*} setObjectList function to set the object
 * @param {*} setCurrentAction function to set the current action
 * @returns Object as {addNextTurnData, removePrevTurnData} that increment or unincrement the turn info
 */
const createGetNextTurnData = (turn, setTurn, setObjectList, setCurrentAction) => {

  const axiosJSONCallback = (callback) => {
    return () => {
      axios.get("data/piecemealtext.json")
      .then( response => response.json())
      .then(jdata => {  
        callback(jdata)
      })
    }
    
  }

  const addNextTurnData = (jdata) => {
    if (turn < jdata.actionList.length - 1) {
      const offset = jdata.addedObjects.slice(0, turn + 1).reduce((prev, current) => prev + current)

      const addedObjects = jdata.objectList.slice(offset, offset + jdata.addedObjects[turn + 1])

      setObjectList(prev => prev + addedObjects)
      if (turn !== -1) {
        setCurrentAction(jdata.actionList[turn])
      }

      setTurn(prev => prev + 1)
    }
    
  }

  const removePrevTurnData = (jdata) => {
    if (turn > -1) {
      setObjectList(prev => prev.slice(0, prev.length - jdata.addedObjects[turn + 1]))

      if (turn !== -1) {
        setCurrentAction(jdata.actionList[turn])
      }

      setTurn(prev => prev - 1)
    }
    
  }

  return {addNextTurnData: axiosJSONCallback(addNextTurnData), removePrevTurnData: axiosJSONCallback(removePrevTurnData)}
}

const actionList = {
  ROUND_START: 0,
  ACTION_ADDED: 1,
  ACTION_PERFORMED: 2,
  ACTION_DENIED: 3,
  ACTION_PREVENTED: 4,
  GAME_START: 5,
  GAME_END: 6,
  ENTITY_MOVED: 7,
  ENTITY_REMOVED: 8,
  ENTITY_ADDED: 9,
  ITEM_MOVED: 10,
  ITEM_REMOVED: 11,
  ITEM_ADDED: 12,
  END_TURN: 13,
  START_TURN: 14,
}

const TurnInfoUpdators = {
  [actionList.ROUND_START]: () => {},
  [actionList.ACTION_ADDED]: () => {},
  [actionList.ACTION_PERFORMED]: () => {},
  [actionList.ACTION_DENIED]: () => {},
  [actionList.ACTION_PREVENTED]: () => {},
  [actionList.GAME_START]: () => {},
  [actionList.GAME_END]: () => {},
  [actionList.ENTITY_MOVED]: () => {},
  [actionList.ENTITY_REMOVED]: () => {},
  [actionList.ENTITY_ADDED]: () => {},
  [actionList.ITEM_MOVED]: () => {},
  [actionList.ITEM_REMOVED]: () => {},
  [actionList.ITEM_ADDED]: () => {},
  [actionList.END_TURN]: () => {},
  [actionList.START_TURN]: () => {
    // Need to set the actions of the entity taking the turn
  },
}

const updateWithActionData = () => {
  // Going to take the current action, and it is going to apply it to our data

}

const undoWithactionData = () => {
  // Going to take the current action, and it's going to undo it
}

function App() {
  const [data, setData] = useState()
  const [blocks, setBlocks] = useState()
  const [creation, setCreation] = useState()

  const [objectList, setObjectList] = useState([])
  const [currentAction, setCurrentAction] = useState()
  const [turn, setTurn] = useState(-1)

  useEffect(() => {
    fetch("data/piecemealtext.json")
    .then( response => response.json())
    .then( jdata => {
      setData(jdata)
      const inBlocks = {}
      jdata.objectList.forEach(block => {
        if (!Object.keys(inBlocks).includes(block.type)) {
          inBlocks[block.type] = 0
        }
    
        inBlocks[block.type] += 1
      })
      setBlocks(inBlocks)

      const creator = createGeneralObjectCreator()
      creator.setObjectList(jdata.objectList)
      creator.setActionList(jdata.actionList)
      creator.setObjectsAddedList(jdata.addedObjects)
      creator.create(0)

      setCreation(creator)
    })
  }, [])

  // console.log(data)

  // console.log(blocks)

  console.log(creation)

  useEffect(() => {
    axios.get("data/piecemealtext.json")
    .then( response => response.json())
    .then(jdata => {
      jdata.addedObjects[0].forEach()
    })
  }, [])

  return ( 
    <div className="App">
      <Display/>
    </div>
  );
}

export default App;
