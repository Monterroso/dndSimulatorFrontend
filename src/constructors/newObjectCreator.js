class newObjectCreator {
  constructor() {
    this.registers = {}
    this.memo = {}
    this.actionIndex = 0
  }

  setObjectList(objectList) {
    this.objectList = objectList
  }

  setActionList(actionList) {
    this.actionList = actionList
  }

  setObjectsAddedList(objectsAddedList) {
    this.objectsAddedList = objectsAddedList
    this.actionIndex = 0
  }

  setDefault(creator) {
    this.default = creator
  }

  registerCreator(key, creator) {
    this.registers[key] = creator
  }

  create(index) {
    const memobj = this.memo[index]

    if (memobj != null) {
      return memobj
    }

    const obj = this.objectList[index]
    const creator = this.registers[obj.type] || this.default
    
    const type = creator.createType()

    if (type === "list") {
      const item = []
      this.memo[index] = item
      const createdList = creator.create(obj, this)
      createdList.forEach(el => {
        item.push(el)
      })

      return item
    }
    if (type === "object") {
      const item = {}
      this.memo[index] = item
      const createdObj = creator.create(obj, this)
      Object.entries(createdObj).forEach( ([key, val]) => {
        item[key] = val
      })

      return item
    }
    if (type === "value") {
      const item = creator.create(obj, this)

      this.memo[index] = item

      return item
    }

    throw Error("A creator was selected that does not specify a type")

  }
}

class ObjectCreator {
  createType() {
    return 'object'
  }
}

class ArtificalCreator extends ObjectCreator {
  constructor(filters) {
    super()
    this.filters = new Set(filters)
  }

  create(obj, objectCreator) {
    const createdObject = {}
    
    Object.keys(obj).forEach(key => {
      if (key === "type") {
        createdObject[key] = obj[key]
      }
      else if (this.filters.has(key)) {
        createdObject[key] = objectCreator.create(obj[key].index)
      }
    })
    
    return createdObject
  }
}

class ValueCreator {
  constructor(cast) {
    this.cast = cast
  }

  createType() {
    return "value"
  }

  create(obj, objectCreator) {
    return this.cast(obj.value)
  }
}

class DictCreator {
  createType() {
    return 'list'
  }

  create(obj, objectCreator) {
    const retList = []
    obj.pairs.forEach(([key, value]) => {
      retList.push([objectCreator.create(key.index), objectCreator.create(value.index)])
    })
    return retList
  }
}

class ListCreator {
  createType() {
    return 'list'
  }

  create(obj, objectCreator) {
    return obj.items.map(item => objectCreator.create(item.index))
  }
}

const ActionDefaultFilters = ["origin", "deniedBy", "deniedByFailed", "preventedBy", "preventedByFailed"]

const ArtificialObjectFilters = {
  Game: ["actionStack", "board", "entityPositions", "roundCount", "turnNumber", "turnOrder"],
  Board: ["minLoc", "maxLoc"],
  Position: ["x", "y"],
  Tile: ["height"],
  Cost: ["costs"],
  Entity: ["availableActions", "equpiment", "name", "stats", "team"],
  AI: [],
  Stats: ["abilityScores", "savingThrowsBonus", "skillsBonus"],
  StartTurnAction: [...ActionDefaultFilters, "oldActions"],
  MoveAction: [...ActionDefaultFilters, "mover", "destination", "start"],
  EndTurnAction: [...ActionDefaultFilters],
  PreventOverlapMove: [...ActionDefaultFilters, "toDeny"]

}

const ArtificialObjects = ["Game", "Board", "Position", "Tile", "Cost", "Entity", "AI", "Stats", "StartTurnAction", "MoveAction", "EndTurnAction", "PreventOverlapMove"]

const numCreator = new ValueCreator(val => Number(val))
const strCreator = new ValueCreator(val => String(val))
const nullCreator = new ValueCreator(() => undefined)

const createGeneralObjectCreator = () => {
  const generalObjectCreator = new newObjectCreator()
  ArtificialObjects.forEach(key => generalObjectCreator.registerCreator(key, new ArtificalCreator(ArtificialObjectFilters[key])))
  generalObjectCreator.registerCreator("Categories", strCreator)
  generalObjectCreator.registerCreator("Features", strCreator)
  generalObjectCreator.registerCreator("str", strCreator)
  generalObjectCreator.registerCreator("int", numCreator)
  generalObjectCreator.registerCreator("float", numCreator)
  generalObjectCreator.registerCreator("NoneType", nullCreator)
  generalObjectCreator.registerCreator("dict", new DictCreator())
  generalObjectCreator.registerCreator("list", new ListCreator())
  generalObjectCreator.registerCreator("tuple", new ListCreator())
  generalObjectCreator.setDefault(strCreator)

  return generalObjectCreator
}

export default createGeneralObjectCreator
