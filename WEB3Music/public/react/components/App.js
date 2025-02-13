import React, { useState, useEffect } from 'react';
import { SongList } from './SongList';
import { AddPage } from './AddPage';
import { SinglePage } from './SinglePage';
import { EditPage } from './EditPage';
import { DeletePage } from './DeletePage';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import DisplaySong from './DisplaySong';

// Import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {
  const [songs, setSongs] = useState([]);
  const [displayAddPage, setDisplayAddPage] = useState(false);
  const [displaySinglePage, setDisplaySinglePage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [deletePage, setDeletePage] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    try {
      const response = await fetch(`${apiURL}/songs`);
      const songsData = await response.json();
      setSongs(songsData);
    } catch (err) {
      console.log("Oh no, an error occurred while fetching songs!", err);
    }
  }

  async function fetchSingleSong(id) {
    try {
      const response = await fetch(`${apiURL}/songs/${id}`);
      const singleSongData = await response.json();
      setDisplaySinglePage(singleSongData);
    } catch (err) {
      console.log("Oh no, an error occurred while fetching the single song!", err);
    }
  }

  function handleEdit(song) {
    setEditing(true);
    setDisplaySinglePage(null);
    setToEdit(song);
  }

  return (
    <main>
      <div>
        <Sidebar />
      </div>
      <div className="main">
        {displayAddPage ? (
          <AddPage setDisplayAddPage={setDisplayAddPage} fetchSongs={fetchSongs} />
        ) : displaySinglePage ? (
          <SinglePage
            handleEdit={handleEdit}
            setDeletePage={setDeletePage}
            fetchSongs={fetchSongs}
            displaySinglePage={displaySinglePage}
            setDisplaySinglePage={setDisplaySinglePage}
          />
        ) : editing ? (
          <EditPage fetchSongs={fetchSongs} toEdit={toEdit} setEditing={setEditing} />
        ) : deletePage ? (
          <DeletePage fetchSongs={fetchSongs} deletePage={deletePage} setDeletePage={setDeletePage} />
        ) : (
          <>
            <DisplaySong />
            <SongList songs={songs} fetchSingleSong={fetchSingleSong} />
            <button onClick={() => setDisplayAddPage(true)}>Add Song</button>
            <div>
              <h1 className="heading">All Songs</h1>
              {songs.map((song, index) => (
                <Card
                  key={index}
                  title={song.title}
                  price={song.price}
                  description={song.description}
                  image={song.image}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};
