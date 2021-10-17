import React from "react";
import { Formik } from 'formik';

const SignUp = () => {
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
                        setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        }, 400);
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
                        
                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control" 
                                    placeholder="Enter email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                                {errors.email && touched.email && errors.email}
                            </div>

                            <div className="form-group mt-2">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control" 
                                    placeholder="Enter password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                                {errors.password && touched.password && errors.password}
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary btn-block mt-2"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        );
};

export default SignUp;