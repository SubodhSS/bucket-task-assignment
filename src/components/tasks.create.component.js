import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { get, omit, isEmpty, isNull } from 'lodash';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from "react-datepicker";
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";

import api from "../api";

const AddTask = () => {

    const statusOptions  = [
        { value: 'New', label: 'New' },
        { value: 'Incomplete', label: 'Incomplete' },
        { value: 'Complete', label: 'Complete' },
      ];

    const priorityOptions  = [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' },
      ];

    const defaultInitialValues = {
        "title":"",
        "priority": 1,
        "status": 'new',
        "createdAt":new Date(),
        "dueDate": new Date(),
        "bucketId": 0
    };
    const { id } = useParams();
    const history = useHistory();
    const bucketId = get(history, 'location.state.bucketId', '');
    const [bucketListData, setBucketListData ] = useState([]);
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues); 
    

    const getTaskDetails = async () => {
        const response = await api.get(`/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response.data.data;
    }

    const getBucketList = async () => {
        const response = await api.get('/buckets', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response.data;
    }

    const createTask = async (data) => {
        const response = await api.post('/tasks', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response;
    }

    const updateTask = async (data) => {
        const response = await api.put(`/tasks/${id}`, omit(data, ['id']), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response;
    }

    const onSubmitTask = async (data) => {
        let newData = {
            ...data,
            priority: get(data, 'priority', '') || 1,
            status: get(data, 'status', '') || 'New',
            // bucketId: get(data, 'bucketId', '') || 0,
            createdAt: moment(data.createdAt).format('YYYY-MM-DD'),
            dueDate: moment(data.dueDate).format('YYYY-MM-DD')
        }

        if(get(data, 'bucketId', 0) === 0 || isNull(get(data, 'bucketId', 0))) {
            newData = omit(newData, ['bucketId']);
        }

        if(isNull(get(data, 'dueDate', ''))) {
            newData = omit(newData, ['dueDate']);
        }
        if(get(data, 'bucketId', 0) > 0 && (!isEmpty(get(data, 'bucketId', 0)) || !isNull(get(data, 'bucketId', 0)))) {
            newData = { ...newData, bucketId: get(data, 'bucketId', 0)}
        }
        if( id === 'new') {
            const { status } = await createTask(newData);
            if(status === 200 || status === 201) {
                history.push('/tasks')
            }
        } else {
            const { status } = await updateTask(newData, id);
            if(status === 200) {
                if(bucketId) {
                    history.push('/buckets')
                } else {
                    history.push('/tasks')
                }
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

    useEffect(() =>{
        const bucketList = async() => {
            
            const bucketListData = await getBucketList();
            if(bucketListData) {
                const data = (get(bucketListData, 'data', [])).map(d => ({
                    ...d,
                    label: d.name,
                    value: d.id
                }));
                setBucketListData(data);
            }
        }
        bucketList();
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
                        if (!values.title) {
                            errors.title = 'Required';
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
                        const selectedBucket = bucketListData.find(
                            (fq) => fq.id === values.bucketId,
                          );
                        const selectedStatus = statusOptions.find(
                            (fq) => fq.value === values.status,
                          );
                        const selectedPriority = priorityOptions.find(
                            (fq) => fq.value === values.priority,
                          );

                        return (<Form>
                            <Field 
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Enter title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage 
                                name="title" 
                                component="div" 
                            />
                            <DatePicker
                                selected={new Date(get(values, 'createdAt', '')) || new Date()}
                                dateFormat="MM/dd/yyyy"
                                name="createdAt"
                                onChange={(date) => {
                                    setFieldValue('createdAt', date);
                                }}
                                disabled
                                // value={new Date()}
                            />
                            <ErrorMessage
                                name="createdAt"
                                component="div"
                                className="invalid-feedback"
                                style={{ display: 'block' }}
                            />
                            <DatePicker
                                // selected={get(values, 'dueDate', '') || new Date()}
                                selected={new Date(get(values, 'dueDate', '') || moment())}
                                dateFormat="MM/dd/yyyy"
                                name="dueDate"
                                onChange={(date) => {
                                    setFieldValue('dueDate', date);
                                }}
                            />
                            <ErrorMessage
                                name="dueDate"
                                component="div"
                                className="invalid-feedback"
                                style={{ display: 'block' }}
                            />
                            <Select
                                value={selectedBucket}
                                onChange={(item) => {
                                    if (item) {
                                      setFieldValue('bucketId', item.value);
                                    }
                                  }}
                                options={bucketListData}
                            />
                            <Select
                                value={selectedStatus}
                                onChange={(item) => {
                                    if (item) {
                                      setFieldValue('status', item.value);
                                    }
                                  }}
                                options={statusOptions}
                            />
                            <Select
                                value={selectedPriority}
                                onChange={(item) => {
                                    if (item) {
                                      setFieldValue('priority', item.value);
                                    }
                                  }}
                                options={priorityOptions}
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

export default AddTask;