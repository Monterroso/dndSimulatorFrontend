const addParam = [
  (backend, workingIndex, paramKey, newVal) => {
    backend.changeKey(workingIndex, paramKey, newVal)
  },
  (backend, workingIndex, paramKey, newVal) => {
    backend.removeKey(workingIndex, paramKey)
  }
]

export default addParam