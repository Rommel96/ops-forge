import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { LoginView } from './views/LoginView';
import { TaskListView } from './views/TaskListView';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskListView />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
