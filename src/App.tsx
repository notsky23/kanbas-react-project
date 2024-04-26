import './App.css';
import Kanbas from './Kanbas';
import { HashRouter } from 'react-router-dom';
import {Routes, Route, Navigate} from "react-router";
import { AuthProvider } from './Users/AuthContext';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/Kanbas" /> } />
            <Route path="/Kanbas/*" element={<Kanbas/>} />
          </Routes>
        </div>
      </AuthProvider>
    </HashRouter>
    
  );
}

export default App;
