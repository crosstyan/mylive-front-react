import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { config } from '../config'
import { groupBy, flow, flatten, filter } from 'lodash'
import { type DeviceOL } from "../store/devices"
import { match, P } from 'ts-pattern';

type RTMPCmd = "FCUnpublish" | "publish" | "deleteStream"

interface RTMPEvent {
  type: "rtmp-event"
  content: RTMPEventContent
}

interface RTMPEventContent {
  type: "stream" | "emerg"
  cmd: RTMPCmd
  chan: string
  id: number
}

interface OnlineEvent {
  type: "online-event"
  content: DeviceOL
}

export interface EventDisplay {
  id: number
  event: string
  content: string
}

const ws = new WebSocket(config.wsApiUrl)


export const eventsSlice = createSlice({
  name: 'devices',
  initialState: [] as EventDisplay[],
  reducers: {
    addEvent: (state, action: PayloadAction<EventDisplay>) => {
      state.push(action.payload)
    }
  },
})

export const { addEvent } = eventsSlice.actions
export default eventsSlice.reducer
