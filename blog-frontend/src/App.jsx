import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import AdminPanel from './Components/AdminPage';
import NotFound from './Components/NotFound';
import { useEffect } from 'react';
import Login from './Components/login';
import { checkTokenValidity, createGuestToken } from './utils/checktoken';
import { PermissionCheck } from './utils/authMiddleware';


function App() {

  useEffect(() => {

    const handleToken = async () => {
      const token = localStorage.getItem('Access-Token');
      let isValid = false;
      if (token) {
        isValid = await checkTokenValidity(token);
      }

      if (!isValid) {
        localStorage.setItem('Access-Token', await createGuestToken());
      }
    };

    handleToken();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={
              <PermissionCheck>
                <AdminPanel />
              </PermissionCheck>
            }
          />
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App
