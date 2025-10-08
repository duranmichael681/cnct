import React from 'react'
import { useState } from 'react'

export default function SignUp() {
  return (
    <div className='flex flex-row'>
      <div className=' w-1/2 h-[100vh] flex  relative'>
        <div className='top-[10vh] ml-7 absolute'>
          <h1 className='font-bold text-2xl'>Welcome To CNCT</h1>
          <div className='mt-10 '>
            <h1 className=' text-lg  '> Name</h1>
            <input placeholder='Enter your name' className=' pl-2 border-2 rounded-xl border-[#D6D2CD] w-[42vh] p-2 text-sm' />
          </div>
          <div className='mt-10 '>
            <h1 className=' text-lg  '> Email Address</h1>
            <input placeholder='Enter your email' className=' pl-2 border-2 rounded-xl border-[#D6D2CD] w-[42vh] p-2 text-sm' />
          </div>
          <div className='mt-10'>
            <h1 className=' text-lg  '> Password</h1>
            <input placeholder='Enter your passwords' className=' pl-2 border-2 rounded-xl border-[#D6D2CD] w-[42vh] p-2 text-sm' />
          </div>
          <div className='mt-5 flex row'>
            <input type='checkbox' />
            <h1 className='ml-2'>I agree to terms & policy</h1>
          </div>
          <button className='mt-10 border p-2 bg-[#B6862C] border-[#B6862C] rounded-xl w-[42vh] text-white '> SignUp </button>
          <div className='flex items-center mt-6'>
            <div className='flex-grow h-px bg-[#F5F5F5]'></div> {/* Left line */}
            <span className='mx-4 text-gray-500'>or</span> {/* Text in the middle */}
            <div className='flex-grow h-px bg-[#F5F5F5]'></div> {/* Right line */}
          </div>
        </div>
      </div>
      <div className='bg-amber-500 w-1/2 h-[100vh]'> </div>
    </div>
  )
}
