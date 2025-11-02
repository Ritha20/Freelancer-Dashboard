import React from 'react';
import { Payment } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../Utils/helpers';

const PaymentHistory: React.FC = () => {
  const { state } = useAppContext();

  const paymentsWithDetails = state.payments.map(payment => {
    const project = state.projects.find(p => p.id === payment.projectId);
    const client = project ? state.clients.find(c => c.id === project.clientId) : undefined;

    return {
      ...payment,
      projectTitle: project?.title || 'Project not found',
      clientName: client?.name || 'Client not found'
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalReceived = state.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
        <div className="text-lg font-semibold text-green-600">
          Total Received: {formatCurrency(totalReceived)}
        </div>
      </div>

      {paymentsWithDetails.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentsWithDetails.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.projectTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No payment records found.
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;