import React, { useEffect, useState } from 'react';
import './sign.css';
import loginillustration from '../../assets/images/loginillustration.png';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchOrganizations } from '../../ReduxSlice/organizationSlice';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = Yup.object({
    organization: Yup.string().required('Organization is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required')
});

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { organizations } = useSelector((state) => state.organization);

    useEffect(() => {
        dispatch(fetchOrganizations());
    }, [dispatch]);

    const handleRequest = async (values, { setSubmitting }) => {
        try {
            console.log(values,"TESTVAL")
            const response = await axios.post(
                `http://localhost:3000/api/auth/colleagueRequest`,
                {
                    orgid: values.organization,
                    username: values.username,
                    email: values.email,
                    password: values.password
                }
            );

            if (response.status === 200) {
                toast.success("Request sent Successfully");
                navigate('/');
            } else {
                toast.error("Failed to send request");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error || "Request failed");
        } finally {
            setSubmitting(false);
        }
    };

    const initialValues = {
        organization: '',
        username: '',
        email: '',
        password: ''
    };

    return (
        <div className="sign h-screen flex items-center justify-center bg-gradient-to-l from-black via-green-700 bg-opacity-90">
            <div className="flex items-center w-full sm:w-5/6 md:w-3/6 p-8 bg-white/30 backdrop-blur-md rounded-3xl shadow-lg">
                <div className='w-full flex items-center justify-center hidden xl:block'>
                    <img src={loginillustration} alt="Illustration" />
                </div>

                <div className='w-full md:w-[600px] md:h-[500px] flex flex-col justify-center'>
                    <h1 className="text-4xl text-center mb-6 font-bold text-white">The Wall.Sign</h1>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleRequest}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-white">Organization</label>
                                    <Field
                                        as="select"
                                        name="organization"
                                        className="w-full px-2 py-2 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="" disabled hidden>Select Organization</option>
                                        {Array.isArray(organizations) && organizations.map((org) => (
                                            <option key={org.orgid} value={org._id} className="bg-green-800 text-white"
                                            >
                                                {org.orgname}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="organization" component="div" className="text-amber-500 text-md font-bold" />
                                </div>

                                <div>
                                    <label className="block text-white">Username</label>
                                    <Field
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="username" component="div" className="text-amber-500 text-md font-bold" />
                                </div>

                                <div>
                                    <label className="block text-white">Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-amber-500 text-md font-bold" />
                                </div>

                                <div className="relative">
                                    <label className="block text-white mb-1">Password</label>

                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        className="w-full px-4 py-2 pr-10 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                    <div
                                        className="absolute right-3 top-12 -translate-y-1/2 transform cursor-pointer text-white"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>

                                    <ErrorMessage name="password" component="div" className="text-amber-500 text-md font-bold mt-1" />
                                </div>



                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-800 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Request'}
                                    </button>
                                </div>

                                <div>
                                    <p className="text-center text-white">Already have an account? <a href="/">Click Here</a> </p>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Signup;
