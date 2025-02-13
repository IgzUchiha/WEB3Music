import React from 'react';

const Song = ({ title, price, description, image }) => {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="card-body">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>Price: ${price}</p>
      </div>
    </div>
  );
};

export default Song;
