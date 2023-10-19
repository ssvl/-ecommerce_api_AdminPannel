import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import SubCategoryModal from './SubCategoryModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GET_SUB_CAT_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



const SubCategoryGet = ({ isDarkMode, setIsDarkMode }) => {
    const [subShowModal, setSubShowModal] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [idSortDirection, setIdSortDirection] = useState('asc');
    const [categoryNameSortDirection, setCategoryNameSortDirection] = useState('asc');
    const [searchQueryName, setSearchQueryName] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [mainCategory, setMaincategory] = useState('');
    const [formErrors, setFormErrors] = useState({
        mainCategory: '',
        searchQueryName: '',
    });



    const [editItemId, setEditItemId] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [inputValue, setInputValue] = useState('');


    const subtoggleModal = () => {
        setSubShowModal(!subShowModal);
        setIsEditMode(false);
        setCategoryToEdit(null);
    };



    const handleEdit = (id) => {
        const itemToEdit = subCategories.find((item) => item.id === id);
        if (itemToEdit) {
            setEditItemId(id);
            setSelectedOption(itemToEdit.mainCategoryName);
            setInputValue(itemToEdit.mainCategoryName);
            setSubcategoryName(itemToEdit.SubCateoryName); // Set subcategoryName to the correct value
            setSubShowModal(true);
            setIsEditMode(true);
        }
    };

    const fetchSubCategories = (page = 1, limit = 5) => {
        fetch(`${GET_SUB_CAT_API_BASE_URL}/getsubcategory/${page}?limit=${limit}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setSubCategories(data.result);
                console.log(data.result)
                setCurrentPage(data.page);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const idWise = (sortBy) => {
        const sortedCategories = [...subCategories];
        const isDescending = sortBy === 'desc';

        sortedCategories.sort((a, b) => {
            const idA = parseFloat(a.id.match(/\d+/)[0]);
            const idB = parseFloat(b.id.match(/\d+/)[0]);

            if (isDescending) {
                return idB - idA;
            } else {
                return idA - idB;
            }
        });

        setSubCategories(sortedCategories);
        setIdSortDirection(isDescending ? 'asc' : 'desc');
    };

    const categoryNameWise = (sortBy) => {
        const sortedCategories = [...subCategories];
        const isDescending = sortBy === 'desc';

        sortedCategories.sort((a, b) => {
            if (isDescending) {
                return b.SubCateoryName.localeCompare(a.SubCateoryName);
            } else {
                return a.SubCateoryName.localeCompare(b.SubCateoryName);
            }
        });

        setSubCategories(sortedCategories); // Use setSubCategories to update the state
        setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
    };

    useEffect(() => {
        fetchSubCategories();
    }, []);


    //search
    const handleSearch = () => {
        const queryParams = [];

        if (searchQueryName) {
            queryParams.push(`SubCateoryName=${searchQueryName}`);
        }


        if (mainCategory) {
            queryParams.push(`mainCategoryName=${mainCategory}`);
        }
        const queryString = queryParams.join('&');
        const apiUrl = `${GET_SUB_CAT_API_BASE_URL}/searchsubcategory?${queryString}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setSubCategories(data);
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('An error occurred while searching');
            });
    };



    return (
        <div className="flex flex-col w-full px-10">
            <div className=" ">
                <div className="flex justify-between items-center border-b">
                    <h1 className={`text-xl px-4 mb-4 category-title ${isDarkMode ? 'dark' : ''} font-semibold`}>
                        Sub  Category
                    </h1>
                    <Link>
                        <button
                            className=" bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg mb-6 hover:bg-blue-600 focus:outline-none"
                            onClick={subtoggleModal}
                        >
                            Add
                        </button>
                    </Link>
                </div>
                <div className="flex items-center space-x-4 m mt-10">
                    <input
                        type="text"
                        placeholder="Search by Category"
                        value={mainCategory}
                        onChange={(e) => setMaincategory(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Search by Sub category Name"
                        value={searchQueryName}
                        onChange={(e) => setSearchQueryName(e.target.value)}
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
                                        Category Id
                                        <button
                                            className="ml-2 text-gray-400 hover:text-gray-700"
                                            onClick={() => idWise(idSortDirection)}
                                        >
                                            {idSortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                                        </button>
                                    </div>
                                </th>
                                {/* <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Sub Category Id

                                    </div>
                                </th> */}
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Category
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
                                        Subcategory Name
                                        <button
                                            className="ml-2 text-gray-400 hover:text-gray-700"
                                            onClick={() => categoryNameWise(categoryNameSortDirection)}
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
                            {subCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                subCategories.map((el, i) => {


                                    return (
                                        <tr className="bg-white" key={el.id}>
                                            <td className="px-6 py-4 text-base">{i + 1}</td>
                                            <td className="px-6 py-4 text-base">{el.id}</td>
                                            <td className="px-6 py-4 text-base">{el.mainCategoryName}</td>
                                            <td className="px-6 py-4 text-base">{el.SubCateoryName}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-xl bg-green-600 text-white py-2
                                                 px-2 rounded" onClick={() => handleEdit(el.id)}>
                                                    <FaEdit />
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
                                href="#"
                                className="relative inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-auto"
                                onClick={() => {
                                    if (currentPage > 1) {
                                        fetchSubCategories(currentPage - 1);
                                    }
                                }}
                            >
                                Previous
                            </a>
                            <a
                                href="#"
                                className="relative ml-3 inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                    if (currentPage < totalPages) {
                                        fetchSubCategories(currentPage + 1);
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
                                            onClick={() => fetchSubCategories(index + 1)}
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
            </div>
            {subShowModal && (
                <SubCategoryModal
                    isOpen={subShowModal}
                    subtoggleModal={subtoggleModal}
                    setSubCategories={setSubCategories}
                    subCategories={subCategories}
                    setCategories={setCategories}
                    isEditMode={isEditMode}
                    categoryToEdit={categoryToEdit}
                    categories={categories}
                    setCategoryToEdit={setCategoryToEdit}
                    editItemId={editItemId}
                    setEditItemId={setEditItemId}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    subcategoryName={subcategoryName}
                    setSubcategoryName={setSubcategoryName}
                />
            )}
        </div>
    )
}

export default SubCategoryGet