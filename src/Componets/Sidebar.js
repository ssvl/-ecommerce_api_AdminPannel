// Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="h-screen flex ">
            <div className="bg-gradient-to-b from-[#3f51b5] via-[#3f51b5] to-[#2c3e50] w-64 lg:flex lg:flex-col overflow-y-auto shadow-lg">
                <div className="flex-col pt-5 flex overflow-y-hidden">
                    <div className="h-full flex-col justify-between px-4 flex">
                        <div className="space-y-4 mt-16">
                            <ul className="space-y-2">
                            <li>
                                    <Link
                                        to="/"
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 block transition-all duration-200 ${location.pathname === '/' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : ' text-white'
                                            }`}
                                    >
                                      DashBoard
                                    </Link>

                                </li>
                                <li>
                                    <Link
                                        to="/category"
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 block transition-all duration-200 ${location.pathname === '/category' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : ' text-white'
                                            }`}
                                    >
                                        Category
                                    </Link>

                                </li>
                                <li>
                                    <Link
                                        to="/subcategory"
                                        className={`font-bold text-white rounded-lg px-4 py-2.5 block transition-all duration-200 ${location.pathname === '/subcategory' ? ' bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : 'text-white'
                                            }`}
                                    >
                                        Sub Category
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/getproduct"
                                        className={`font-bold text-white rounded-lg px-4 py-2.5 block transition-all duration-200 ${location.pathname === '/getproduct' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : 'text-white'
                                            }`}
                                    >
                                        Product
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
