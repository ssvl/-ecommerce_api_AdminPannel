import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Link } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import { FaTrash, FaEdit, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GET_CAT_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Category = ({ isDarkMode, setIsDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [idSortDirection, setIdSortDirection] = useState('asc');
  const [categoryNameSortDirection, setCategoryNameSortDirection] = useState('asc');
  const [searchQueryId, setSearchQueryId] = useState(''); // State for ID search
  const [searchQueryName, setSearchQueryName] = useState('');

  const toggleModal = () => {
    setShowModal(!showModal);
    setIsEditMode(false);
    setCategoryToEdit(null);
  };

  const editCategory = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setIsEditMode(true);
      setCategoryToEdit(category);
      setShowModal(true);
    }
  };

  //get
  const fetchCategories = (page = 1, limit = 5) => {
    fetch(`${GET_CAT_API_BASE_URL}/getcategory/${page}?limit=${limit}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data.result);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //delete 
  const deleteCategory = (categoryId) => {
    console.log(categoryId);
    fetch(`${GET_CAT_API_BASE_URL}/deleteByCatId/${categoryId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          console.log(data.status)
          toast.success(data.message || 'Category deleted successfully');
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryId)
          );
        } else {
          console.error(`Failed to delete category with ID ${categoryId}`);
          toast.error(data.message || 'An error occurred while deleting the category');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('An error occurred while processing your request');
      });
  };

  //sort
  const idWise = (sortBy) => {
    const sortedCategories = [...categories];
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

    setCategories(sortedCategories);
    setIdSortDirection(isDescending ? 'asc' : 'desc');
  };

  const categoryNameWise = (sortBy) => {
    const sortedCategories = [...categories];
    const isDescending = sortBy === 'desc';

    sortedCategories.sort((a, b) => {
      if (isDescending) {
        return b.MaincategoryName.localeCompare(a.MaincategoryName);
      } else {
        return a.MaincategoryName.localeCompare(b.MaincategoryName);
      }
    });

    setCategories(sortedCategories);
    setCategoryNameSortDirection(isDescending ? 'asc' : 'desc');
  };

  // search
 
  const handleSearch = () => {
    const queryParams = [];

    if (searchQueryId) {
      queryParams.push(`id=${searchQueryId}`);
    }

    if (searchQueryName) {
      queryParams.push(`MaincategoryName=${searchQueryName}`);
    }

    const queryString = queryParams.join('&');
    const apiUrl = `${GET_CAT_API_BASE_URL}/searchcategory?${queryString}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('An error occurred while searching');
      });
  };
  

  return (
    <>

      <div className="flex flex-col w-full px-10">
        <div className="">
          <div className="flex justify-between items-center border-b">
          <h1 className={`text-xl px-4 mb-4 category-title ${isDarkMode ? 'dark' : ''} font-semibold`}>
            Category
          </h1>
            <Link>
              <button
                className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg mb-6 hover:bg-blue-600 focus:outline-none"
                onClick={toggleModal}
              >
                Add
              </button>
            </Link>
          </div>
          <div className="flex items-center space-x-4 m mt-10">
            {/* <input
              type="text"
              placeholder="Search by Id"
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              className="px-2 py-1 border rounded"
            /> */}
            <input
              type="text"
              placeholder="Search by Name"
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
                    <div className="flex items-center">
                      No

                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">
                      Id
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
                      Category Name
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
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((el, i) => {
                    return (
                      <tr className="bg-white " key={i + 1}>
                        <td className="px-6 py-4 text-base">{i + 1}</td>
                        <td className="px-6 py-4 text-base">
                          {el.id}
                        </td>
                        <td className="px-6 py-4 text-base">
                          {el.MaincategoryName}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xl bg-green-600 text-white py-2 px-2 rounded"
                            onClick={() => editCategory(el.id)}>
                            <FaEdit />
                          </button>
                          <button className="ml-4 text-xl bg-red-600 text-white py-2 px-2
                            rounded"  onClick={() => deleteCategory(el.id)}>
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
                  href="#"
                  className="relative inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-auto"
                  onClick={() => {
                    if (currentPage > 1) {
                      fetchCategories(currentPage - 1);
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
                      fetchCategories(currentPage + 1);
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
                        onClick={() => fetchCategories(index + 1)}
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
        {showModal && (
          <CategoryModal
            isOpen={showModal}
            toggleModal={toggleModal}
            categories={categories}
            setCategories={setCategories}
            isEditMode={isEditMode}
            categoryToEdit={categoryToEdit}
          />
        )}
      </div>
    </>
  );
};

export default Category;
