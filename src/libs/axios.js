import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import mockf from "../__mock__/backendSimple"

const config = {timeout: 1000}

// Bad but we'll work at this later
if (process.env.REACT_APP_IS_AXIOS_MOCK !== "true") {
  config["baseURL"] = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api`
}


const axiosMockInstance = axios.create()
const axiosLiveInstance = axios.create(config)

const axiosMockAdapterInstance = new AxiosMockAdapter(axiosMockInstance, { delayResponse: 0 })


if (process.env.REACT_APP_IS_AXIOS_MOCK === "true") {
  mockf(axiosMockAdapterInstance, axiosLiveInstance)
}

export default process.env.REACT_APP_IS_AXIOS_MOCK === "true" ? axiosMockInstance : axiosLiveInstance
