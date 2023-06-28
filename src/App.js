import './App.css';
import Signup from './Components/Signup';
import { Container } from 'react-bootstrap'
import { AuthProvieder } from './contexts/AuthContext';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
          <Container 
            className='d-flex align-items-center justify-content-center'
            style={{minHeight:'100vh'}}>
            <div className='w-100' >
            <BrowserRouter>
              <AuthProvieder>
                {/* <Signup /> */}
                <Routes>
                <Route path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                    ></Route>
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/login' element={<Login />} />
                </Routes>
              </AuthProvieder>
            </BrowserRouter>
            </div>
          </Container>
  );
}
export default App;