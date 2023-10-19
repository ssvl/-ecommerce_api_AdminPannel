import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Step 1: Import Formik components
import * as Yup from 'yup'; // Step 1: Import Yup for validation

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CategoryModal = ({ isDarkMode, isOpen, toggleModal, setCategories, categories, isEditMode, categoryToEdit, existingCategories }) => {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      setCategoryName(categoryToEdit.MaincategoryName);
    } else {
      setCategoryName('');
    }
  }, [isEditMode, categoryToEdit]);



  const validationSchema = Yup.object().shape({
    MaincategoryName: Yup.string()
      .required('Category Name is required.')
      .test('is-unique', 'Category with this name already exists.', (value) => {
        if (categories && categories.length > 0) {
          return !categories.some((category) => category.MaincategoryName === value);
        }
        return true;
      }),
  });

  const handleSaveChanges = (values, { setSubmitting }) => {
    const apiUrl = isEditMode
      ? `${API_BASE_URL}/updatecategory/${categoryToEdit.id}`
      : `${API_BASE_URL}/addcategory`;

    const method = isEditMode ? 'PATCH' : 'POST';

    fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ MaincategoryName: values.MaincategoryName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 'error' && data.message === 'Category already exists') {

        } else {

          toast.success(data.message);
          if (isEditMode) {
            setCategories((prevCategories) =>
              prevCategories.map((category) =>
                category.id === categoryToEdit.id ? data.result : category
              )
            );
          } else {
            setCategories((prevCategories) => [...prevCategories, data.result]);
          }
          toggleModal();
          toast.success(isEditMode ? 'Category updated successfully' : null);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={{
        MaincategoryName: categoryToEdit ? categoryToEdit.MaincategoryName : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSaveChanges}
    >
      {(formik) => (
        <Form>
          {isOpen ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-[30%] my-6 mx-auto">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className={`text-3xl font-semibold ${isDarkMode ? 'dark' : 'text-black'}`}>
                      {isEditMode ? 'Edit Category' : 'Add Category'}
                    </h3>

                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={toggleModal}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <div className="mb-4 rounded">
                      <label htmlFor="categoryName" className="block text-gray-600 font-semibold mb-2">
                        Category Name:
                      </label>
                      <Field
                        type="text"
                        id="categoryName"
                        name="MaincategoryName"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${formik.errors.MaincategoryName && (formik.touched.MaincategoryName || isEditMode)
                          ? 'border-red-500'
                          : ''
                          } ${isDarkMode ? 'text-black' : 'text-black'}`}
                        placeholder="Enter category name"
                      />
                      <ErrorMessage name="MaincategoryName">
                        {(msg) => (
                          <div className="text-red-500">
                            {(formik.errors.MaincategoryName && (formik.touched.MaincategoryName || isEditMode)) ||
                              (msg === 'Category with this name already exists.' && (formik.touched.MaincategoryName || isEditMode))
                              ? msg
                              : null}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>


                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={toggleModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? 'Submitting...' : isEditMode ? 'Update Category' : 'Add Category'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {isOpen && <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>}
        </Form>
      )}
    </Formik>
  );
};

export default CategoryModal;