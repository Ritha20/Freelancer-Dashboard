import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, Client, Project, Payment } from '../types';

// Initial state with example data
const initialState: AppState = {
  clients: [
    {
      id: '1',
      name: 'Acme Corp',
      country: 'USA',
      email: 'contact@acme.com'
    },
    {
      id: '2',
      name: 'Global Tech',
      country: 'UK',
      email: 'info@globaltech.com'
    }
  ],
  projects: [
    {
      id: '1',
      clientId: '1',
      title: 'E-commerce Website',
      budget: 5000,
      status: 'in-progress',
      paymentStatus: 'unpaid'
    },
    {
      id: '2',
      clientId: '2',
      title: 'Mobile App',
      budget: 8000,
      status: 'completed',
      paymentStatus: 'paid'
    }
  ],
  payments: [
    {
      projectId: '2',
      amount: 8000,
      date: '2024-01-15T00:00:00.000Z'
    }
  ]
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload]
      };

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };

    case 'MARK_PROJECT_PAID':
      const { projectId, amount } = action.payload;
      const today = new Date().toISOString();
      
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === projectId
            ? { ...project, paymentStatus: 'paid' }
            : project
        ),
        payments: [
          ...state.payments,
          {
            projectId,
            amount,
            date: today
          }
        ]
      };

    case 'ADD_PAYMENT':
      return {
        ...state,
        payments: [...state.payments, action.payload],
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, paymentStatus: 'paid' }
            : project
        )
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        payments: state.payments.filter(payment => payment.projectId !== action.payload)
      };

    case 'DELETE_CLIENT':
      const clientId = action.payload;
      const clientProjects = state.projects.filter(project => project.clientId === clientId);
      const projectIds = clientProjects.map(project => project.id);
      
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== clientId),
        projects: state.projects.filter(project => project.clientId !== clientId),
        payments: state.payments.filter(payment => !projectIds.includes(payment.projectId))
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}