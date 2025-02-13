import React from 'react';
import { Song } from './Card';

export const SongList = ({songs, fetchSingleSong}) => {
	return <>
		{
			songs.map((song, idx) => {
				return <Song song={song} fetchSingleSong={fetchSingleSong} key={idx} />
			})
		}
	</>
} 
