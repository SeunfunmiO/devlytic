import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Eye, EyeOff, LogIn, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { setCredentials } from '../store/authSlice';
import { loginUser } from '../services/authService';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['developer', 'company'], 'Please select a role')
    .required('Role is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: 'developer',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = await loginUser(values);

        dispatch(setCredentials({
          user: data.user,
          role: data.user.role,
          accessToken: data.accessToken,
        }));

        localStorage.setItem('refreshToken', data.refreshToken);
        toast.success('Welcome back!');

        if (data.user.role === 'developer') {
          navigate('/dashboard/developer');
        } else {
          navigate('/dashboard/company');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      {/* Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <LogIn size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome back</h1>
            <p className="text-gray-400 text-sm">Login to your Devlytic account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

          {/* Role Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => formik.setFieldValue('role', 'developer')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${formik.values.role === 'developer'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Developer
            </button>
            <button
              type="button"
              onClick={() => formik.setFieldValue('role', 'company')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${formik.values.role === 'company'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Company
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
              className={`bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-indigo-500'
                }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Your password"
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.password && formik.errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-indigo-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition mt-2"
          >
            {formik.isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin" /> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Create one here
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;