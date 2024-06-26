import React, { useState } from 'react';

export const Song = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioUrl = props.song.audio; // Assuming audio URL is available in props

    const togglePlay = () => {
        const audio = new Audio(audioUrl);
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="card">
            <h3>{props.song.name}</h3>
            <img src={props.song.image} alt={props.song.name} />
            <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
};
