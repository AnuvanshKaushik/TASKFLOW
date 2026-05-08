import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Tasks } from "./pages/Tasks";
import { Team } from "./pages/Team";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/auth/Login";
import { LoginChoice } from "./pages/auth/LoginChoice";
import { Register } from "./pages/auth/Register";
import { NotFound } from "./pages/NotFound";

export const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <LoginChoice />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/admin-login"
      element={
        <PublicOnlyRoute>
          <Login role="Admin" />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/member-login"
      element={
        <PublicOnlyRoute>
          <Login role="Member" />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicOnlyRoute>
          <Register />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="projects" element={<Projects />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="team" element={<Team />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
