import { Client, Project, Payment, AppState, ProjectStatus, PaymentStatus } from '../types';

// Count paid vs unpaid projects
export function countPaymentStatus(projects: Project[]): { paid: number; unpaid: number } {
  return projects.reduce(
    (counts, project) => {
      if (project.paymentStatus === 'paid') {
        counts.paid++;
      } else {
        counts.unpaid++;
      }
      return counts;
    },
    { paid: 0, unpaid: 0 }
  );
}

// Find client by ID safely with type narrowing
export function findClientById(clients: Client[], clientId: string): Client | undefined {
  return clients.find(client => client.id === clientId);
}

// Safe client access with error handling
export function getClientName(clients: Client[], clientId: string): string {
  const client = findClientById(clients, clientId);
  return client ? client.name : 'Client not found';
}

// Record a new payment with validation
export function recordPayment(
  projectId: string,
  amount: number,
  existingPayments: Payment[]
): Payment {
  if (amount <= 0) {
    throw new Error('Payment amount must be positive');
  }

  const existingPayment = existingPayments.find(payment => payment.projectId === projectId);
  if (existingPayment) {
    throw new Error('Payment already exists for this project');
  }

  return {
    projectId,
    amount,
    date: new Date().toISOString()
  };
}

// Filter projects by status or payment state
export function filterProjects(
  projects: Project[],
  filters: {
    status?: ProjectStatus;
    paymentStatus?: PaymentStatus;
    clientId?: string;
  }
): Project[] {
  return projects.filter(project => {
    if (filters.status && project.status !== filters.status) return false;
    if (filters.paymentStatus && project.paymentStatus !== filters.paymentStatus) return false;
    if (filters.clientId && project.clientId !== filters.clientId) return false;
    return true;
  });
}

// Search clients or projects by name
export function searchEntities<T extends Client | Project>(
  entities: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) return entities;

  return entities.filter(entity =>
    'name' in entity
      ? entity.name.toLowerCase().includes(searchTerm.toLowerCase())
      : entity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Dashboard statistics
export function getDashboardStats(state: AppState) {
  const paymentCounts = countPaymentStatus(state.projects);
  const totalBudget = state.projects.reduce((sum, project) => sum + project.budget, 0);
  const paidAmount = state.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalProjects: state.projects.length,
    totalClients: state.clients.length,
    paidProjects: paymentCounts.paid,
    unpaidProjects: paymentCounts.unpaid,
    totalBudget,
    paidAmount,
    pendingAmount: totalBudget - paidAmount
  };
}

// Conditional styling helpers
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'unpaid':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Generic utility for formatting currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Generic utility for formatting date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}