const updateObject = [
  (backend, workingIndex, prevObj, newObj) => {
    const curIndex = backend.removeAtIndex(workingIndex)
    backend.addAtIndex(workingIndex, newObj, curIndex)
  },
  (backend, workingIndex, prevObj, newObj) => {
    const curIndex = backend.removeAtIndex(workingIndex)
    backend.addAtIndex(workingIndex, prevObj, curIndex)
  }
]

export default updateObject