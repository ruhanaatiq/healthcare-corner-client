export const redirectByRole = async (email, axios, navigate) => {
  try {
    const res = await axios.get(`/users/role/${email}`);
    const role = res.data?.role;

    console.log('Redirecting role:', role); // ✅ moved inside try block

    if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (role === 'seller') {
      navigate('/seller-dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true }); // simplified user route
    }
  } catch (err) {
    console.error('Failed to redirect based on role:', err);
    navigate('/'); // fallback
  }
};
