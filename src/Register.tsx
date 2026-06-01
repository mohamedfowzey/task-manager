import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { User, Mail, Lock, Image, Upload } from 'lucide-react';
import { supabase } from './utils/supabase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Define the interface for the form fields
interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: FileList;
}

export default function Register(): React.JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  // Strictly typed file change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Type-safe onSubmit handler
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        // Storing additional user details inside Supabase data
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registration successful! Please check your email to confirm your account.");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 antialiased font-sans">
      {/* Main Card container matching refdesign.PNG */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Register Account
          </h1>
          <span className="bg-[#e6e6ff] text-[#3a24b5] text-xs font-semibold px-3 py-1 rounded-full">
            Step 1 of 1
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Profile Image Upload Component */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative group">
            <input 
              type="file" 
              accept="image/*"
              {...register('profileImage', { required: 'Profile image is required' })}
              onChange={(e) => {
                register('profileImage').onChange(e); // Let react-hook-form handle its internal state
                handleImageChange(e);                 // Handle custom preview state
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {imagePreview ? (
              <div className="relative w-20 h-20">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#5030f4]"
                />
                <div className="absolute bottom-0 right-0 bg-[#5030f4] p-1 rounded-full text-white">
                  <Upload size={12} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="p-2 bg-white rounded-full shadow-sm text-gray-400 group-hover:text-[#5030f4] transition-colors">
                  <Image size={24} />
                </div>
                <p className="text-xs font-medium text-gray-500">Upload profile picture</p>
              </div>
            )}
            {errors.profileImage && (
              <span className="text-xs text-red-500 mt-1">{errors.profileImage.message}</span>
            )}
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="John"
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5030f4]/20 focus:border-[#5030f4] transition-all text-sm placeholder-gray-400 text-gray-900"
                />
              </div>
              {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Doe"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5030f4]/20 focus:border-[#5030f4] transition-all text-sm placeholder-gray-400 text-gray-900"
                />
              </div>
              {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName.message}</span>}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
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
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
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
            Create Account
          </button>

          {/* Login Redirection link */}
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Have an account?{' '}
            <button 
              type="button"
              className="text-[#5030f4] font-bold hover:underline cursor-pointer focus:outline-none" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}