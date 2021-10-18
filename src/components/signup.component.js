import React from "react";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const history = useHistory();
        return (
            <div>
                <h3>Sign Up</h3>
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
                        axios.post(`http://localhost:3000/users`, values )
                        .then(res => {
                            history.push('/');
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
                            >
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
};

export default SignUp;