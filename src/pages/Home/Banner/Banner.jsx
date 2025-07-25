

import React, { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios';

const Banner = () => {
  const axios = useAxios();
  const [bannerMedicines, setBannerMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBannerMedicines = async () => {
      try {
       const res = await axios.get('/medicines');
        const filtered = res.data?.filter(med => med.isBanner === true);
        setBannerMedicines(filtered);
      } catch (err) {
        console.error('Error fetching banner medicines:', err);
        setError('Failed to fetch banner medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerMedicines();
  }, [axios]);

  if (loading) return <div className="text-center p-4">Loading banner...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="carousel w-full h-64 rounded-lg overflow-hidden">
      {bannerMedicines.length > 0 ? (
        bannerMedicines.map((medicine, index) => (
          <div
            key={medicine._id}
            id={`slide${index}`}
            className="carousel-item relative w-full"
          >
            <img
              src={medicine.imageUrl || 'https://via.placeholder.com/800x300'}
              alt={medicine.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-4">
              <h2 className="text-xl font-bold">{medicine.name}</h2>
              <p className="text-sm">{medicine.description}</p>
            </div>

            {/* Navigation buttons */}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
              <a
                href={`#slide${(index - 1 + bannerMedicines.length) % bannerMedicines.length}`}
                className="btn btn-circle btn-sm"
              >
                ❮
              </a>
              <a
                href={`#slide${(index + 1) % bannerMedicines.length}`}
                className="btn btn-circle btn-sm"
              >
                ❯
              </a>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 w-full h-64 flex items-center justify-center">
         Trying to load available banner medicines 
        </div>
      )}
    </div>
  );
};

export default Banner;

