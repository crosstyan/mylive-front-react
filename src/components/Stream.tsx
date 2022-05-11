import { useState, Fragment, useEffect } from "react";
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
import { useAppSelector, useAppDispatch } from '../store'

interface StartResp {
  chan: string
}


export default function Stream() {

  const stream = useAppSelector(state => state.stream)
  const chan = useAppSelector(state => state.stream.chan)
  const id = useAppSelector(state => state.stream.id)
  const status = useAppSelector(state => state.stream.status)
  const isLoading = useAppSelector(state => state.stream.status == 'pending')
  const errText = useAppSelector(state => state.stream.error)
  const lastPub = useAppSelector(state => state.stream.lastPubEvent)
  const [ifStream, setIfStream] = useState(false)

  const Player = (chan !== "" && lastPub.content == "publish" && id == lastPub.id ) ? <ReactFlvPlayer
    url={config.flvApiUrl + config.flvApi + chan}
    width='100%' isLive={true} hasAudio={false} hasVideo={true} /> : null

  const BoxedPlayer = <Box sx={(chan !== "") ? { padding: "1em" } : { padding: "0" }}>{Player}</Box>

  const Err = (errText !== "") ? <Alert severity="error">{errText}</Alert> : null

  const card = 
    <Card>
      <CardHeader title="Stream" />
      <CardContent>
        {Err}
        {BoxedPlayer}
        {isLoading ? <LinearProgress /> : null}
        <Divider />
      </CardContent>
    </Card>
  return card
}