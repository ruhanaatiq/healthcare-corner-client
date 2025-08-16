import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [userInfo, setUserInfo] = useState(null);
  const [payments, setPayments] = useState([]);
  const [editableName, setEditableName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

 useEffect(() => {
  const fetchUserData = async () => {
    if (user?.email) {
      const roleRes = await axiosSecure.get(`/users/role/${user.email}`);
      const userData = { ...user, role: roleRes.data.role };
      setUserInfo(userData);
      setEditableName(user.displayName || user.name || '');
      setPhotoURL(user.photoURL || '');

      const paymentRes = await axiosSecure.get('/payments');
      const userPayments = paymentRes.data.filter(p => p.userEmail === user.email);
      setPayments(userPayments);
    }
  };

  fetchUserData(); // 👈 Call the async function
}, [user, axiosSecure]);


  const handleSaveProfile = async () => {
    try {
      const updated = {
        name: editableName,
        photoURL
      };
      await axiosSecure.patch(`/users/promote/${user.email}`, updated);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment History", 14, 10);
    autoTable(doc, {
      head: [['Amount ($)', 'Status', 'Date']],
      body: payments.map(p => [
        p.total.toFixed(2),
        p.status,
        new Date(p.createdAt).toLocaleDateString()
      ])
    });
    doc.save('payment-history.pdf');
  };

  const paidCount = payments.filter(p => p.status === 'paid').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-700">My Profile</h2>

      {userInfo && (
        <div className="bg-white p-4 rounded shadow mb-6 text-red-800">
          <img src={photoURL || '/default-avatar.png'} alt="User" className="w-20 h-20 rounded-full mb-3" />
          <div className="mb-2">
            <label>Name:</label>
            <input
              className="input input-bordered w-full max-w-sm bg-amber-50"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Email:</label>
            <p>{userInfo.email}</p>
          </div>
          <div className="mb-2">
            <label>Role:</label>
            <p>{userInfo.role}</p>
          </div>
          <div className="mb-4">
            <label>Photo URL:</label>
            <input
              className="input input-bordered w-full max-w-sm bg-amber-50"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </div>
          <button onClick={handleSaveProfile} className="btn btn-primary">Save Profile</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow text-center text-black">
          <p className="text-lg font-bold">{payments.length}</p>
          <p>Total Orders</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center text-black">
          <p className="text-lg font-bold">{paidCount}</p>
          <p>Paid</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center text-black">
          <p className="text-lg font-bold">{pendingCount}</p>
          <p>Pending</p>
        </div>
      </div>

      {/* Payment History */}
      <h3 className="text-xl font-semibold mb-2 text-red-600">Payment History</h3>
      <button className="btn btn-outline mb-3 bg-red-700" onClick={downloadPDF}>Download PDF</button>
      <table className="table-auto w-full border">
        <thead className="bg-red-700">
          <tr>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody className='text-red-700'>
          {payments.map(p => (
            <tr key={p._id}>
              <td className="border px-4 py-2">${p.total.toFixed(2)}</td>
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateProfile;
