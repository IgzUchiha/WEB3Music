import React, { useState } from 'react';
import apiURL from '../api';

export const AddPage = ({ setDisplayAddPage, fetchItems, fetchSauces, fetchSongs  }) => {
    const [title, setTitle] = useState('');
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')


    const handleSubmit = async (ev) => {
        const songData={
            title: title,
            price: price,
            description:description,
            category:category,
            image:image
        }
        event.preventDefault()
        console.log('song submitted')
        const response = await fetch(`${apiURL}/songs`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                songData)
        });
        const data = await response.json();
        setDisplayAddPage(false);
        fetchSongs(data)
    }
    
    return (
        <>
            <h1>Add Something!</h1>
            <br></br>
            <form onSubmit={() => handleSubmit()}>
                <h2>Add Song</h2>
                <input type="text" placeholder='Name'
                    value={name} onChange={(ev) => setName(ev.target.value)} />
                <input type="text" placeholder='Image'
                    value={image} onChange={(ev) => setImage(ev.target.value)} />
                <button type='submit'> Submit</button>
            </form>
            <br></br>
            <form onSubmit={() => handleSubmit()}>
                <h2>Add Song</h2>
                <input type="text" placeholder='Title'
                    value={title} onChange={(ev) => setTitle(ev.target.value)} />
                <input type="text" placeholder='Price'
                    value={price} onChange={(ev) => setPrice(ev.target.value)} />
                <input type="text" placeholder='Description'
                    value={description} onChange={(ev) => setDescription(ev.target.value)} />
                <input type="text" placeholder='Category'
                    value={category} onChange={(ev) => setCategory(ev.target.value)} />
                <input type="text" placeholder='Image'
                    value={image} onChange={(ev) => setImage(ev.target.value)} />
                <button type='submit'> Submit</button>
            </form>
        </>
    )
}