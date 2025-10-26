import React, { useEffect, useState } from 'react';
import './login.css';
import loginillustration from '../../assets/images/loginillustration.png';
import { login, logout } from '../../ReduxSlice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { fetchOrganizations } from '../../ReduxSlice/organizationSlice';
import Loader from '../../Components/Loader/Loader';
import { FaEye, FaEyeSlash } from "react-icons/fa";



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state?.auth?.user);
  const userLoad = useSelector((state) => state?.auth?.status);

  const [input, setInput] = useState({
    orgid: "",
    email: "",
    password: "",
    newPassword: ""
  });
  const [forgotToggle, setForgotToggle] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const { organizations, loading, error } = useSelector((state) => state.organization);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPStage, setShowOTPStage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const handleLogout = () => {
    setForgotToggle(false)
    console.log("hereonlogout")
    dispatch(logout());
    sessionStorage.removeItem("userInfo"); // Optional: clear session storage too
  };
  useEffect(() => {
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!input.orgid) newErrors.orgid = "Organization is required";
    if (!input.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(input.email))
      newErrors.email = "Enter a valid email.";

    if (!input.password) newErrors.password = "Password is required.";
    else if (input.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    return newErrors;
  }

  const handleOTP = (value) => {
    setOtp(value);
  };
  const releaseOTP = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/validateToken`, { email: user.user.email, token: otp });
      console.log(response, "otpTEST")
      toast.success(response?.data?.message)
      navigate('/home');
    } catch (error) {
      console.log(error, "error")
      toast.error(error?.response?.data?.message)
    }
  }
  // useEffect(() => {
  //     releaseOTP()
  // }, [otp])

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors, "TESTHERE")
      setErrors(validationErrors);
      return;
    }
    console.log(input, "inpooot")
    dispatch(login(input))
      .unwrap()
      .then((res) => {
        // sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        toast.success("Login successful!");
      })
      .catch((err) => {
        console.error(err, "Login error");
        toast.error("Login failed! Please check your credentials.");
      });
  };

  const handleOTPsubmit = async (e) => {
    if (otp.length < 4) {
      toast.error("Please enter the complete OTP.");
      return;
    }
    releaseOTP()

    console.log(e, "test")
  }



  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);



  const handleForgotOTP = async () => {

    try {
      const response = await axios.post(`http://localhost:3000/api/auth/validateForgotToken`, { email: input.email, token: otp });
      console.log(response, "forgot")
      toast.success(response?.data?.message)
      setResetPassword(true)
    } catch (error) {
      console.log(error, "error")
      toast.error(error?.response?.data?.message)
    }

  }
  const toggleForgot = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post(`http://localhost:3000/api/auth/sendForgotPassword`, { email: input.email });
      toast.success(response?.data?.message)
      setForgotToggle(true)
    } catch (error) {
      console.log(error, "error")
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/updatePassword`, { email: input.email, password: input.newPassword });
      console.log(response, "forgot")
      toast.success(response?.data?.message)
      handleLogout()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }



  return (
    <div className="login min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-green-700 to-yellow-400 bg-opacity-90">
      <div className="flex flex-col md:flex-row items-center justify-between w-full sm:w-11/12 md:w-4/6 lg:w-3/5 p-10 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl gap-10">

        {/* Left Form Section */}
        <div className='w-full md:w-1/2 flex flex-col justify-center text-white space-y-6'>
          <h1 className="text-5xl font-extrabold text-center text-white drop-shadow-lg">The Wall.Login</h1>

          {!user ? (
            forgotToggle && input.email ? (
              !resetPassword ? (
                <div className='relative'>
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-white text-center">Enter Forgot OTP sent to your email</p>
                    <OtpInput
                      value={otp}
                      onChange={handleOTP}
                      numInputs={4}
                      renderSeparator={<span className="text-white mx-1">-</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          className="otp-input bg-white/10 text-white border-b-2 border-white w-14 h-12 text-center rounded focus:outline-none"
                        />
                      )}
                    />
                    <div className='flex gap-2'>
                      <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-8 rounded-full">
                        Back
                      </button>
                      <button
                        className="mt-2 bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
                        type='button'
                        onClick={handleForgotOTP}
                      >
                        Submit OTP
                      </button>

                    </div>


                  </div>

                </div>
              ) : (
                <div className="space-y-4">
                  <div>

                    <label className="block text-white">Organization</label>

                    <select
                      name="organization"
                      // onChange={handleChange}
                      // value={input.organization}
                      placeholder="Select Organization"
                      className="w-full px-2 py-2 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" disabled selected hidden>
                        Select Organization1
                      </option>
                      {Array.isArray(organizations) &&
                        organizations.map((org) => (
                          <option
                            key={org._id}
                            value={org._id}
                            className="bg-green-800 text-white"
                          >
                            {org.orgname}
                          </option>
                        ))}


                    </select>

                  </div>



                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      value={input.email}
                      className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">New Password</label>
                    <input
                      type="text"
                      name="newPassword"
                      placeholder="New Password"
                      onChange={handleChange}
                      value={input.newPassword}
                      className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className='flex justify-between'>
                  <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-8 rounded-full">
                        Back
                      </button>
                  <button
                    className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
                    type='button'
                    onClick={handleNewPasswordSubmit}
                  >
                    Submit Password
                  </button>
                  </div>
                </div>
              )
            ) :
              (
                <div className='relative'>
                  {userLoad === 'loading' && <Loader />}
                  {isLoading ? <Loader /> :

                    <form className="space-y-5" onSubmit={handleSubmit}>

                      <div>

                        <label className="block text-white">Organization</label>

                        <select
                          name="orgid"
                          onChange={handleChange}
                          // value={input.organization}
                          placeholder="Select Organization"
                          className="w-full px-2 py-2 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="" disabled selected hidden>
                            Select Organization2
                          </option>
                          {Array.isArray(organizations) &&
                            organizations.map((org) => (
                              <option
                                key={org._id}
                                value={org._id}
                                className="bg-green-800 text-white"
                              >
                                {org.orgname}
                              </option>
                            ))}


                        </select>
                        {errors.orgid && <p className="text-amber-400 text-sm font-bold">{errors.orgid}</p>}

                      </div>


                      <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                          type="text"
                          name="email"
                          placeholder="Email"
                          onChange={handleChange}
                          value={input.email}
                          className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.password && <p className="text-amber-400 text-sm font-bold">{errors.email}</p>}

                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          onChange={handleChange}
                          value={input.password}
                          className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
                        />
                        {/* Eye Icon */}
                        <div
                          className="absolute top-9 right-3 cursor-pointer text-white"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>

                        {errors.password && (
                          <p className="text-amber-400 text-sm font-bold">{errors.password}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm underline cursor-pointer" onClick={toggleForgot}>
                          Forgot Password?
                        </span>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
                        >
                          Login
                        </button>

                      </div>
                      <p className="text-center text-white text-sm">
                        Don't have an account? <a href="/signup" className="underline font-medium">Click Here</a>
                      </p>
                    </form>
                  }
                </div>
              )
          ) :
            (

              <div className="flex flex-col items-center gap-4">
                <p className="text-white text-center">Enter 2FA OTP sent to your email</p>
                <OtpInput
                  value={otp}
                  onChange={handleOTP}
                  numInputs={4}
                  renderSeparator={<span className="text-white mx-1">-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="otp-input bg-white/10 text-white border-b-2 border-white w-14 h-12 text-center rounded"
                    />
                  )}
                />
                <div className='flex gap-2'>
                  <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-8 rounded-full">
                    Back
                  </button>
                  <button
                    className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
                    type='button'
                    onClick={handleOTPsubmit}
                  >
                    Submit OTP
                  </button>

                </div>


              </div>
            )

          }
        </div>


        {/* Right Image Section */}
        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center">
          <img src={loginillustration} alt="Login Illustration" className="w-full max-w-xs md:max-w-md object-contain drop-shadow-xl" />
        </div>
      </div>
    </div>
  );

};

export default Login;
