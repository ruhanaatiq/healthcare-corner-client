import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminSalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: sales = [], refetch } = useQuery({
    queryKey: ['sales-report', startDate, endDate],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/sales-report', {
        params: { startDate, endDate }
      });
      return res.data;
    },
    enabled: !!startDate && !!endDate,
  });

  const handleFilter = () => {
    if (startDate && endDate) refetch();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 14, 10);

    const tableData = sales.map((sale, index) => [
      index + 1,
      sale.items[0]?.name,
      sale.items[0]?.sellerEmail || 'N/A',
      sale.userName,
      `$${sale.total.toFixed(2)}`,
      sale.paymentId,
      new Date(sale.createdAt).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [['#', 'Medicine', 'Seller Email', 'Buyer', 'Total', 'Payment ID', 'Date']],
      body: tableData,
      startY: 20,
    });

    doc.save('sales-report.pdf');
  };

  const csvHeaders = [
    { label: "Medicine", key: "items[0].name" },
    { label: "Seller Email", key: "items[0].sellerEmail" },
    { label: "Buyer", key: "userName" },
    { label: "Total", key: "total" },
    { label: "Payment ID", key: "paymentId" },
    { label: "Date", key: "createdAt" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-red-800">Sales Report</h2>

      {/* Filter Section */}
      <div className="flex gap-4 items-center mb-4 flex-wrap">
        <input
          type="date"
          className="input input-bordered"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleFilter}>
          Filter
        </button>

        {sales.length > 0 && (
          <>
            <CSVLink
              data={sales}
              headers={csvHeaders}
              filename={"sales-report.csv"}
              className="btn btn-accent"
            >
              Export CSV
            </CSVLink>

            <button onClick={exportPDF} className="btn btn-secondary">
              Export PDF
            </button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className='text-red-800'>
              <th>#</th>
              <th>Medicine</th>
              <th>Seller</th>
              <th>Buyer</th>
              <th>Total</th>
              <th>Payment ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, idx) => (
              <tr key={sale._id}>
                <td>{idx + 1}</td>
                <td>{sale.items[0]?.name}</td>
                <td>{sale.items[0]?.sellerEmail || 'N/A'}</td>
                <td>{sale.userName}</td>
                <td>${sale.total.toFixed(2)}</td>
                <td>{sale.paymentId}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesReport;
