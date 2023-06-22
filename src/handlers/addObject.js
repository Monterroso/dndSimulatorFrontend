import { throwErrorIfMismatch } from "../utils"

const addObject = [
  (backend, workingIndex, obj) => {
    backend.addAtIndex(workingIndex, obj)
  },
  (backend, workingIndex, obj) => {
    //Check to ensure the removed object is equavalent
    throwErrorIfMismatch(obj, backend.getObject([], workingIndex))
    backend.removeAtIndex(workingIndex)
  }
]

export default addObject