import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const axiosSecure = useAxiosSecure(); // baseURL should end with /api
  const queryClient = useQueryClient();

  // Fetch users list (adjust this path if your backend differs)
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users'); // -> /api/users
      return res.data;
    },
    staleTime: 30_000,
    retry: (failureCount, err) => {
      const s = err?.response?.status;
      if ([401, 403, 404].includes(s)) return false;
      return failureCount < 2;
    },
  });

  // Update role by EMAIL to match your backend
  const updateRole = useMutation({
    mutationFn: ({ email, role }) =>
      axiosSecure.patch(`/users/promote/${encodeURIComponent(email)}`, { role }),
    // optimistic update
    onMutate: async ({ email, role }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old = []) =>
        old.map(u => (u.email === email ? { ...u, role } : u))
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['users'], ctx.previous);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update role';
      toast.error(msg);
      console.error('Update role error:', err?.response?.status, msg);
    },
    onSuccess: () => toast.success('Role updated'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const handleRoleChange = (email, role) => {
    updateRole.mutate({ email, role });
  };

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (isError) {
    const status = error?.response?.status;
    const url = (error?.config?.baseURL || '') + (error?.config?.url || '');
    console.error('Users query error:', status, url, error?.response?.data || error?.message);
    return (
      <div className="p-6 text-red-600">
        <b>Failed to load users.</b>
        <div className="text-sm mt-1">{String(error?.response?.data?.message || error?.message)}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Manage Users &amp; Roles</h2>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Current Role</th>
            <th className="p-2 border">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const isRowUpdating =
              updateRole.isPending && updateRole.variables?.email === user.email;

            return (
              <tr key={user._id || user.email}>
                <td className="p-2 border text-red-500">{user.name || '-'}</td>
                <td className="p-2 border text-red-500">{user.email}</td>
                <td className="p-2 border capitalize text-red-500">{user.role || 'user'}</td>
                <td className="p-2 border">
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user.email, e.target.value)}
                    className="border rounded px-2 py-1 text-red-500"
                    disabled={isRowUpdating}
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                  {isRowUpdating && <span className="ml-2 text-sm">Saving…</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
