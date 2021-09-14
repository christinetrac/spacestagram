import './App.css';
import React, { useEffect, useState } from "react";
import Masonry from 'react-masonry-css';
import loader from './loader.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as outlineHeart } from '@fortawesome/free-regular-svg-icons'

function App() {
  const [imageData, setImageData] = useState([]);
  const [likedImagesList, setLikedImagesList] = useState([]);

  //fetching the data from NASA api and populating imageData state
  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=kJizNaBpK4kVUlb6fq7MqQuPNT4KR8G21rMp56r9&start_date=2018-01-05&end_date=2018-05-05')
        .then(response => response.json())
        .then(json => setImageData(json))
        .catch(error => console.log(error));
  }, []);

  //set likedImagesList state once when component mounts, then whenever storage is changed
  useEffect(() => {
      const checkData = () => {
          const storedLikedImages = localStorage.getItem('spacestagram');
          if(storedLikedImages) setLikedImagesList(JSON.parse(storedLikedImages));
      };
      checkData();

      window.addEventListener('storage', checkData);

      return () => {
          window.removeEventListener("storage", checkData);
      };
  }, []);

  //update the storage and likedImagesList state when a user likes/unlikes an image
  const handleLike = (date) => {
      let likedImages = localStorage.getItem('spacestagram');
      if(likedImages === null) likedImages = [];
      if(likedImages.includes(date)) {
          likedImages = JSON.parse(likedImages);
          likedImages = likedImages.filter(value => value !== date);
      } else {
          if(likedImages.length) likedImages = JSON.parse(likedImages);
          likedImages = [...likedImages, date];
      }
      setLikedImagesList(likedImages);
      localStorage.setItem('spacestagram', JSON.stringify(likedImages));
  };

  //check if an image is liked
  const isImageLiked = (date) => {
    return likedImagesList?.includes(date);
  };

  const cards = () => {
      return (
          imageData.length ? (
              <Masonry
                  breakpointCols={3}
                  className="cardsGroup"
                  columnClassName="cardsColumn">
                  {imageData?.map(image =>
                      image.url.slice(-3) === 'jpg' &&
                          <div className="card">
                              <img className="cardImage" src={image.url} alt={image.title}/>
                              <div className="cardInfo">
                                  <div className="cardTitle">{image.title}</div>
                                  <div className="cardText">{image.explanation}</div>
                                  <div className="tagsGroup">
                                      {isImageLiked(image.date) ? (
                                          <div className="cardOutlineHeart" onClick={() => handleLike(image.date)}>
                                              <FontAwesomeIcon icon={solidHeart} size="lg" color="#FC636B" />
                                          </div>
                                      ) : (
                                          <div className="cardOutlineHeart" onClick={() => handleLike(image.date)}>
                                              <FontAwesomeIcon icon={outlineHeart} size="lg" color="#A9A9A9" />
                                          </div>
                                      )}
                                      <div className="cardDate">{image.date}</div>
                                  </div>
                              </div>
                          </div>
                  )}
              </Masonry>
          ) : (
              <img className="loader" src={loader} alt="loading..."/>
          )
      )
  };

  return (
    <div className="App">
      <div className="header">SPACESTAGRAM</div>
      {cards()}
    </div>
  );
}

export default App;
