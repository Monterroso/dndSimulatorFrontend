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

export {getAllDependent}