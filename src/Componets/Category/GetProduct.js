import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTrash, FaEdit, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import ProductModal from './ProductModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GET_PRO_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const GetProduct = ({ isDarkMode, setIsDarkMode }) => {
    const [proShowModal, setProShowModal] = useState(false);
    const [product, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [idSortDirection, setIdSortDirection] = useState('asc');
    const [categoryNameSortDirection, setCategoryNameSortDirection] = useState('asc');
    const [searchQueryName, setSearchQueryName] = useState('');
    const [searchQueryPrice, setSearchQueryPrice] = useState('');
    const [searchDiscountPrice, setSearchDisCountPrice] = useState('')
    const [editMode, setEditMode] = useState(false);
    const [editedProduct, setEditedProduct] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    const [inputValue, setInputValue] = useState('');
    const [editItemId, setEditItemId] = useState(null);

    const shoproShowModal = () => {
        setProShowModal(false);
        setEditMode(false)
        setSelectedOption('')
    }

    const fetchProduct = (page = 1, limit = 5) => {
        fetch(`${GET_PRO_API_BASE_URL}/getAllProduct/${page}?limit=${limit}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data.result);
                setCurrentPage(data.page);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchProduct();
    }, []);


    //delete product 
    const deleteProduct = (subCategoryId) => {
        console.log(`Deleting product with subCategoryId: ${subCategoryId}`);

        fetch(`${GET_PRO_API_BASE_URL}/deleteproduct/${subCategoryId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);

                if (data.status === 'success') {
                    console.log(data)
                    toast.success('Product deleted successfully');

                    const updatedProduct = product.filter((item) => item._id !== data.result._id);
                    setProduct(updatedProduct);
                } else {
                    console.error(`Failed to delete product with proId: ${subCategoryId}`);
                    console.error(data);
                    toast.error(data.message || 'An error occurred while deleting the product');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('An error occurred while processing your request');
            });
    };

    //sorting
    const idWise = (sortBy) => {
        const sortedCategories = [...product];
        console.log(sortedCategories)
        const isDescending = sortBy === 'desc';

        sortedCategories.sort((a, b) => {
            const idA = parseFloat(a.subCategoryId.match(/\d+/)[0]);
            const idB = parseFloat(b.subCategoryId.match(/\d+/)[0]);

            if (isDescending) {
                return idB - idA;
            } else {
                return idA - idB;
            }
        });

        setProduct(sortedCategories);
        setIdSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categoryNameWise = (sortBy) => {
        const sortedCategories = [...product];
        const isDescending = sortBy === 'desc';

        sortedCategories.sort((a, b) => {
            if (isDescending) {
                return b.pName.localeCompare(a.pName);
            } else {
                return a.pName.localeCompare(b.pName);
            }
        });

        setProduct(sortedCategories); // Use setSubCategories to update the state
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categoryPriceWise = (sortBy) => {
        const sortedProducts = [...product];
        const isDescending = sortBy === 'desc';

        sortedProducts.sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);

            if (isDescending) {
                return priceB - priceA;
            } else {
                return priceA - priceB;
            }
        });

        setProduct(sortedProducts);
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categorydetailsWise = (sortBy) => {
        const sortedCategories = [...product];
        const isDescending = sortBy === 'desc';

        sortedCategories.sort((a, b) => {
            if (isDescending) {
                return b.details.localeCompare(a.details);
            } else {
                return a.details.localeCompare(b.details);
            }
        });

        setProduct(sortedCategories); // Use setSubCategories to update the state
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categoryImgWise = (sortBy) => {
        const sortedProducts = [...product];
        const isDescending = sortBy === 'desc';

        sortedProducts.sort((a, b) => {
            const imgA = a.pImg[0];
            const imgB = b.pImg[0];

            if (isDescending) {
                return imgB.localeCompare(imgA);
            } else {
                return imgA.localeCompare(imgB);
            }
        });

        setProduct(sortedProducts);
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categorydiscountPriceWise = (sortBy) => {
        const sortedProducts = [...product];
        const isDescending = sortBy === 'desc';

        sortedProducts.sort((a, b) => {
            const priceA = parseFloat(a.discountPrice);
            const priceB = parseFloat(b.discountPrice);

            if (isDescending) {
                return priceB - priceA;
            } else {
                return priceA - priceB;
            }
        });

        setProduct(sortedProducts);
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categorySubcategoryNameWise = (sortBy) => {
        const sortedProducts = [...product];
        const isDescending = sortBy === 'desc';

        sortedProducts.sort((a, b) => {
            if (isDescending) {
                return b.subcategoryName.localeCompare(a.subcategoryName);
            } else {
                return a.subcategoryName.localeCompare(b.subcategoryName);
            }
        });

        setProduct(sortedProducts);
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };


    //search
    const handleSearch = () => {
        const query = {};

        if (searchQueryName) {
            query.pName = searchQueryName;
        }

        if (searchQueryPrice) {
            query.price = searchQueryPrice;
        }

        if (searchDiscountPrice) {
            query.discountPrice = searchDiscountPrice;
        }

        const queryString = Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&');

        fetch(`${GET_PRO_API_BASE_URL}/searchproduct?${queryString}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('An error occurred while searching for products');
            });
    };

    // const handleEdit = (_id) => {
    //     const itemToEdit = product.find((item) => item._id=== _id)
    //     console.log(itemToEdit)
    //     if (itemToEdit) {
    //         setEditMode(true)
    //         setEditedProduct(itemToEdit)
    //         setProShowModal(true);
    //         setSelectedOption(itemToEdit.subcategoryName)
    //     }
    // };


    const handleEdit = (_id) => {

        setEditItemId(_id);
        const itemToEdit = product.find((item) => item._id === _id);

        setSelectedOption(itemToEdit.subcategoryName);
        setInputValue(itemToEdit.subcategoryName);
        setProShowModal(true);
        setEditMode(true)
        setEditedProduct(itemToEdit)
    }

    return (
        <div className="flex flex-col w-full px-10">
            <div className="">
                <div className="flex justify-between items-center border-b">
                    <h1 className={`text-xl px-4 mb-4 category-title ${isDarkMode ? 'dark' : ''} font-semibold`}>
                        Product
                    </h1>
                    <Link>
                        <button
                            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg mb-6 hover:bg-blue-600 focus:outline-none"
                            onClick={() => { setProShowModal(true) }}
                        >
                            Add
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex items-center space-x-4 m mt-10">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchQueryName}
                    onChange={(e) => setSearchQueryName(e.target.value)}
                    className="px-2 py-1 border rounded"
                />
                <input
                    type="text"
                    placeholder="Search by Price"
                    value={searchQueryPrice}
                    onChange={(e) => setSearchQueryPrice(e.target.value)}
                    className="px-2 py-1 border rounded"
                />
                <input
                    type="text"
                    placeholder="Search by Discount Price"
                    value={searchDiscountPrice}
                    onChange={(e) => setSearchDisCountPrice(e.target.value)}
                    className="px-2 py-1 border rounded"
                />
                <button
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white text-black mt-10">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Sub Category Id
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => idWise(idSortDirection)}
                                    >
                                        {idSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Product Name
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => categoryNameWise(categoryNameSortDirection)}
                                    >
                                        {categoryNameSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Price
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => categoryPriceWise(categoryNameSortDirection)}
                                    >
                                        {categoryNameSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Details
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => categorydetailsWise(categoryNameSortDirection)}
                                    >
                                        {categoryNameSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Subcategory Name
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => categorySubcategoryNameWise(categoryNameSortDirection)}
                                    >
                                        {categoryNameSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>

                            <th>
                                <div className="flex items-center">
                                    Discount Price
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => categorydiscountPriceWise(categoryNameSortDirection)}
                                    >
                                        {categoryNameSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Images Count
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        onClick={() => categoryImgWise(categoryNameSortDirection)}
                                    >
                                        {categoryNameSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </div>
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    No products found.
                                </td>
                            </tr>
                        ) : (

                            product.map((el, i) => {
                                return (
                                    <tr className="bg-white " key={i + 1}>
                                        <td className="px-6 py-4 text-base">{i + 1}</td>
                                        <td className="px-6 py-4 text-base">
                                            {el.subCategoryId}
                                        </td>
                                        <td className="px-6 py-4 text-base">
                                            {el.pName}
                                        </td>
                                        <td className="px-6 py-4 text-base">
                                            {el.price}
                                        </td>

                                        <td className="px-6 py-4 text-base">
                                            {el.details}
                                        </td>

                                        <td className="px-6 py-4 text-base">
                                            {el.subcategoryName}
                                        </td>
                                        <td className="px-6 py-4 text-base">
                                            {el.discountPrice}
                                        </td>
                                        <td className="px-6 py-4 text-base">
                                            {el.pImg.length}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-xl bg-green-600 text-white py-2 px-2 
                                        rounded" onClick={() => handleEdit(el._id)}>
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-xl bg-red-600 text-white py-2 px-2 ml-4 rounded"
                                                onClick={() => deleteProduct(el.subCategoryId)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}

                    </tbody>
                </table>

                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <a

                            className="relative inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-auto"
                            onClick={() => {
                                if (currentPage > 1) {
                                    fetchProduct(currentPage - 1);
                                }
                            }}
                        >
                            Previous
                        </a>
                        <a

                            className="relative ml-3 inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                                if (currentPage < totalPages) {
                                    fetchProduct(currentPage + 1);
                                }
                            }}
                        >
                            Next
                        </a>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:sm:justify-between">
                        <div className="ml-auto">
                            <nav
                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                aria-label="Pagination"
                            >
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => fetchProduct(index + 1)}
                                        className={`${currentPage === index + 1
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-400'
                                            } relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium focus:z-20 focus:outline-offset-0`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {proShowModal && (
                <ProductModal


                    updateProductData={(newProductData) => setProduct(newProductData)}
                    editedProduct={editedProduct}
                    setSelectedOption={setSelectedOption}
                    selectedOption={selectedOption}
                    setEditMode={setEditMode}
                    editMode={editMode}
                    shoproShowModal={shoproShowModal}
                    // renderData={renderData}
                    setEditItemId={setEditItemId}
                    setProShowModal={setProShowModal}
                    proShowModal={proShowModal}
                    inputValue={inputValue}
                    setInputValue={setInputValue}

                />
            )}

        </div>
    )
}

export default GetProduct