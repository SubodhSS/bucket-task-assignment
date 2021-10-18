import React, { useEffect, useState } from 'react';
import { get, omit, isEmpty, isNull } from 'lodash';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import "react-datepicker/dist/react-datepicker.css";

import api from "../api";

const AddBucket = () => {


    const defaultInitialValues = {
        "name":"",
        };
    const { id } = useParams();
    const history = useHistory();
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues); 
    

    const getTaskDetails = async () => {
        const response = await api.get(`/buckets/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response.data.data;
    }

    const createTask = async (data) => {
        const response = await api.post('/buckets', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response;
    }

    const updateTask = async (data) => {
        const response = await api.put(`/buckets/${id}`, omit(data, ['id']), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response;
    }

    const onSubmitTask = async (data) => {
        let newData = {
            ...data,
        }

        if( id === 'new') {
            const { status } = await createTask(newData);
            if(status === 200 || status === 201) {
                history.push('/buckets')
            }
        } else {
            const { status } = await updateTask(newData, id);
            if(status === 200) {
                history.push('/buckets')
            }
        }
    }

    useEffect(() =>{
        const tasksDetailData = async() => {
            
            const taskDetail = await getTaskDetails(id);
            if(taskDetail) {
                // setTaskDetail(taskDetail);
                setInitialValues({ ...defaultInitialValues, ...taskDetail});
            }
        }
        tasksDetailData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[ id ]);

    return (
        <div>
            <h1>
                {id === 'new' ? 'Create task' : 'Update Task' }
            </h1>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={(values) => {
                        onSubmitTask(values);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                        /* and other goodies */
                    }) => {

                        return (<Form>
                            <Field 
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage 
                                name="name" 
                                component="div" 
                            />
                            
                            <button
                                type="submit"
                                className="btn btn-primary btn-block mt-2"
                            >
                                Submit
                            </button>
                        </Form>);
                    }}
                </Formik>
        </div>
    ); 
};

export default AddBucket;