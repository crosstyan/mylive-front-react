import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { config } from '../config'
import { groupBy, flow, flatten, filter } from 'lodash'

export interface StoredMsg {
  message: string;
  port: number;
  host: string;
  time: string;
}

export interface DeviceDB {
  id: number;
  name: string;
}

export interface DeviceOL extends DeviceDB {
  hash: number;
  "last-msg": StoredMsg;
  "e-chan"?: string;
  chan?: string
}

export type Dev = DeviceDB | DeviceOL

export async function getDevices(url: string) {
  const response = await fetch(url)
  const obj = await response.json()
  return obj
}

export function mergeDevices(devicesDB: Array<DeviceDB>, devicesOL: Array<DeviceOL>): Array<Dev> {
  let devs: Array<Dev> = [...devicesDB, ...devicesOL]
  const res = groupBy(devs, 'id')
  const vals = Object.values(res)
  const duplicate = flatten(vals.filter(e => e.length > 1)).filter(e => Object.getOwnPropertyNames(e).includes("last-msg"))
  const unique = flatten(vals.filter(e => e.length === 1))
  return unique.concat(duplicate)
}


interface Devices {
  status: "success" | "pending" | "failed"
  content: Dev[]
}

const initDev: Devices = {
  status: "pending",
  content: []
}

export const fetchDevices = createAsyncThunk(
  "fetchDevices",
  async (thunkAPI): Promise<Dev[]> => {
    const devApiUrl = config.baseUrl + config.devicesApi
    const olDevApiUrl = config.baseUrl + config.onlineDevicesApi
    const [devDB, devOL] = [await getDevices(devApiUrl), await getDevices(olDevApiUrl)]
    return mergeDevices(devDB, devOL)
  }
)

export const devicesSlice = createSlice({
  name: 'devices',
  initialState: initDev,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.fulfilled, (state, action) => { return { status: "success", content: action.payload } })
      .addCase(fetchDevices.rejected, (state, action) => { return { ...state, status: "failed" } })
      .addCase(fetchDevices.pending, (state, action) => { return { ...state, status: "pending" } })
  }
})

export default devicesSlice.reducer
