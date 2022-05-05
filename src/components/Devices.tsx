import React, { useEffect, useState } from 'react'
import { config } from '../config'
import Button from '@mui/material/Button'
import * as changeCase from "change-case"
import { Card, Alert, CardHeader, CardContent, Box } from "@mui/material";
import CardActions from '@mui/material/CardActions'
import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'
import { type Dev, type DeviceOL, type DeviceDB, fetchDevices, devicesSlice } from '../store/devices'
// import { useSelector, useDispatch } from 'react-redux'
import { useAppSelector, useAppDispatch } from '../store'

// (def device
//   {:id              integer?
//    :hash            integer?
//    (ds/opt :name)   string?                                 ; name
//    :last-msg        stored-msg-spec
//    (ds/opt :e-chan) string?                                 ; hex representation of emergency channel
//    (ds/opt :chan)   string?})
// (def stored-msg
//   {:message       string?
//    :port          integer?
//    :host          string?
//    (ds/opt :time) string?})


// TODO: replace hyphen with underscore
// https://stackoverflow.com/questions/13391579/how-to-rename-json-key

function isDevOnline(dev: Dev) {
  return Object.getOwnPropertyNames(dev).includes("last-msg")
}

export default function Devices() {
  const dispatch = useAppDispatch()

  // const [devices, setDevices] = useState<Array<Dev>>([]);
  const devices = useAppSelector(state => state.devices.content)
  useEffect(() => {
    dispatch(fetchDevices())
  }, [])
  return (
    <Card>
      <CardHeader title="Devices" />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> ID </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map(device => {
                return (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{isDevOnline(device) ? 'Online' : 'Offline'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions>
        <Button onClick={() => {
          dispatch(fetchDevices())
        }}>
          Refresh</Button>
      </CardActions>
    </Card>
  )
}
