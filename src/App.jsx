import { React, useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import axios from 'axios';
import screenfull from 'screenfull';
import VideoEmbed from "./components/VideoEmbed.jsx";
import TimeBar from "./components/TimeBar.jsx";
import ChannelBars from "./components/ChannelBars.jsx";

function App() {

  //app components
  const [dataCall, setDataCall] = useState({"channels": [{"playlist": [{}]}]});
  const [epTitle, setepTitle] = useState("");
  const [epTime, setepTime] = useState("");
  const [epDesc, setepepDesc] = useState("");

  function updatePreview(newTitle, newTime, newDesc) {
    setepTitle(newTitle);
    setepTime(newTime);
    setepepDesc(newDesc);
  };

  function changeChannel(newEplocation){
    setvidLocation(newEplocation);
    setIsReady(false);
    handleFullscreen();
  };

  function getMaxEps() {
    let maxEps = 0;
    dataCall.channels.forEach(i => {maxEps = Math.max(maxEps, i.playlist.reduce((pSum, j) => pSum + j.timeslots, 0))});
    return maxEps;
  };

  //vidplayers components
  const [vidLocation, setvidLocation] = useState("");
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);

  const onReady = useCallback(async () => {
    if (!isReady) {
      const response = await axios.get(`/api/testing`);
      playerRef.current.seekTo(response.data.playtimeSecs, "seconds");
      setIsReady(true);
    }
  }, [isReady]);

  const handleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request(playerRef.current.wrapper);
    }
  };

  //channel bar components
  const focusPoint = useRef(null);
  const resetFocus = (e) => {
    if (focusPoint.current && document.activeElement.tagName === "BODY") {
      focusPoint.current.focus();
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', resetFocus, true)
  }, []);
  const [startPoint, setStartPoint] = useState(0);

  //render components
  useEffect(() => {
    const loadDataCall = async () =>{
      const response = await axios.get(`/api/testing`);
      setDataCall(response.data);
      setepTitle(response.data.channels[0].playlist[0].title);
      setepTime(response.data.channels[0].playlist[0].timespace);
      setepepDesc(response.data.channels[0].playlist[0].description);
      setvidLocation(response.data.channels[0].eplocation);
      playerRef.current.seekTo(response.data.playtimeSecs, "seconds");
    };
    loadDataCall();
  }, []);

  return (
    <>
      <div className='apparea'>
        <div>
          <table className='topbar'><tbody>
            <tr>
              <td width={"50%"}>
                <h1>{epTitle}</h1>
                <h1>{epTime}</h1>
                <h2>{epDesc}</h2>
              </td>
              <td width={"50%"} className='vidbox' onDoubleClick={() => handleFullscreen()}>
                <VideoEmbed embedId={vidLocation} playerRef={playerRef} onReady={onReady} />
              </td>
            </tr>
            </tbody></table>
        </div>
        <div>
          <table className='schedule'><tbody>
            <tr className='timebar'>
              <TimeBar startHour={dataCall.currentHour} startPoint={startPoint} />
            </tr>
            <ChannelBars channels={dataCall.channels} changeChannel={changeChannel} updatePreview={updatePreview} focusPoint={focusPoint} startPoint={startPoint} setStartPoint={setStartPoint} />
            </tbody></table>
        </div>
      </div>
    </>
  )
};

export default App
