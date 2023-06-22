const removeParam = [
  (backend, workingIndex, paramKey, oldVal) => {
    backend.removeKey(workingIndex, paramKey)
  },
  (backend, workingIndex, paramKey, oldVal) => {
    backend.changeKey(workingIndex, paramKey, oldVal)
  }
]

export default removeParam