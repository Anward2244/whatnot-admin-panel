import axios from "axios"
import { baseurl,baseurlweb } from "./Baseurls";

const Authdetails = localStorage.getItem("authUser")
const Auth = JSON.parse(Authdetails)
const token = Auth && Auth.token ? Auth.token : "";

// get function
export const getAllData = (url) => {
  return axios.get(baseurl + url, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// get function
export const getAllWebData = (url) => {
  return axios.get(baseurlweb + url, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// add function
export const addData = (url, data) => {
  return axios.post(baseurl + url, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
// update function
export const updateData = (url, data) => {
  return axios.put(baseurl + url, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
// delete function
export const deletedData = (url) => {
  return axios.delete(baseurl + url, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
