import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const initialForm = {
  pName: '',
  price: '',
  details: '',
  discountPrice: '',
  pImg: [],
  subcategoryId: '',
  subcategoryName: ''
};

const ProductModal = ({ editMode, proShowModal, setProShowModal, isDarkMode,shoproShowModal,
  selectedOption, setSelectedOption, proToggleModal, updateProductData, editedProduct }) => {

  const [product, setProduct] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [formData, setFormData] = useState(initialForm);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
  const [formErrors, setFormErrors] = useState({});


  const fetchAllCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getallcategory`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setProduct(data.subCategory);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    const selectedCategory = product.find((category) => category._id === e.target.value);
    if (selectedCategory) {
      setSelectedSubcategoryName(selectedCategory.subcategoryName);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setFormData({
      ...formData,
      pImg: files,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const subCatId = selectedCategoryId;
  //     console.log(subCatId)
  //     const formDataToSend = new FormData();

  //     formDataToSend.append('pName', formData.pName);
  //     formDataToSend.append('price', formData.price);
  //     formDataToSend.append('details', formData.details);
  //     formDataToSend.append('discountPrice', formData.discountPrice);

  //     for (let i = 0; i < formData.pImg.length; i++) {
  //       formDataToSend.append('pImg', formData.pImg[i]);
  //     }

  //     const response = await axios.post(`${API_BASE_URL}/addProduct/${subCatId}`, formDataToSend, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (response.status === 200) {
  //       const newData = response.data.result;
  //       updateProductData((prevData) => [newData, ...prevData]);
  //       toast.success('Product added successfully.');
  //       proToggleModal();
  //     } else {
  //       toast.error('Error adding product. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Error adding product. Please try again.');
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({});

    const errors = {};

    if (!formData.pName) {
      errors.pName = 'Product Name is required';
    }

    if (!formData.price || isNaN(formData.price)) {
      errors.price = 'Valid Product Price is required';
    }

    if (!formData.details) {
      errors.details = 'Product Details are required';
    }

    if (selectedOption === null || selectedOption === '') {
      errors.selectCategoryName = 'Please select a category';
    }

    if (formData.pImg.length === 0) {
      errors.pImg = 'Please select at least one image';
    }

    if (formData.discountPrice === null || formData.discountPrice === '' || isNaN(formData.discountPrice)) {
      errors.discountPrice = 'Valid Discount Price is required';
    }


    setFormErrors(errors);


    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const subCatId = selectedCategoryId;
      const formDataToSend = new FormData();

      formDataToSend.append('pName', formData.pName);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('details', formData.details);
      formDataToSend.append('discountPrice', formData.discountPrice);
      formDataToSend.append('subcategoryName', selectedOption);

      for (let i = 0; i < formData.pImg.length; i++) {
        formDataToSend.append('pImg', formData.pImg[i]);
      }

      if (editMode && editedProduct) {

        const response = await axios.patch(`${API_BASE_URL}/updateproduct/${editedProduct._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          console.log(response)
          const updatedData = response.data;

          updateProductData((prevData) => {
            const updatedIndex = prevData.findIndex((product) => product._id === updatedData._id);
            if (updatedIndex !== -1) {
              prevData[updatedIndex] = updatedData;
            }
            return prevData;
          });
          // toast.success('Product updated successfully.');
          setProShowModal(false)
        } else {
          toast.error('Error updating product. Please try again.');
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/addProduct/${subCatId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const newData = response.data.result;
          console.log(newData)
          updateProductData((prevData) => [newData, ...prevData]);
          toast.success('Product added successfully.');
          setProShowModal(false)
          setSelectedOption(null)
        } else {
          toast.error('Error adding product. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Error handling the product. Please try again.');
    }
  };

  useEffect(() => {
    if (editMode && editedProduct) {
      setFormData({
        pName: editedProduct.pName || '',
        price: editedProduct.price || '',
        details: editedProduct.details || '',
        discountPrice: editedProduct.discountPrice || '',
        pImg: editedProduct.pImg || [],
        subcategoryId: editedProduct.subcategoryId || '',
        subcategoryName: editedProduct.subcategoryName || '', // Corrected property name
      });
    }
  }, [editedProduct]);

  return (
    <>
      {proShowModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[30%] my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className={`text-3xl font-semibold ${isDarkMode ? 'dark' : 'text-black'}`}>
                    {editMode ? 'Edit Product Form' : 'Add Product Form'}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={proToggleModal}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="grid grid-cols-2 gap-4">
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Select Sub Category:
                      </label>
                      <select
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'dark' : 'text-black'
                          }`}
                        value={selectedOption}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);

                          const category = product.find((cat) => cat.SubCateoryName === e.target.value);

                          setSelectedCategoryId(category ? category.id : '');
                        }}
                      >
                        <option value="">Select an option</option>
                        {product.map((category) => (
                          <option key={category.id} value={category.SubCateoryName}>
                            {category.SubCateoryName}
                          </option>
                        ))}
                      </select>
                      {formErrors.subcategoryName && <p className="text-red-500">{formErrors.subcategoryName}</p>}
                    </div>
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Product Name:
                      </label>
                      <input
                        type="text"
                        id="categoryName"
                        name="pName"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'dark' : 'text-black'
                          }`}
                        placeholder="Enter product name"
                        onChange={handleInputChange}
                        value={formData.pName}
                      />
                      {formErrors.pName && <p className="text-red-500">{formErrors.pName}</p>}
                    </div>
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Product Image:
                      </label>
                      <input
                        type="file"
                        id="categoryName"
                        name="pImg"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'dark' : 'text-black'
                          }`}
                        placeholder="Enter product image"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                      />
                      {formErrors.pImg && <p className="text-red-500">{formErrors.pImg}</p>}
                    </div>
                    <div className="mb-4 rounded">
                      <label htmlFor="selectedImages" className="block text-gray-600 font-semibold mb-2">
                        Selected Images:
                      </label>
                      <div
                        className={`flex ${formData.pImg.length > 0
                            ? 'border-dashed border border-gray-300 rounded py-2'
                            : ''
                          }`}
                      >
                        {formData.pImg.length > 0 ? (
                          Array.from(formData.pImg).map((file, index) => (
                            <div key={index} className="image-container">
                              {file instanceof File ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Selected Image ${index}`}
                                  className="rounded w-32 object-contain px-1"
                                />
                              ) : (
                                <img
                                  src={`uploads/${file}`}
                                  alt={`Selected Image ${index}`}
                                  className="rounded w-36 h-20 object-contain px-1"
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <div>No images selected</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Product Price:
                      </label>
                      <input
                        type="number"
                        id="categoryName"
                        name="price"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'dark' : 'text-black'
                          }`}
                        placeholder="Enter product price"
                        onChange={handleInputChange}
                        value={formData.price}
                      />
                      {formErrors.price && <p className="text-red-500">{formErrors.price}</p>}
                    </div>
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Product Details:
                      </label>
                      <textarea
                        type="text"
                        id="categoryName"
                        name="details"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'dark' : 'text-black'
                          }`}
                        placeholder="Enter product details"
                        onChange={handleInputChange}
                        value={formData.details}
                      />
                      {formErrors.details && <p className="text-red-500">{formErrors.details}</p>}
                    </div>
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Product Discount Price:
                      </label>
                      <input
                        type="number"
                        id="categoryName"
                        name="discountPrice"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'dark' : 'text-black'
                          }`}
                        placeholder="Enter Discount Price"
                        onChange={handleInputChange}
                        value={formData.discountPrice}
                      />
                      {formErrors.discountPrice && <p className="text-red-500">{formErrors.discountPrice}</p>}
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={shoproShowModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white active-bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          {proShowModal && <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>}
        </>
      ) : null}
    </>
  );
};

export default ProductModal;

