import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SignIn() {
  return (
    <div className='flex flex-row'>
      {/* ⬅️ LEFT COLUMN: Now uses Flexbox for content placement */}
      <div className='w-1/3 h-[100vh] flex justify-center items-start pt-[15vh]'>
        {/* Removed 'top-[15vh] ml-15 absolute' */}
        <div className='px-6 max-w-sm w-full'>
          <h1 className='font-bold text-2xl'>Welcome Back</h1>

          <div className='mt-10'>
            <h1 className='text-lg'>Email Address</h1>
            <input placeholder='Enter your email' className='pl-2 border-2 rounded-xl border-[#8f8b86] w-full p-2 text-sm' />
          </div>

          <div className='mt-10'>
            <h1 className='text-lg'>Password</h1>
            <input placeholder='Enter your password' className='pl-2 border-2 rounded-xl border-[#8f8b86] w-full p-2 text-sm' />
          </div>

          <button className='mt-10 border p-2 bg-[#B6862C] border-[#B6862C] rounded-xl w-full text-white'>Sign In</button>

          <div className='flex items-center mt-6'>
            <div className='flex-grow h-px bg-[#8f8b86]'></div> {/* Left line */}
            <span className='mx-4 text-gray-500'>or</span> {/* Text in the middle */}
            <div className='flex-grow h-px bg-[#8f8b86]'></div> {/* Right line */}
          </div>

          <div className='mt-6 flex flex-col gap-4'>
            {/* Changed to flex-col for better button stacking/alignment */}
            <button className='flex items-center justify-center gap-1 border border-[#8f8b86] rounded-xl p-2 hover:bg-gray-50 transition w-full'>
              <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google' className='w-5 h-5' />
              <span className='text-gray-700 font-medium'>Sign in with Google</span>
            </button>
            <motion.button className='flex items-center justify-center gap-3 border border-[#8f8b86] rounded-xl p-2 hover:bg-gray-50 transition w-full'>
              <img src='https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' alt='Apple' className='w-5 h-5' />
              <span className='text-gray-700 font-medium'>Sign in with Apple</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ➡️ RIGHT COLUMN (Picture) - No changes needed here for the fix */}
      <div
        className='w-2/3 h-[100vh] bg-cover bg-center bg-no-repeat rounded-xl'
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80')",
        }}
      ></div>
    </div>
  )
}
