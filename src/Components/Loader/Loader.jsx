// components/LoaderOverlay.js
import React, { useEffect } from 'react';
import './Loader.css'; // or wherever you added styles

const Loader = () => {
    useEffect(()=> {
        console.log('INSIDE LOADER')
    })
  return (
    <div className="loader-overlay">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
