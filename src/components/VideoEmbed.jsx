import { React } from 'react'
import ReactPlayer from "react-player";

function VideoEmbed({ embedId, playerRef, onReady }){

  return(
    <div className="video-responsive">
      <ReactPlayer className="video-responsive-inner"
        url={`../../mediaFiles/${embedId}`}
        width="853"
        height="480"
        title="Embedded Video"
        playing={true}
        ref={playerRef}
        onReady={onReady}
        config={{file: {attributes: {disablePictureInPicture: true}}}}
      />
    </div>
  );
}

export default VideoEmbed;