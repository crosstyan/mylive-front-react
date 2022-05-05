import React, { useEffect, useState } from 'react'
import { config } from '../config'
import Button from '@mui/material/Button'
import { groupBy, flow, flatten, filter } from 'lodash'
import * as changeCase from "change-case"
import { Card, Alert, CardHeader, CardContent, Box } from "@mui/material";
import { type DeviceOL } from "./Devices"
import CardActions from '@mui/material/CardActions'
import { match, P } from 'ts-pattern';
import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'

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

interface EventDisplay {
  id: number
  event: string
  content: string
}

const ws = new WebSocket(config.wsApiUrl)

export default function Events() {
  const [events, setEvents] = useState<Array<EventDisplay>>([])

  const onMsg = (event:MessageEvent<any>) => {
      const msg = JSON.parse(event.data)
      console.log(msg)
      if (msg.type !== undefined) {
        match([msg.type])
          .with(["rtmp"], () => {
            const e: EventDisplay = {
              id: msg.content.id,
              event: msg.type,
              content: msg.content.cmd
            }
            setEvents(es => [...es, e])
          })
          .with(["online"], () => {
            const e: EventDisplay = {
              id: msg.content.id,
              event: msg.type,
              content: msg.content.name
            }
            setEvents(es => [...es, e])
          })
          .otherwise(() => {})
      }
    }


  useEffect(() => {
    ws.onmessage = onMsg
    return () => ws.removeEventListener("message", onMsg)
  }, [])

  return (
    <Card>
      <CardHeader title="Events" />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> ID </TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Content</TableCell>
              </TableRow>
            </TableHead>

            {events.map(e => {
              return (
                <TableRow>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.event}</TableCell>
                  <TableCell>{e.content}</TableCell>
                </TableRow>
              )
            })}
            <TableBody>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
