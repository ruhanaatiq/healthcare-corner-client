export const redirectByRole = async (email, axios, navigate) => {
  try {
    const res = await axios.get(`/api/users/role/${email}`);
    const role = res.data?.role;
    console.log("Redirecting role:", role);

    if (role === 'admin') {
      navigate('/dashboard/admin', { replace: true });
    } else if (role === 'seller') {
      navigate('/dashboard/seller', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  } catch (err) {
    console.error('Failed to redirect based on role:', err);
    navigate('/'); // fallback
  }
};
