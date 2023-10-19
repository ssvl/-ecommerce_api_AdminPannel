import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Componets/Header';
import Sidebar from './Componets/Sidebar';
import Category from './Componets/Category/Category';
import CategoryModal from './Componets/Category/CategoryModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubCategoryGet from './Componets/Category/SubCategoryGet';
import GetProduct from './Componets/Category/GetProduct';
import DashBoard from './Componets/Category/DashBoard';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <Router>
      <div className="App">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
        <Sidebar isDarkMode={isDarkMode} />
        <CategoryModal isDarkMode={isDarkMode}/>
        <div className='demo ml-64'>
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
          <Routes >
            <Route path="/" element={<DashBoard />} /> 
            <Route path="/category" element={<Category/>} />
            <Route path="/subcategory" element={<SubCategoryGet isDarkMode={isDarkMode}/>} />
            <Route path="/getproduct" element={<GetProduct isDarkMode={isDarkMode}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
