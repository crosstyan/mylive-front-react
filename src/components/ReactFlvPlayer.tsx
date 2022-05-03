// a copy and paste from
// https://github.com/crosstyan/react-ts-flv-player/blob/master/src/ReactFlvPlayer.tsx
import { FC, Fragment, useEffect, useRef, useState } from "react";
import flv from "flv.js";

export interface ReactFlvPlayerProps {
  isLive?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  showControls?: boolean;
  enableStashBuffer?: boolean;
  stashInitialSize?: number | undefined;
  height?: number | string;
  width?: number | string;
  isMuted?: false;
  url: string;
  videoProps?: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >;
  flvMediaSourceOptions?: flv.MediaDataSource;
  flvConfig?: flv.Config;
}

export const ReactFlvPlayer: FC<ReactFlvPlayerProps> = (props) => {
  const {
    height,
    width,
    isLive,
    hasAudio,
    hasVideo,
    showControls,
    enableStashBuffer,
    stashInitialSize,
    isMuted,
    url,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<flv.Player>(flv.createPlayer(
    {
      type: "flv",
      isLive: isLive,
      hasAudio: hasAudio,
      hasVideo: hasVideo,
      url: url,
      ...props.flvMediaSourceOptions,
    },
    {
      stashInitialSize: stashInitialSize,
      enableStashBuffer: enableStashBuffer,
      ...props.flvConfig,
    }
  ));

  useEffect(() => {
    player.attachMediaElement(videoRef.current!);
    player.load();
    player.play();
    // player.on("error", (err) => {
    //   props.errorCallback?.(err);
    // });
  }, [player]);

  return (
    <Fragment>
      <video
        controls={showControls}
        muted={isMuted}
        ref={videoRef}
        style={{ height, width }}
        {...props.videoProps}
      />
    </Fragment>
  );
};

export default ReactFlvPlayer;