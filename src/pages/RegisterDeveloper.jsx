import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, Eye, EyeOff, Code2, Loader } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { setCredentials } from '../store/authSlice';
import { registerDeveloper } from '../services/authService';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const RegisterDeveloper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = await registerDeveloper({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        });

        dispatch(setCredentials({
          user: data.user,
          role: data.user.role,
          accessToken: data.accessToken,
        }));

        localStorage.setItem('refreshToken', data.refreshToken);
        toast.success('Account created successfully');
        navigate('/dashboard/developer');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      {/* Back */}
      <button
        onClick={() => navigate('/register')}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-10 self-start ml-4 transition"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <Code2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Developer Registration</h1>
            <p className="text-gray-400 text-sm">Create your developer account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Cynthia Omisore"
              className={`bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.fullName && formik.errors.fullName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-indigo-500'
                }`}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.fullName}</p>
            )}
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
              placeholder="cynthia@example.com"
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
                placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Repeat your password"
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-indigo-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.confirmPassword}</p>
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
                <Loader size={18} className="animate-spin" /> Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Login here
          </button>
        </p>

      </div>
    </div>
  );
};

export default RegisterDeveloper;