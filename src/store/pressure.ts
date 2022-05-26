
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { config } from '../config'

export interface PressureEvent {
  type: "pressure"
  content: {id:number, pressure:number}
}


export const pressureSlice = createSlice({
  name: 'presure',
  initialState: [] as PressureEvent[],
  reducers: {
    add: (state, action: PayloadAction<PressureEvent>) => {
      // write to array, then take last 10 elem
      const temp = [...state, action.payload]
      return temp.slice(-10)
    }
  },
})


export const { add } = pressureSlice.actions
export default pressureSlice.reducer
