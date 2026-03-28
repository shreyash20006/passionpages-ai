import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chat from "./pages/Chat";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import SavedNotes from "./pages/SavedNotes";
import Pricing from "./pages/Pricing";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardLayout from "./components/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ModelProvider } from "./context/ModelContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ModelProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              {/* Public Landing Page as Root */}
              <Route path="/" element={<Landing />} />
              
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Pricing Page (Standalone page) */}
              <Route path="/pricing" element={<Pricing />} />

              {/* Dashboard Routes wrapped in DashboardLayout */}
              <Route
                path="/dashboard"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/chat"
                element={
                  <DashboardLayout>
                    <Chat />
                  </DashboardLayout>
                }
              />
              <Route
                path="/upload"
                element={
                  <DashboardLayout>
                    <Upload />
                  </DashboardLayout>
                }
              />
              <Route
                path="/results"
                element={
                  <DashboardLayout>
                    <Results />
                  </DashboardLayout>
                }
              />
              <Route
                path="/saved"
                element={
                  <DashboardLayout>
                    <SavedNotes />
                  </DashboardLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <DashboardLayout>
                    <DashboardSettings />
                  </DashboardLayout>
                }
              />

              {/* Catch-all for other sidebar links to show Dashboard for now */}
              <Route
                path="*"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Router>
      </ModelProvider>
    </AuthProvider>
  );
}
