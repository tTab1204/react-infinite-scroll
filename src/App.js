import React, { useState, useEffect, useRef } from "react";

function App() {
  const [photos, setPhotos] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async (pageNumber) => {
    const Access_Key = "iOOKJmk8zMEN0F669eIjXdgQYAIMtrgQoHrurWHrfQI";
    const res = await fetch(
      `https://api.unsplash.com/photos/?client_id=${Access_Key}&page=${pageNumber}&per_page=10`
    );
    const data = await res.json();

    setPhotos((p) => [...p, ...data]);
    setLoading(true);
  };

  const pageEnd = useRef();
  let num = 1;

  useEffect(() => {
    if (loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            num++;
            loadMore();
            if (num >= 10) observer.unobserve(pageEnd.current);
          }
        },
        { threshold: 1 }
      );
      observer.observe(pageEnd.current);
    }
  }, [loading, num]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  useEffect(() => {
    fetchPhotos(pageNumber);
  }, [pageNumber]);

  return (
    <div className="App">
      <h1>Infinite scrolling react hooks</h1>
      {photos.map((photo, index) => (
        <div className="photos" key={index}>
          <img src={photo.urls.small} alt="" />
          <p>{photo.user.first_name + " " + photo.user.last_name}</p>
          <span>Like: {photo.user.total_likes} </span>
        </div>
      ))}
      <div className="loading">Loading....</div>
      <h3>{photos.length}</h3>

      <button onClick={loadMore} ref={pageEnd}>
        Load More
      </button>
    </div>
  );
}

export default App;
