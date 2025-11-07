import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/profile" />} />

        {/* Profile by username */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
