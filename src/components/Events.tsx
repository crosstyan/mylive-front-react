import React, { useEffect, useState } from 'react'
import { config } from '../config'
import Button from '@mui/material/Button'
import { groupBy, flow, flatten, filter } from 'lodash'
import * as changeCase from "change-case"
import { Card, Alert, CardHeader, CardContent, Box } from "@mui/material";
import { type DeviceOL } from "../store/devices"
import CardActions from '@mui/material/CardActions'
import { type EventDisplay, addEvent } from '../store/events'
import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../store'
import { match, P } from 'ts-pattern';
import { setLastPub, PubEvent, setStatus } from '../store/stream'

const ws = new WebSocket(config.wsApiUrl)


export default function Events() {
  const events = useAppSelector(state => state.events)
  const id = useAppSelector(state => state.stream.id)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const onMsg = (event: MessageEvent<any>) => {
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
            // console.log(id)
            if (e.content == "publish") {
              dispatch(setLastPub(e as PubEvent))
              dispatch(setStatus("success"))
              console.log(e)
            }
            if (e.content == "deleteStream") {
              dispatch(setLastPub(e as PubEvent))
              console.log(e)
            }
            dispatch(addEvent(e))
          })
          .with(["online"], () => {
            const e: EventDisplay = {
              id: msg.content.id,
              event: msg.type,
              content: msg.content.name
            }
            dispatch(addEvent(e))
          })
          .otherwise(() => { })
      }
    }
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
