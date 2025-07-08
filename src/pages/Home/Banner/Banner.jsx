import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Banner = () => {
  const [bannerMedicines, setBannerMedicines] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Fetching the medicines for the banner
  useEffect(() => {
    const fetchBannerMedicines = async () => {
      try {
        const response = await axios.get('/api/medicines');
        console.log("Response from backend:", response.data);

        // Ensure response.data is an array and filter out the banner medicines
        if (Array.isArray(response.data)) {
          const bannerMedicines = response.data.filter(medicine => medicine.isBanner);
          setBannerMedicines(bannerMedicines);
        } else {
          console.error("Expected response.data to be an array, but got:", typeof response.data);
        }
      } catch (error) {
        console.error("Error fetching banner medicines:", error);
        setError('Failed to fetch banner medicines');
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchBannerMedicines();
  }, []);

  if (loading) {
    return <div className="text-center text-white p-4">Loading banner medicines...</div>;
  }

  if (error) {
    return <div className="text-center text-white p-4">{error}</div>;
  }

  return (
    <div className="carousel w-full">
      {bannerMedicines.length > 0 ? (
        bannerMedicines.map(medicine => (
          <div key={medicine._id} className="carousel-item w-full relative">
            <img 
              src={medicine.imageUrl || 'https://via.placeholder.com/150'} 
              alt={medicine.name} 
              className="w-full h-60 object-cover"
            />
            <div className="carousel-caption absolute bottom-0 left-0 w-full p-4 bg-opacity-50 bg-black text-white">
              <h2 className="text-xl font-bold">{medicine.name}</h2>
              <p>{medicine.description}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-white p-4">No medicines in the banner.</div>
      )}
    </div>
  );
};

export default Banner;
