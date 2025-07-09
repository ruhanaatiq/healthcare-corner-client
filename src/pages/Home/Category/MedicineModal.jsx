import React from 'react';

const MedicineModal = ({ medicine, closeModal }) => {
  if (!medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          onClick={closeModal}
          className="text-red-500 absolute top-2 right-2 text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">{medicine.name}</h2>
        <img
          src={medicine.imageUrl || 'https://via.placeholder.com/150'}
          alt={medicine.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <p>{medicine.description || 'No description available.'}</p>
        <p className="font-semibold text-lg mt-2">
          Price: ${medicine.price}
        </p>
      </div>
    </div>
  );
};

export default MedicineModal;
