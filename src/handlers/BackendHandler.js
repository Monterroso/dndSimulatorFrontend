import addObject from "./addObject"
import changeParam from "./changeParam"
import removeObject from "./removeObject"
import updateObject from "./updateObject"
import removeParam from "./removeParam"
import addParam from "./addParam"

class BackendHandler {
  constructor(changes=[], lookup={}, lookupReverse=[], objects=[]) {

    this.changes = changes
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
  /**
   * Creates a shallow copy of the backend
   *
   * @return {*} 
   * @memberof BackendHandler
   */
  clone() {
    return new BackendHandler(this.changes, this.lookup, this.lookupReverse, this.objects)
  }

  preview(workingIndex=0, completeSet=null) {
    // So we first are going through the object list,
    const objectSet = completeSet === null ? {} : completeSet

    const trueIndex = this.lookup[workingIndex]
    const obj = this.objects[trueIndex]

    if (Array.isArray(obj)) {
      const retObj = []

      objectSet[workingIndex] = retObj

      obj.forEach(index => retObj.push(this.preview(index, objectSet)))

      return retObj
    }

    if (typeof obj == "object") {
      const retObj = {}

      objectSet[workingIndex] = retObj

      for (const [key, value] of Object.entries(obj)) {
        const rawKey = this.preview(key, objectSet)
        const keyIndex = typeof rawKey === "object" && rawKey != null ? key : rawKey
        
        retObj[keyIndex] = this.preview(value, objectSet)
      }

      return retObj
    }

    return obj
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

    this.preview()
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

    actions.forEach( (raw, index) => {
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

  getIndex(key) {
    for (let i = 0; i <= this.objects.length; i++) {
      const obj = this.objects[i]
      let isValid = false

      if (typeof obj === typeof key) {
        if (typeof obj === "object" && obj != null) {
          if (Object.keys(obj).length === Object.keys(key).length) {
            isValid = true
            for (const [objKey, objVal] of Object.entries(obj)) {
              if (!(objKey in key && objVal === obj[objKey])) {
                isValid = false
                break
              }
            }
          }
        }
        else if (Array.isArray(obj)) {
          isValid = true
          for (let i = 0; i <= obj.length; i++) {
            if (obj[i] !== key[i]) {
              isValid = false
              break
            }
          }
        }
        else  {
          isValid = key === obj
        }

        if (isValid) {
          return this.lookupReverse[i]
        }
      }
    }
    return -1
  }

  getObject(chain, startingIndex=0) {
    let workingIndex = startingIndex

    chain.forEach( elem => {
      const elemIndex = typeof(elem) === typeof(1) ? elem : this.getIndex(elem) 

      workingIndex = this._getObj(workingIndex)[elemIndex]

    })

    return this._getObj(workingIndex)
  }
}

export default BackendHandler