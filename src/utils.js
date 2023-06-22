const getAllDependent = (indexes, objectList) => {
  const toSearchIndexes = [...indexes]
  const searchedIndexes = Set()

  while (toSearchIndexes.length !== 0) {
    const index = toSearchIndexes.pop()
    searchedIndexes.add(index)

    Object.values(objectList[index]).forEach(value => {
      if (typeof value == "object" || value != null) {
        Object.items(value).forEach(([keyName, indexValue]) => {
          if (keyName === "index" && !searchedIndexes.has(indexValue)) {
            toSearchIndexes.push(indexValue)
          }
        })
      }
    })
  }

  return searchedIndexes
}

const throwErrorIfMismatch = (obj, storedObj) => {
  if (typeof obj !== typeof storedObj) {
    throw Error(`Undo add object had a mismatch. ${obj} was expected, ${storedObj} found`)
  }
  else if (typeof obj === typeof {} ) {
    Object.keys(obj).forEach(key => {
      if (obj[key] !== storedObj[key]) {
        throw Error(`Mismatch of objects, ${obj} was expected, ${storedObj} found`)
      }
    })

    Object.keys(storedObj).forEach(key => {
      if (obj[key] !== storedObj[key]) {
        throw Error(`Mismatch of objects, ${obj} was expected, ${storedObj} found`)
      }
    })
  } else if (typeof obj === typeof []) {
    if (obj.length !== storedObj.length) {
      throw Error(`Mismatch in array lengths, ${obj} was expected, ${storedObj} found`)
    }

    obj.forEach((val, index) => {
      if (obj[index] !== storedObj[index]) {
        throw Error(`Mismatch of array values, ${obj} was expected, ${storedObj} found`)
      }
    })
  } else {
    if (obj !== storedObj) {
      throw Error(`Mismatch of values, ${obj} was expected, ${storedObj} found`)
    }
  }
}

export {getAllDependent, throwErrorIfMismatch}