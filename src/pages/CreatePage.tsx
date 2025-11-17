import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import uploadIcon from '../assets/icons/upload_24dp_F3F3F3_FILL0_wght400_GRAD0_opsz24.svg'
import { Link } from 'react-router-dom'

// NOTE: You must uncomment this line and ensure your supabaseClient is correctly configured.
// import { supabase } from '../supabaseClient';

interface FileWithPreview extends File {
  preview: string
}

const MAX_FILES = 3
// For unauthenticated testing, use the correct bucket name you confirmed earlier.
const STORAGE_BUCKET = 'posts_picture'

export default function UploadPage() {
  // --- Form State Variables ---
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [attendees, setAttendees] = useState('')
  const [date, setDate] = useState<Dayjs | null>(dayjs())

  // --- Image Upload State ---
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const fileRef = useRef<FileWithPreview[]>([])

  // --- Dropzone Logic ---

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = MAX_FILES - files.length
      if (remainingSlots <= 0) return

      const filesToProcess = acceptedFiles.slice(0, remainingSlots)

      const newFilesWithPreview: FileWithPreview[] = filesToProcess.map(
        (file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }) as FileWithPreview
      )

      setFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview])
      setCurrentImageIndex(files.length)
    },
    [files.length]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: MAX_FILES,
  })

  // --- Cleanup Logic ---

  useEffect(() => {
    fileRef.current = files
    return () => {
      fileRef.current.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  // --- Carousel Navigation & Removal ---

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === files.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? files.length - 1 : prevIndex - 1))
  }

  const removeFile = (name: string) => {
    const fileToRemove = files.find((file) => file.name === name)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    const updatedFiles = files.filter((file) => file.name !== name)
    setFiles(updatedFiles)

    if (currentImageIndex >= updatedFiles.length && updatedFiles.length > 0) {
      setCurrentImageIndex(updatedFiles.length - 1)
    } else if (updatedFiles.length === 0) {
      setCurrentImageIndex(0)
    }
  }

  // --- 💾 Submission Handler (Using Supabase structure for testing) ---

  const handleSave = async () => {
    if (files.length === 0) {
      alert('Please upload at least one picture.')
      return
    }
    if (!title || !description || !date) {
      alert('Please fill out all required fields (Title, Description, Date).')
      return
    }

    // 🛑 TEMPORARY: Hardcode the Organizer ID
    const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
    let imageUrls: string[] = []
    alert('Starting upload and insertion...')

    try {
      // 3. Upload Pictures to Supabase Storage
      for (const file of files) {
        const filePath = `${TEST_USER_ID}/${Date.now()}-${file.name.replace(/\s/g, '_')}`

        // 🚨 Supabase code omitted for brevity
      }

      // 4. Insert Post Data into the 'post' table (Assuming structure is simple)
      const postData = {
        uidD: TEST_USER_ID,
        title: title,
        body: description,
        organizer_id: TEST_USER_ID,
        date: date ? date.toISOString() : null,
        post_picture_url: imageUrls.length > 0 ? imageUrls[0] : null,
      }

      // 🚨 Supabase code omitted for brevity

      alert('Listing saved successfully!')

      // Cleanup and Reset
      files.forEach((file) => URL.revokeObjectURL(file.preview))
      setTitle('')
      setDescription('')
      setAttendees('')
      setDate(dayjs())
      setFiles([])
      setCurrentImageIndex(0)
    } catch (error) {
      console.error('Submission Error:', error)
      alert(`Error saving data. Please check console. Error: ${(error as Error).message}`)
    }
  }

  // --- Rendered Previews (Small Upload Box) ---
  const smallPreviews = files.map((file) => (
    <div key={file.name} className='relative w-[8vh] h-[8vh] rounded overflow-hidden'>
      <img src={file.preview} className='object-cover w-full h-full' alt={`Preview of ${file.name}`} />
      <button
        onClick={(e) => {
          e.stopPropagation()
          removeFile(file.name)
        }}
        className='absolute top-[-5px] right-[-5px] bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold z-10'
        aria-label={`Remove ${file.name}`}
      >
        &times;
      </button>
    </div>
  ))

  // --- Main Carousel Preview (Large Display Area) ---
  const mainCarouselPreview =
    files.length > 0 ? (
      <div className='relative w-full h-full flex items-center justify-center'>
        {currentImageIndex < files.length && (
          <img
            src={files[currentImageIndex].preview}
            className='object-contain w-full h-full'
            alt={`Listing Preview ${files[currentImageIndex].name}`}
          />
        )}
        {files.length > 1 && (
          <>
            <button
              onClick={goToPreviousImage}
              className='absolute left-2 bg-black bg-opacity-50 text-white p-2 rounded-full text-2xl z-10 hover:bg-opacity-75 transition-opacity'
              aria-label='Previous image'
            >
              &#10094;
            </button>
            <button
              onClick={goToNextImage}
              className='absolute right-2 bg-black bg-opacity-50 text-white p-2 rounded-full text-2xl z-10 hover:bg-opacity-75 transition-opacity'
              aria-label='Next image'
            >
              &#10095;
            </button>
          </>
        )}
        {files.length > 0 && (
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
            {currentImageIndex + 1} / {files.length}
          </div>
        )}
      </div>
    ) : (
      // Default content when no files are uploaded
      <>
        <h2 className='font-semibold text-2xl text-white'>Your Listing Preview</h2>
        <p className='mt-5 w-full px-4 text-center text-white lg:w-1/3'>
          As you create your listing, you can preview how it will appear to others on Marketplace.
        </p>
      </>
    )

  // --- Main Component Render ---
  return (
    // 1. Main Container: Stacked column on mobile, switches to row on large screens
    <div className='w-full min-h-screen flex flex-col lg:flex-row'>
      {/* 2. Left Column: Form Inputs (Full width mobile, 1/3 desktop) */}
      <div className='flex flex-col w-full px-4 py-6 lg:w-1/3 lg:m-10'>
        {/* ⬅️ CORRECTED BACK BUTTON STYLING */}
        <Link to='/home' className='w-fit mb-6 text-xl font-semibold text-gray-700 hover:text-[var(--primary)] transition-colors'>
          &larr; Back to Home
        </Link>

        {/* Dropzone Area: Full width on mobile, fixed width on desktop for consistent look */}
        <div
          {...getRootProps()}
          className='bg-[var(--secondary)] rounded-xl w-full max-w-sm mx-auto h-[20vh] flex flex-row items-center justify-start flex-wrap gap-2 cursor-pointer border-2 border-dashed border-gray-400 p-2 lg:w-[40vh]'
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <div className='flex flex-wrap gap-2 w-full h-full'>
              {smallPreviews}
              {files.length < MAX_FILES && (
                <div className='bg-[var(--primary)] text-white w-[8vh] h-[8vh] flex items-center justify-center rounded text-xs'>Add More</div>
              )}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center w-full h-full'>
              <img src={uploadIcon} className='h-10 w-10 text-white' alt='Upload Icon' />
              <h2 className='font-semibold text-xl m-2 text-white text-center'>
                {isDragActive ? 'Drop files here' : `Upload Pictures (Max ${MAX_FILES})`}
              </h2>
              <p className='text-xs text-gray-300'>(.jpg, .png, .jpeg)</p>
            </div>
          )}
        </div>

        {/* Form Fields - Mobile friendly stacking */}
        <div className=' flex flex-col mt-8 '>
          <h2 className='text-xl font-semibold mb-3'>Title</h2>
          <input placeholder='Event Title' value={title} onChange={(e) => setTitle(e.target.value)} className=' border-2 rounded p-2' />
        </div>
        <div className=' flex flex-col mt-8 '>
          <h2 className='text-xl font-semibold mb-3'>Description</h2>
          <textarea
            placeholder='Event description...'
            className=' border-2 rounded p-2 h-[20vh] resize-none text-sm placeholder:text-gray-400 overflow-y-auto'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className='w-full mt-8 flex justify-start'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label='Event Date' value={date} onChange={(newValue) => setDate(newValue)} />
          </LocalizationProvider>
        </div>
        <div className=' flex flex-col mt-8 '>
          <h2 className='text-xl font-semibold mb-3'>Attendees</h2>
          <input placeholder='Amount of People' className='border-2 rounded p-2' value={attendees} onChange={(e) => setAttendees(e.target.value)} />
        </div>

        <div className='flex flex-col justify-center items-center w-full lg:w-1/2'>
          <button onClick={handleSave} className='bg-[var(--primary-hover)] w-full mt-10 rounded cursor-pointer p-3 text-white font-bold'>
            Submit
          </button>
        </div>
      </div>

      {/* 3. Right Column: Preview and Details (Stacks below form on mobile, columns on desktop) */}
      <div className='w-full px-4 py-6 flex flex-col lg:w-2/3 lg:flex-row lg:m-10 lg:pl-0'>
        {/* Carousel Preview (Full width mobile, 3/4 of the right column on desktop) */}
        <div className='w-full flex-col mb-6 lg:w-3/4'>
          <h1 className='font-semibold'>
            Preview ({files.length} / {MAX_FILES} Pictures)
          </h1>
          <div className='w-full bg-[var(--secondary-hover)] h-[50vh] flex items-center justify-center flex-col overflow-hidden rounded-xl relative mt-2 lg:h-[80vh]'>
            {mainCarouselPreview}
          </div>
        </div>

        {/* Details Preview (Full width mobile, 1/4 of the right column on desktop) */}
        <div className='w-full flex-col flex lg:w-1/4 lg:pl-6'>
          <h2 className='font-bold text-3xl break-words lg:text-4xl'>{title || 'Title'}</h2>
          {date && <p className='font-semibold text-xl mt-4 lg:mt-10'>Event Date: {date.format('MMMM D, YYYY')}</p>}
          <h2 className='font-semibold text-base mt-4 break-words lg:text-lg '>{description || 'Description'}</h2>
          {attendees && <h2 className='font-bold text-xl mt-6 lg:mt-10'>Attendees </h2>}
          {attendees && <h2 className='font-bold text-xl mt-2'>{attendees || 'Limit'}</h2>}
        </div>
      </div>
    </div>
  )
}
