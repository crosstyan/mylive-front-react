interface Config {
  // without slash at the end
  baseUrl: string;
  devicesApi: string;
  onlineDevicesApi: string;
  startRtmpApi: string;
  stopRtmpApi: string;
  wsApiUrl: string;
  flvApiUrl: string;
  flvApi: string;
}


export const config : Config = {
  baseUrl: 'http://localhost:3001',
  devicesApi: '/devices',
  onlineDevicesApi: '/rtmp/devices',
  startRtmpApi: '/rtmp/devices/{id}/start',
  stopRtmpApi: '/rtmp/devices/{id}/stop',
  wsApiUrl: 'ws://127.0.0.1:3001/ws',
  flvApiUrl: 'http://localhost:8080',
  flvApi: '/live/' // + chan
}
