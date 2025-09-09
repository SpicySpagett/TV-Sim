import { React, useState } from 'react'

function ChannelBars({ channels, changeChannel, updatePreview, focusPoint, startPoint, setStartPoint }){
    const colsToDisplay = 6;
    const rowsToDisplay = 3;
    let lastRow = false;
    const [activeChannel, setActiveChannel] = useState(0);
    const [startChannel, setStartChannel] = useState(0);
    const [newEpisode, setNewEpisode] = useState("");
    
    const endChannel = Math.min(startChannel + rowsToDisplay, channels.length);
    const currentChannels = channels.slice(startChannel, endChannel);
    
    const handleKeyDown = (e) => {
        if(e.key === 'ArrowRight') {
            moveFocusRight();
        };
        if(e.key === 'ArrowLeft') {
            moveFocusLeft();
        };
        if(e.key === 'ArrowUp') {
            moveFocusUp();
        };
        if(e.key === 'ArrowDown') {
            moveFocusDown();
        };
        if(e.key === 'Enter') {
            changeChannel(newEpisode);
        };
    };
    const moveFocusRight = () => {
        const listItems = document.querySelector(("#channel" + activeChannel)).childNodes;
        const activeItem = document.activeElement;
        for(let i = 0; i < listItems.length; i++) {
            const listLength = listItems.length
            if(activeItem === listItems[i]){
                if(activeItem !== listItems[listLength - 1]) {
                    listItems[i + 1].focus();
                }
                else if(!lastRow) {
                    setStartPoint(startPoint + 1);
                }
            }
        };
    };
    const moveFocusLeft = () => {
        const listItems = document.querySelector(("#channel" + activeChannel)).childNodes;
        const activeItem = document.activeElement;
        for(let i = 0; i < listItems.length; i++) {
            if(activeItem === listItems[i]){
                if(activeItem !== listItems[1]) {
                    listItems[i - 1].focus();
                }
                else if(startPoint !== 0) {
                    setStartPoint(startPoint - 1);
                }
            }
        };
    };
    const moveFocusUp = () => {
        const listItems = document.querySelector(("#channel" + activeChannel)).childNodes;
        const activeItem = document.activeElement;
        for(let i = 0; i < listItems.length; i++) {
            if(activeItem === listItems[i]){
                if(activeChannel !== 0) {
                    const nextChanItems = document.querySelector(("#channel" + (activeChannel - 1))).childNodes;
                    nextChanItems[i].focus();
                }
                else if(startChannel !== 0) {
                    setStartChannel(startChannel - 1);
                    //problem is here, blur for now as temporary solution
                    document.activeElement.blur();
                }
            }
        };
    };
    const moveFocusDown = () => {
        const listItems = document.querySelector(("#channel" + activeChannel)).childNodes;
        const activeItem = document.activeElement;
        for(let i = 0; i < listItems.length; i++) {
            if(activeItem === listItems[i]){
                if(activeChannel !== 2) {
                    const nextChanItems = document.querySelector(("#channel" + (activeChannel + 1))).childNodes;
                    nextChanItems[i].focus();
                }
                else if(endChannel !== channels.length) {
                    setStartChannel(startChannel + 1);
                    //problem is here, blur for now as temporary solution
                    document.activeElement.blur();
                }
            }
        };
    };

    const channelData = currentChannels.map(
        (row, i) => {
            let colsLeft = colsToDisplay;
            let colsUsed = startPoint;
            const episodes = [];
            
            row.playlist.forEach(
                episode => {
                    const tSlots = Math.min(colsLeft, episode.timeslots - colsUsed);
                    const showCol = tSlots <= 0 ? false : true;
                    colsLeft -= Math.max(0, tSlots);
                    colsUsed = Math.max(0, colsUsed - episode.timeslots);
                    if(showCol){
                        episodes.push({
                            "columns" : tSlots,
                            "title" : episode.title,
                            "timespace" : episode.timespace,
                            "description" : episode.description
                        });
                        if(!lastRow)
                            lastRow = row.playlist.at(-1) === episode ? true : false;
                    }
            })

            return(
            <tr key={i} tabIndex={i} className='channel' id={"channel" + i} onKeyDown={handleKeyDown} onFocus={() =>  {setActiveChannel(i); setNewEpisode(row.eplocation)}} onDoubleClick={() => changeChannel(row.eplocation)}>
                <td className='channelbar'><h2>{row.name}</h2></td>
                {episodes.map(
                    (episode, j) => {
                        const focusRef = i + j === 0 ? focusPoint : null;
                        return(
                        <td key={j} tabIndex={j} ref={focusRef} colSpan={episode.columns} className='episode' onFocus={() => updatePreview(episode.title, episode.timespace, episode.description)}><h2>{episode.title}</h2></td>
                    )}
                )}
            </tr>
        )}
    );

    return channelData;
}
  
export default ChannelBars;