// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// const SubCategoryModal = ({
//   isOpen,
//   subtoggleModal,
//   selectedOption,
//   setSelectedOption, editItemId, setSubcategoryName, subcategoryName,
//   isEditMode, subCategories, setSubCategories
// }) => {
//   console.log(subcategoryName)
//   const [categories, setCategories] = useState([]);
//   const [categoryError, setCategoryError] = useState('');
//   const [subcategoryError, setSubcategoryError] = useState('');
//   // const [subcategoryName, setSubcategoryName] = useState('');
//   const [selectedCategoryId, setSelectedCategoryId] = useState('');
//    const [isCategoryValid, setIsCategoryValid] = useState(true);
//   const [isSubcategoryValid, setIsSubcategoryValid] = useState(true);



//   const fetchAllCategories = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/getallcategory`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setCategories(data.category);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAllCategories();
//   }, []);


//   useEffect(() => {
//     if (isEditMode) {
//       setSubcategoryName(subcategoryName);
//     } else {
//       setSubcategoryName('');
//     }
//   }, [isEditMode, editItemId]);



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const url = isEditMode
//         ? `${API_BASE_URL}/updatesubcategiry/${editItemId}` // Use the edit API endpoint
//         : `${API_BASE_URL}/addSubcategory/${selectedCategoryId}`; // Use the add API endpoint

//       const response = await fetch(url, {
//         method: isEditMode ? 'PATCH' : 'POST', // Use PUT for editing, POST for adding
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           SubCateoryName: subcategoryName,
//           mainCategoryName: selectedOption, // Include the MainCategoryName in the request body
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       toast.success(data.message);

//       if (isEditMode) {
//         // Update the subcategories in the state
//         const updatedSubCategories = subCategories.map((subCategory) =>
//           subCategory.id === selectedCategoryId
//             ? { ...subCategory, SubCateoryName: subcategoryName, MainCategoryName: selectedOption }
//             : subCategory
//         );
//         setSubCategories(updatedSubCategories);
//       } else {
//         setSubCategories((prevCategories) => [...prevCategories, data.result]);
//       }

//       subtoggleModal();
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <>
//       {isOpen ? (
//         <>
//           <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
//             <div className="relative w-[30%] my-6 mx-auto">
//               <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
//                 <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">

//                   {isEditMode ? <h3 className="text-3xl font-semibold">Update Sub Category Form</h3> :
//                     <h3 className="text-3xl font-semibold">Add Sub Category Form</h3>}
//                   <button
//                     className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                     onClick={subtoggleModal}
//                   >
//                     <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                       ×
//                     </span>
//                   </button>
//                 </div>
//                 <div className="relative p-6 flex-auto">
//                   <form>
//                     <div className="mb-4 rounded">
//                       <label
//                         htmlFor="categoryName"
//                         className="block text-gray-600 font-semibold mb-2"
//                       >
//                         Select Category:
//                       </label>
//                       <select
//                         id="categories"
//                         name="categoryId"
//                         className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 w-full"
//                         value={selectedOption}
//                         onChange={(e) => {
//                           setSelectedOption(e.target.value); // Update selectedOption
//                           // Find the corresponding categoryId and set it to selectedCategoryId
//                           const category = categories.find((cat) => cat.MaincategoryName === e.target.value);
//                           setSelectedCategoryId(category ? category.id : ''); // Set selectedCategoryId
//                         }}
//                       >
//                         <option value="">Choose a category</option>
//                         {categories.map((category) => (
//                           <option key={category.id} value={category.MaincategoryName}>
//                             {category.MaincategoryName}
//                           </option>
//                         ))}
//                       </select>

//                       {categoryError && (
//                         <p className="text-red-500">{categoryError}</p>
//                       )}
//                     </div>
//                     <div className="mb-4 rounded">
//                       <label
//                         htmlFor="categoryName"
//                         className="block text-gray-600 font-semibold mb-2"
//                       >
//                         Sub Category:
//                       </label>
//                       <input
//                         type="text"
//                         id="categoryName"
//                         name="MaincategoryName"
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
//                         placeholder="Enter category name"
//                         value={subcategoryName} // Ensure this value is set to subcategoryName
//                         onChange={(e) => setSubcategoryName(e.target.value)}
//                       />
//                       {subcategoryError && (
//                         <p className="text-red-500">{subcategoryError}</p>
//                       )}
//                     </div>
//                   </form>

//                   <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
//                     {!isEditMode ? <>
//                       <button
//                         className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
//                         type="button"
//                         onClick={subtoggleModal}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
//                         type="submit"
//                         onClick={handleSubmit}
//                       >
//                         Save Changes
//                       </button>
//                     </> :
//                       <>
//                         <button
//                           className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
//                           type="button"
//                           onClick={subtoggleModal}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
//                           type="submit"
//                           onClick={handleSubmit}
//                         >
//                         Update
//                         </button>
//                       </>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//       ) : null}
//     </>
//   );
// };
// export default SubCategoryModal;


