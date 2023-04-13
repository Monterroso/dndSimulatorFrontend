class gameStateCreator {
  constructor(objectCreatedList) {
    this.gameState = {}
    this.creators = {}

    objectCreatedList.foreach((_, index) => {
      this.create(index, objectCreatedList)
    })
    
  }

  registerCreator(key, creator) {
    this.creators[key] = creator
  }

  create(index, objectCreatedList) {
    if (this.gameState[index] == null) {
      if (this.creators[objectCreatedList[index].type] != null) {
        this.creators[objectCreatedList[index].type]()
      }
    }
  }
}

export default gameStateCreator