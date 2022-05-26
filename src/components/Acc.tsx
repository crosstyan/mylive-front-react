import { useState, Fragment, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '../store'
import {type AccEvent, add} from '../store/acc'
import {type PressureEvent, add as addPressure} from '../store/pressure'
import { match, P } from 'ts-pattern';
import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'
import { Card, Alert, CardHeader, CardContent, Box } from "@mui/material";
import { config } from '../config'

const ws = new WebSocket(config.wsApiUrl + "/device/" + "123")

export default function Acc(){
  const accs = useAppSelector(state => state.acc)
  const id = useAppSelector(state => state.stream.id)
  // const [ws, setWs] = useState<WebSocket | undefined>(undefined)
  const dispatch = useAppDispatch()
  useEffect(() => {
    // -1 is magic number for "no id"
    if (id !== -1) {
      // how to release it?
      // setWs(() => new WebSocket(config.wsApiUrl + "/device/" + id))
      const onMsg = (event: MessageEvent<any>) => {
        const msg = JSON.parse(event.data)
        console.log(msg)
        if (msg.type !== undefined) {
          match([msg.type])
            .with(["acceleration"], () => {
              dispatch(add(msg as AccEvent))
            })
            .with(["pressure"], () => {
              dispatch(addPressure(msg as PressureEvent))
            })
            .otherwise(() => { })
        }
      }
      if (ws !== undefined) {
        ws.onmessage = onMsg
        return () => ws.removeEventListener("message", onMsg)
      }
    }
  }, [id])

  return (
    <Card>
      <CardHeader title={`Acc for ${id}`} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> ID </TableCell>
                <TableCell>X</TableCell>
                <TableCell>Y</TableCell>
                <TableCell>Z</TableCell>
              </TableRow>
            </TableHead>

            {accs.map(e => {
              return (
                <TableRow>
                  <TableCell>{e.content.id}</TableCell>
                  <TableCell>{e.content.x}</TableCell>
                  <TableCell>{e.content.y}</TableCell>
                  <TableCell>{e.content.z}</TableCell>
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
