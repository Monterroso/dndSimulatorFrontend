import axios, { AxiosRequestConfig } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import mockf from "../__mock__/backendSimple"

const axiosMockInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
})

const axiosLiveInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
})


const axiosMockAdapterInstance = new AxiosMockAdapter(axiosMockInstance, { delayResponse: 0 })

if (process.env.REACT_APP_IS_AXIOS_MOCK === "true") {
  mockf(axiosMockAdapterInstance, axiosLiveInstance)
}

export default process.env.REACT_APP_IS_AXIOS_MOCK === "true" ? axiosMockInstance : axiosLiveInstance
