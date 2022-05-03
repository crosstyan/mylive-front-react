import { useState, Fragment } from "react";
import { ReactFlvPlayer } from "./ReactFlvPlayer";
import { Alert, CardHeader, Box, LinearProgress, Divider } from "@mui/material";
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import { config } from '../config'
import CircularProgress from '@mui/material/CircularProgress';
import { isNaN } from "lodash";

interface StartResp {
  chan: string
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

function sendStop(id: string): Promise<Response> {
  const url = config.baseUrl + config.stopRtmpApi
  const with_id = url.replace("{id}", id)
  return fetch(with_id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
}

export default function Stream() {
  const [input, setInput] = useState(0)
  const [isInputError, setIsInputError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chan, setChan] = useState("")
  const [errText, setErrText] = useState("")


  const Player = (chan !== "") ? <ReactFlvPlayer
    url={config.flvApiUrl + config.flvApi + chan}
    width='100%' isLive={true} hasAudio={false} hasVideo={true} /> : null

  const BoxedPlayer = <Box sx={(chan !== "") ? { padding: "1em" } : { padding: "0" }}>{Player}</Box>

  const Err = (errText !== "") ? <Alert severity="error">{errText}</Alert> : null

  const Text =
    <TextField sx={{marginTop:"0.75em"}} error={isInputError} helperText={isInputError ? "id should be number and greater than 0" : ""} label="ID" variant="standard" onChange={(e => {
      const input = e.target.value
      const id = parseInt(input, 10)
      if (!isNaN(id) && id > 0) {
        setInput(id)
        setIsInputError(false)
      } else {
        setIsInputError(true)
      }
    })} />

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader title="Stream" />
      <CardContent>
        {Err}
        {BoxedPlayer}
        {isLoading ? <LinearProgress /> : null}
        <Divider />
        {Text}
      </CardContent>
      <CardActions>
        {isLoading ?
          null :
          <Button onClick={(e) => {
            if (!isInputError && input !== 0) {
              const res = sendStart(input.toString())
              setIsLoading(true)
              res.then((r) => r.json()).then((elem: StartResp) => {
                if (elem.chan !== undefined) {
                  setTimeout(() => {
                    setChan(elem.chan)
                    setIsLoading(false)
                  }, 10000)
                }
              }).catch((e) => {
                console.warn(e.toString())
                setIsLoading(false)
                setErrText(e.toString())
              })
            }
          }}>Start</Button>
        }
        <Button onClick={(e) => {
          if (!isInputError) {
            const res = sendStop(input.toString())
            res.catch((e) => {
              console.warn(e)
              setErrText(e.toString())
              console.log(e.toString())
            })
          }
        }}>Stop</Button>
      </CardActions>
    </Card>
  )
}