import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SubCategoryModal = ({
  isOpen,
  subtoggleModal,
  selectedOption,
  setSelectedOption,
  editItemId,
  isDarkMode,
  subcategoryName,
  setSubcategoryName,
  isEditMode,
  subCategories,
  setSubCategories
}) => {
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');
  const [subcategoryError, setSubcategoryError] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isCategoryValid, setIsCategoryValid] = useState(true);
  const [isSubcategoryValid, setIsSubcategoryValid] = useState(true);

  const fetchAllCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getallcategory`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data.category);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {

      setSubcategoryName(subcategoryName);

    }
  }, [isEditMode, subcategoryName]);


  const isSubcategoryNameValid = (name) => {
    // Check if the subcategory name is not empty
    if (!name) {
      setSubcategoryError('Please enter a subcategory name.');
      return false;
    }

    if (!isEditMode) {
      // Check if the subcategory name already exists only when adding a new subcategory
      const subcategoryExists = subCategories.some((subCategory) =>
        subCategory.SubCateoryName.toLowerCase() === name.toLowerCase()
      );

      if (subcategoryExists) {
        setSubcategoryError('This subcategory name already exists.');
        return false;
      }
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setCategoryError('');
    setSubcategoryError('');

    // Validation checks
    let isValid = true;

    if (!selectedCategoryId) {
      setCategoryError('Please select a category.');
      isValid = false;
    }

    if (!isSubcategoryNameValid(subcategoryName)) {
      isValid = false;
    }

    if (!isValid) {
      return; // Exit the function if validation fails
    }


    try {
      const url = isEditMode
        ? `${API_BASE_URL}/updatesubcategiry/${editItemId}` // Use the edit API endpoint
        : `${API_BASE_URL}/addSubcategory/${selectedCategoryId}`; // Use the add API endpoint

      const response = await fetch(url, {
        method: isEditMode ? 'PATCH' : 'POST', // Use PUT for editing, POST for adding
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SubCateoryName: subcategoryName,
          mainCategoryName: selectedOption, // Include the MainCategoryName in the request body
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toast.success(data.message);

      if (isEditMode) {
        const updatedSubCategories = subCategories.map((subCategory) =>
          subCategory.id === editItemId
            ? { ...subCategory, SubCateoryName: subcategoryName, MainCategoryName: selectedOption }
            : subCategory
        );
        console.log('Updated Sub Categories:', updatedSubCategories);
        setSubCategories(updatedSubCategories);
      } else {
        setSubCategories((prevCategories) => [...prevCategories, data.result]);
      }

      subtoggleModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closeModal = () => {
    setSelectedOption('');
    setSubcategoryName('');
    setCategoryError('');
    setSubcategoryError('');
    setIsCategoryValid(true);
    setIsSubcategoryValid(true);
    subtoggleModal();
  };

  return (
    <>
      {isOpen ? (
        <>

          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[30%] my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  {/* {isEditMode ? (
                  <h3 className="text-3xl font-semibold">Update Sub Category Form</h3>
                ) : (
                  <h3 className="text-3xl font-semibold">Add Sub Category Form</h3>
                )} */}
                  <h3 className={`text-3xl font-semibold ${isDarkMode ? 'dark' : 'text-black'}`}>
                    {isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form>
                    <div className="mb-4 rounded">
                      <label
                        htmlFor="categoryName"
                        className="block text-gray-600 font-semibold mb-2"
                      >
                        Select Category:
                      </label>
                      <select
                        id="categories"
                        name="categoryId"
                        className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 w-full ${!isCategoryValid ? 'border-red-500' : ''
                          } ${isDarkMode ? 'dark' : 'text-black'}`}
                        value={selectedOption}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);

                          const category = categories.find((cat) => cat.MaincategoryName === e.target.value);
                          setSelectedCategoryId(category ? category.id : '');
                        }}
                      >
                        <option value="">Choose a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.MaincategoryName}>
                            {category.MaincategoryName}
                          </option>
                        ))}
                      </select>

                      {categoryError && (
                        <p className="text-red-500">{categoryError}</p>
                      )}
                    </div>
                    <div className="mb-4 rounded">
                      <label
                        htmlFor="categoryName"
                        className="block text-gray-600 font-semibold mb-2"
                      >
                        Sub Category:
                      </label>
                      <input
                        type="text"
                        id="categoryName"
                        name="subcategoryName"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 ${!isSubcategoryValid ? 'border-red-500' : ''
                          } ${isDarkMode ? 'dark' : 'text-black'}`}
                        placeholder="Enter category name"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                      />
                      {subcategoryError && (
                        <p className="text-red-500">{subcategoryError}</p>
                      )}
                    </div>
                  </form>

                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    {!isEditMode ? (
                      <>
                        <button
                          className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Update
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isOpen && <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>}
        </>
      ) : null}
    </>
  );
};

export default SubCategoryModal;

