import { useState, Fragment, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '../store'
import {type AccEvent, add} from '../store/acc'
import { match, P } from 'ts-pattern';
import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'
import { Card, Alert, CardHeader, CardContent, Box } from "@mui/material";
import { config } from '../config'

const ws = new WebSocket(config.wsApiUrl + "/device/" + "123")

export default function Acc(){
  const pressure = useAppSelector(state => state.pressure)
  const id = useAppSelector(state => state.stream.id)
  // const [ws, setWs] = useState<WebSocket | undefined>(undefined)
  const dispatch = useAppDispatch()

  return (
    <Card>
      <CardHeader title={`Pressure for ${id}`} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> ID </TableCell>
                <TableCell>Val</TableCell>
              </TableRow>
            </TableHead>

            {pressure.map(e => {
              return (
                <TableRow>
                  <TableCell>{e.content.id}</TableCell>
                  <TableCell>{e.content.pressure}</TableCell>
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
