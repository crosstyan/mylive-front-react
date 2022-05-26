
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { config } from '../config'

export interface AccEvent {
  type: "acceleration"
  content: {id:number, x:number, y:number, z:number}
}


export const accSlice = createSlice({
  name: 'acc',
  initialState: [] as AccEvent[],
  reducers: {
    add: (state, action: PayloadAction<AccEvent>) => {
      // write to array, then take last 10 elem
      const temp = [...state, action.payload]
      return temp.slice(-10)
    }
  },
})


export const { add } = accSlice.actions
export default accSlice.reducer

