import React, { useEffect, useState } from 'react'
import { config } from '../config'
import Button from '@mui/material/Button'
import { groupBy, flow, flatten, filter } from 'lodash'
import * as changeCase from "change-case"
import { Card, Alert, CardHeader, CardContent, Box } from "@mui/material";
import CardActions from '@mui/material/CardActions'
import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'

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
export interface StoredMsg {
  message: string;
  port: number;
  host: string;
  time: string;
}

interface DeviceDB {
  id: number;
  name: string;
}

export interface DeviceOL extends DeviceDB {
  hash: number;
  "last-msg": StoredMsg;
  "e-chan"?: string;
  chan?: string
}

type Dev = DeviceDB | DeviceOL

async function getDevices(url: string) {
  const response = await fetch(url)
  const obj = await response.json()
  return obj
}

function existDevice(id: number, devices: Array<Dev>): boolean {
  const dev = devices.find(dev => dev.id === id)
  return dev !== undefined
}

function isDevOnline(dev: Dev) {
  return Object.getOwnPropertyNames(dev).includes("last-msg")
}

function mergeDevices(devicesDB: Array<DeviceDB>, devicesOL: Array<DeviceOL>): Array<Dev> {
  let devs: Array<Dev> = [...devicesDB, ...devicesOL]
  const res = groupBy(devs, 'id')
  const vals = Object.values(res)
  const duplicate = flatten(vals.filter(e => e.length > 1)).filter(e => Object.getOwnPropertyNames(e).includes("last-msg"))
  const unique = flatten(vals.filter(e => e.length === 1))
  return unique.concat(duplicate)
}

export default function Devices() {
  const [devices, setDevices] = useState<Array<Dev>>([]);
  const fetchDevices = () => {
    const devApiUrl = config.baseUrl + config.devicesApi
    const olDevApiUrl = config.baseUrl + config.onlineDevicesApi
    Promise.all([getDevices(devApiUrl), getDevices(olDevApiUrl)]).then(
      ([devDB, devOL]: [DeviceDB[], DeviceOL[]]) => {
        const merged = mergeDevices(devDB, devOL)
        setDevices(merged)
      }
    )
  }
  useEffect(() => {
    fetchDevices()
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
        <Button onClick={fetchDevices}>Refresh</Button>
      </CardActions>
    </Card>
  )
}
