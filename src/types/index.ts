export interface Client {
    id: string;
    name: string;
    country: string;
    email?: string;
  }
  
  export interface Project {
    id: string;
    clientId: string;
    title: string;
    budget: number;
    status: 'pending' | 'in-progress' | 'completed';
    paymentStatus: 'paid' | 'unpaid';
  }
  
  export interface Payment {
    projectId: string;
    amount: number;
    date: string; // ISO format
  }
  
  export interface AppState {
    clients: Client[];
    projects: Project[];
    payments: Payment[];
  }
  
  // Discriminated union for actions
  export type AppAction =
    | { type: 'ADD_CLIENT'; payload: Client }
    | { type: 'UPDATE_CLIENT'; payload: Client }
    | { type: 'ADD_PROJECT'; payload: Project }
    | { type: 'UPDATE_PROJECT'; payload: Project }
    | { type: 'MARK_PROJECT_PAID'; payload: { projectId: string; amount: number } }
    | { type: 'ADD_PAYMENT'; payload: Payment }
    | { type: 'DELETE_PROJECT'; payload: string }
    | { type: 'DELETE_CLIENT'; payload: string };
  
  export type ProjectStatus = Project['status'];
  export type PaymentStatus = Project['paymentStatus'];