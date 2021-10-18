import React from "react";
import axios from 'axios';
import {
    useHistory,
  } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Login = () => {
    const history = useHistory();

        return (
            <div>
                <h3>Sign In</h3>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.email) {
                        errors.email = 'Required';
                        } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                        errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        axios.post(`http://localhost:3000/login`, values )
                        .then(res => {
                            localStorage.setItem('token', res.data.data)
                            history.push({
                                pathname: '/tasks',
                            });
                        }).catch(e =>{
                            console.log('Error: ', e);
                        });
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
                        /* and other goodies */
                    }) => (
                        
                        <Form>
                            <Field 
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage 
                                name="email" 
                                component="div" 
                            />
                            <Field
                                type="password"
                                name="password"
                                className="form-control mt-2"
                                placeholder="Enter password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="password" component="div" />
                            <button
                                type="submit"
                                className="btn btn-primary btn-block mt-2"
                                // disabled={isSubmitting}
                            >
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
};

export default Login;