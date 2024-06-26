import React, { useState, useEffect } from 'react';
import { SongList } from './SongList';
import { AddPage } from './AddPage';
import { SinglePage } from './SinglePage';
import { EditPage } from './EditPage';
import { DeletePage } from './DeletePage';
import { Sidebar } from './Sidebar';

// import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {
	const [songs, setSongs] = useState([]);
	const [displayAddPage, setDisplayAddPage] = useState(false);
	const [displaySinglePage, setDisplaySinglePage] = useState(null);
	const [editing, setEditing] = useState(false);
	const [toEdit, setToEdit] = useState(null);
	const [deletePage, setDeletePage] = useState(null);

	async function fetchSongs() {
		try {
			const response = await fetch(`${apiURL}/songs`);
			const songsData = await response.json();
			setSongs(songsData);
		} catch (err) {
			console.log("Oh no an error in fetchSongs! ", err);
		}
	}

	async function fetchSingleSong(id) {
		try {
			const response = await fetch(`${apiURL}/songs/${id}`);
			const singleSongData = await response.json();
			setDisplaySinglePage(singleSongData);
		} catch (err) {
			console.log("Oh no an error in fetchSingleSong! ", err);
		}
	}

	function isEditing(song) {
		setEditing(!editing);
		setDisplaySinglePage(null);
		setToEdit(song);
		console.log(song);
	}

	useEffect(() => {
		fetchSongs();
	}, []);

	return (
		<main>
			<div>
				<Sidebar />
			</div>
			<div className='main'>
				{displayAddPage ? (
					<AddPage setDisplayAddPage={setDisplayAddPage} fetchSongs={fetchSongs} />
				) : displaySinglePage ? (
					<SinglePage isEditing={isEditing} setDeletePage={setDeletePage} fetchSongs={fetchSongs} displaySinglePage={displaySinglePage} setDisplaySinglePage={setDisplaySinglePage} />
				) : editing ? (
					<EditPage fetchSongs={fetchSongs} toEdit={toEdit} setEditing={setEditing} />
				) : deletePage ? (
					<DeletePage fetchSongs={fetchSongs} deletePage={deletePage} setDeletePage={setDeletePage} />
				) : (
					<>
						<SongList songs={songs} fetchSingleSong={fetchSingleSong} />
						<button onClick={() => setDisplayAddPage(true)}>Add Song</button>
					</>
				)}
			</div>
		</main>
	);
};
