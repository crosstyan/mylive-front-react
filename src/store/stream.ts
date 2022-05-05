import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { config } from '../config'
import { groupBy, flow, flatten, filter } from 'lodash'
import { type DeviceOL } from "../store/devices"
import { match, P } from 'ts-pattern';
import {type EventDisplay} from './events'

type Status = "success" | "pending" | "failed"

interface StreamProps {
  id: number
  status: "success" | "pending" | "failed"
  chan: string
  error: string
  lastPubEvent: EventDisplay
}

function sendStart(id: string): Promise<Response> {
  const url = config.baseUrl + config.startRtmpApi
  const with_id = url.replace("{id}", id)
  return fetch(with_id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
}

export function sendStop(id: number): Promise<Response> {
  const nid = id.toString()
  const url = config.baseUrl + config.stopRtmpApi
  const with_id = url.replace("{id}", nid)
  return fetch(with_id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
}

export const fetchChannel = createAsyncThunk(
  "fetchChannel",
  async (id:number, thunkAPI): Promise<string> => {
    const res = await sendStart(id.toString())
    const elem = await res.json()
    if (elem.chan !== undefined) {
      return elem.chan
    } else {
      return ""
    }
  }
)

export interface PubEvent extends EventDisplay {
  event: "publish"
}

export const streamSlice = createSlice({
  name: 'stream',
  initialState: {
    id: -1,
    status: "failed",
    chan: "",
    error: "",
    lastPubEvent: {
      id: -1,
      event: "",
      content: ""
    }
  } as StreamProps,
  reducers: {
    setId: (state, action: PayloadAction<number>) => { state.id = action.payload},
    setStatus: (state, action: PayloadAction<Status>) => { state.status = action.payload},
    setLastPub: (state, action: PayloadAction<PubEvent>) => {
      state.lastPubEvent = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannel.fulfilled, (state, action) => { return {...state, status: "pending", chan: action.payload } }) // send start request but not start
      .addCase(fetchChannel.rejected, (state, action) => { return { ...state, status: "failed", error: action.payload as string } })
      .addCase(fetchChannel.pending, (state, action) => { return { ...state, status: "pending" } })
  }
})

export const { setLastPub, setId, setStatus } = streamSlice.actions
export default streamSlice.reducer

