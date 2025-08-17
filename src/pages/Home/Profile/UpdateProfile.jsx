import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { jsPDF } from 'jspdf';              // ✅ named import
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
  const { user, updateUserProfile } = useAuth();     // ✅ make sure your AuthContext exposes this
  const axiosSecure = useAxiosSecure();

  const [userInfo, setUserInfo] = useState(null);
  const [payments, setPayments] = useState([]);
  const [editableName, setEditableName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!user?.email) return;
      try {
        // 1) fetch role
        const roleRes = await axiosSecure.get(`/users/role/${encodeURIComponent(user.email)}`);
        const mergedUser = { ...user, role: roleRes.data?.role ?? 'user' };
        if (!ignore) {
          setUserInfo(mergedUser);
          setEditableName(user.displayName || user.name || '');
          setPhotoURL(user.photoURL || '');
        }

        // 2) fetch only this user's payments
        const payRes = await axiosSecure.get('/payments', { params: { email: user.email } });
        if (!ignore) setPayments(Array.isArray(payRes.data) ? payRes.data : []);
      } catch (err) {
        console.error('Profile load error:', err?.response?.status, (err?.config?.baseURL || '') + (err?.config?.url || ''), err?.response?.data || err?.message);
        toast.error('Failed to load profile data');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [user, axiosSecure]);

  const handleSaveProfile = async () => {
    if (!user?.email) return;
    try {
      // A) Update Firebase auth profile (so UI sees new displayName/photo immediately)
      if (typeof updateUserProfile === 'function') {
        await updateUserProfile({ displayName: editableName, photoURL });
      }

      // B) Update your DB user document (needs a backend route: PATCH /api/users/:email)
      await axiosSecure.patch(`/users/${encodeURIComponent(user.email)}`, {
        name: editableName,
        photoURL,
      });

      setUserInfo(prev => prev ? { ...prev, displayName: editableName, photoURL } : prev);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Update profile error:', err?.response?.status, err?.response?.data || err?.message);
      toast.error('Update failed');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Payment History', 14, 12);
    autoTable(doc, {
      head: [['Amount ($)', 'Status', 'Date']],
      body: payments.map(p => [
        Number(p?.total || 0).toFixed(2),
        p?.status ?? '-',
        p?.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-',
      ]),
      startY: 18,
    });
    doc.save('payment-history.pdf');
  };

  const paidCount = payments.filter(p => p?.status === 'paid').length;
  const pendingCount = payments.filter(p => p?.status === 'pending').length;

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-700">My Profile</h2>

      {userInfo && (
        <div className="bg-white p-4 rounded shadow mb-6 text-red-800">
          <img
            src={photoURL || '/default-avatar.png'}
            alt="User"
            className="w-20 h-20 rounded-full mb-3 object-cover"
          />

          <div className="mb-2">
            <label className="block font-medium mb-1">Name:</label>
            <input
              className="input input-bordered w-full max-w-sm bg-amber-50"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Email:</label>
            <p>{userInfo.email}</p>
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Role:</label>
            <p className="capitalize">{userInfo.role}</p>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Photo URL:</label>
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
      <button className="btn btn-outline mb-3 bg-red-700" onClick={downloadPDF}>
        Download PDF
      </button>

      <table className="table-auto w-full border">
        <thead className="bg-red-700 text-white">
          <tr>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody className="text-red-700">
          {payments.map((p) => (
            <tr key={p._id}>
              <td className="border px-4 py-2">${Number(p?.total || 0).toFixed(2)}</td>
              <td className="border px-4 py-2">{p?.status ?? '-'}</td>
              <td className="border px-4 py-2">{p?.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateProfile;
