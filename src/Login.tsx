import React from 'react';
import { useForm,type SubmitHandler } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';

// Define the interface for the login fields
interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Login(): React.JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  // Type-safe onSubmit handler
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const {error} = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
        console.error("Login Error:", error);
        alert(error.message);
    } else {
        navigate('/');
    }
    
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 antialiased font-sans">
      {/* Main Card container matching refdesign.PNG */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Welcome Back
          </h1>
          <span className="bg-[#e6e6ff] text-[#3a24b5] text-xs font-semibold px-3 py-1 rounded-full">
            Sign In
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5030f4]/20 focus:border-[#5030f4] transition-all text-sm placeholder-gray-400 text-gray-900"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs font-semibold text-[#5030f4] hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required'
                })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5030f4]/20 focus:border-[#5030f4] transition-all text-sm placeholder-gray-400 text-gray-900"
              />
            </div>
            {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
          </div>

         

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#5030f4] hover:bg-[#4024d6] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-150 transform active:scale-[0.98] shadow-md shadow-[#5030f4]/10 mt-2 text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Don't have an account?{' '}
          <button className="text-[#5030f4] font-bold hover:underline cursor-pointer" onClick={() =>navigate('/register')}>
            Register
          </button>
        </p>

      </div>
    </div>
  );
}