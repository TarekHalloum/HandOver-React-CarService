import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingScanButton from './components/FloatingScanButton';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AIScan from './pages/AIScan';
import MyScans from './pages/MyScans';
import RegisterRepairer from './pages/RegisterRepairer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ScrollToTop from './components/ScrollToTop';
import GarageDashboard from './pages/GarageDashboard/GarageDashboard';
import NotFound from './pages/GarageDashboard/NotFound'; // Optional

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar /> {/* ✅ Always visible */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FloatingScanButton />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <FloatingScanButton />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/ai-scan"
          element={
            <>
              <FloatingScanButton />
              <AIScan />
              <Footer />
            </>
          }
        />
        <Route
          path="/my-scans"
          element={
            <>
              <FloatingScanButton />
              <MyScans />
              <Footer />
            </>
          }
        />
        <Route
          path="/register-repairer"
          element={<RegisterRepairer />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/repairer-dashboard"
          element={<GarageDashboard />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
