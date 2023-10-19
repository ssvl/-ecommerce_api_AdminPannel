import React, { useState, useEffect } from 'react';
import { FaBeer,FaList , FaRegListAlt ,FaTshirt} from 'react-icons/fa'; 


const GET_ALL_DATA_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductWidget = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${GET_ALL_DATA_API_BASE_URL}/alldatacount`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('API call error:', error));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
            <ProductCard title="Category" value={data?.totalCategories} icon={<FaList />} />
            <ProductCard title="Sub Category" value={data?.totalSubcategories} icon={<FaRegListAlt />} />
            <ProductCard title="Product" value={data?.totalProducts} icon={<FaTshirt />}  />
        </div>
    );
};

const ProductCard = ({ title, value, icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-lg relative">
    <div className="flex ">
        <div className="w-16 h-16 text-3xl text-white bg-blue-400 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div className="ml-4 ">
            <div className=''>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-xl font-bold text-gray-700 mt-1">{value ?? 'Loading...'}</p>
            </div>
        </div>
    </div>
    <div className="absolute top-0 right-0 h-full w-2 bg-[#C3B1E1] rounded-tr-lg rounded-br-lg"></div>
    </div>
);

export default ProductWidget;
