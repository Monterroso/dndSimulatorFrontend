import addObject from "./addObject"
import changeParam from "./changeParam"
import removeObject from "./removeObject"
import updateObject from "./updateObject"
import removeParam from "./removeParam"
import addParam from "./addParam"

class BackendHandler {
  constructor(lookup={}, lookupReverse=[], objects=[]) {
    this.changes = []
    this.lookup = lookup
    this.lookupReverse = lookupReverse
    this.objects = objects

    this.changeHandlers = {
      addObject, 
      changeParam, 
      removeObject, 
      updateObject,
      removeParam,
      addParam
    }
  }

  addAtIndex(workingIndex, obj, addAt=-1) {
    const trueIndex = addAt === -1 ? this.lookupReverse.length : addAt
    Object.keys(this.lookup).forEach(innerIndex => {
      if (this.lookup[innerIndex] >= trueIndex) {
        this.lookup[innerIndex] += 1
      }
    })
    this.lookup[workingIndex] = trueIndex
    this.lookupReverse = [...this.lookupReverse.slice(0, trueIndex), workingIndex, ...this.lookupReverse.slice(trueIndex)]
    this.objects = [...this.objects.slice(0, trueIndex), obj, ...this.objects.slice(trueIndex)]

    return trueIndex
  }

  removeAtIndex(workingIndex) {
    const trueIndex = this.lookup[workingIndex]
    delete this.lookup[workingIndex]

    Object.keys(this.lookup).forEach(innerIndex => {
      if (this.lookup[innerIndex] >= trueIndex) {
        this.lookup[innerIndex] -= 1
      } 
    })

    this.lookupReverse = [...this.lookupReverse.slice(0, trueIndex),
      ...this.lookupReverse.slice(trueIndex + 1)]
    
    this.objects = [...this.objects.slice(0, trueIndex),
      ...this.objects.slice(trueIndex + 1)]

    return trueIndex
  }

  changeKey(workingIndex, key, newVal) {
    const trueIndex = this.lookup[workingIndex]

    this.objects[trueIndex][key] = newVal
  }

  removeKey(workingIndex, key) {
    const trueIndex = this.lookup[workingIndex]

    delete this.objects[trueIndex][key]
  }

  /**
   * Used to ensure input parameters are copied and not modified
   *
   * @param {*} params
   * @returns
   * @memberof BackendHandler
   */
  processParams(params) {
    return params.map(val => {

      

      if (Array.isArray(val)) {
        return [...val]
      }

      if (typeof val === 'object') {
        return {...val}
      }

      return val
    })
  }

  doAction(actions) {
    this.changes.push(actions)

    actions.forEach( raw => {
      const [actionName, ...params] = raw
      this.changeHandlers[actionName][0](this, ...this.processParams(params))
    })  
  }

  undoAction() {
    const actions = this.changes.pop().reverse()

    actions.forEach( raw => {
      const [actionName, ...params] = raw

      this.changeHandlers[actionName][1](this, ...this.processParams(params))
    })
  }

  _getObj(workingIndex) {
    return this.objects[this.lookup[workingIndex]]
  }

  getObject(chain, startingIndex=0) {
    let workingIndex = startingIndex

    chain.forEach( elem => {
      workingIndex = this._getObj(workingIndex)[elem]
    })

    return this._getObj(workingIndex)
  }
}

export default BackendHandler