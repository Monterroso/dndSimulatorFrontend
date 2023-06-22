const changeParam = [
  (backend, workingIndex, paramKey, oldVal, newVal) => {
    backend.changeKey(workingIndex, paramKey, newVal)
  },
  (backend, workingIndex, paramKey, oldVal, newVal) => {
    backend.changeKey(workingIndex, paramKey, oldVal)
  }
]

export default changeParam