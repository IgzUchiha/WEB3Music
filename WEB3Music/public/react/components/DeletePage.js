import React, { useState, useEffect } from "react";

import apiURL from '../api';

export const DeletePage = ({
  deletePage: deletePage,
  setDeletePage: setDeletePage,
  fetchSongs: fetchSongs,
  fetchSauces:fetchSauces
}) => {

async function deleteSong(id){
    const response = await fetch(`${apiURL}/songs/${id}`, {
        method: 'DELETE'
    })
    fetchSongs()
    setDeletePage(null)
    const data = await response.json()
    console.log(data)
}
  return <>
    <h1>Are You Sure You Want to Delete this</h1>
    <button onClick={() => deletePage.title? deleteSong(deletePage.id):deleteSong(deletePage.id)}>Yes</button>
    <button onClick={() => setDeletePage(null)}>No</button>


  </>;
};
