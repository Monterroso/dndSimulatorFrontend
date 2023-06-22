const removeObject = [
  (backend, workingIndex, trueIndex, obj) => {
    backend.removeAtIndex(workingIndex)
  },
  (backend, workingIndex, trueIndex, obj) => {
    backend.addAtIndex(workingIndex, obj, trueIndex)
  }
]

export default removeObject