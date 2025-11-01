import React, { useState } from 'react';
import { Project, ProjectStatus, PaymentStatus } from '../types';
import { getStatusColor, formatCurrency, getClientName } from '../Utils/helpers';
import { useAppContext } from '../context/AppContext';

interface ProjectListProps {
  projects: Project[];
  showClientName?: boolean;
  onStatusChange?: (projectId: string, status: ProjectStatus) => void;
  onMarkAsPaid?: (projectId: string, amount: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  showClientName = true,
  onStatusChange,
  onMarkAsPaid
}) => {
  const { state, dispatch } = useAppContext();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && project.paymentStatus !== paymentFilter) return false;
    return true;
  });

  const handleMarkAsPaid = (projectId: string, amount: number) => {
    if (onMarkAsPaid) {
      onMarkAsPaid(projectId, amount);
    } else {
      dispatch({
        type: 'MARK_PROJECT_PAID',
        payload: { projectId, amount }
      });
    }
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    if (onStatusChange) {
      onStatusChange(projectId, newStatus);
    } else {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        dispatch({
          type: 'UPDATE_PROJECT',
          payload: { ...project, status: newStatus }
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                {showClientName && (
                  <p className="text-gray-600 text-sm mt-1">
                    Client: {getClientName(state.clients, project.clientId)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(project.budget)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.paymentStatus)}`}>
                  {project.paymentStatus}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Status Change Dropdown */}
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project.id, e.target.value as ProjectStatus)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Mark as Paid Button */}
                {project.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => handleMarkAsPaid(project.id, project.budget)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No projects found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;