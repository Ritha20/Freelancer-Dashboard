import React from 'react';
import { getDashboardStats, formatCurrency } from '../Utils/helpers';
import { useAppContext } from '../context/AppContext';

const DashboardStats: React.FC = () => {
  const { state } = useAppContext();
  const stats = getDashboardStats(state);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      color: 'bg-blue-500',
      icon: '📊'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      color: 'bg-green-500',
      icon: '👥'
    },
    {
      title: 'Paid Projects',
      value: stats.paidProjects.toString(),
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      title: 'Unpaid Projects',
      value: stats.unpaidProjects.toString(),
      color: 'bg-red-500',
      icon: '⏳'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(stats.totalBudget),
      color: 'bg-purple-500',
      icon: '💰'
    },
    {
      title: 'Amount Received',
      value: formatCurrency(stats.paidAmount),
      color: 'bg-green-500',
      icon: '💳'
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount),
      color: 'bg-orange-500',
      icon: '⌛'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className={`${stat.color} rounded-lg p-3 mr-4`}>
              <span className="text-white text-xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;