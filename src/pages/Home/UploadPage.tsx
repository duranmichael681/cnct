import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import uploadIcon from '../../assets/icons/upload_24dp_F3F3F3_FILL0_wght400_GRAD0_opsz24.svg'
import { uploadFileToStorage, createPost } from '../../services/api'
import { getCurrentUser } from '../../lib/supabaseClient'

interface FileWithPreview extends File {
  preview: string
}

// Define the maximum file limit
const MAX_FILES = 3
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB


export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [attendees, setAttendees] = useState('')
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)


  const fileRef = useRef<FileWithPreview[]>([])

  // --- Dropzone Logic ---

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {

      // reset previous upload errors
      setUploadError(null)

      // Filter out files that are too big
      const tooBig = acceptedFiles.find((file) => file.size > MAX_FILE_SIZE_BYTES)
      if (tooBig) {
        setUploadError('Image too large. Maximum size is 5MB.')
        // You can still allow smaller ones in the same drop if you want:
        // acceptedFiles = acceptedFiles.filter(f => f.size <= MAX_FILE_SIZE_BYTES)
        // but for now we’ll just block and show the error
        return
      }

      // Calculate slots available
      const remainingSlots = MAX_FILES - files.length
      if (remainingSlots <= 0) return // Prevent processing if limit is reached

      // Take only the files that fit
      const filesToProcess = acceptedFiles.slice(0, remainingSlots)

      const newFilesWithPreview: FileWithPreview[] = filesToProcess.map(
        (file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }) as FileWithPreview
      )

      setFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview])
      setCurrentImageIndex(0)
    },
    [files.length]
  ) // Dependency needed for remainingSlots calculation

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: MAX_FILES, // <-- Enforces the limit
  })

  // --- Cleanup Logic ---

  useEffect(() => {
    fileRef.current = files
  }, [files])

  useEffect(() => {
    return () => {
      fileRef.current.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [])

  // --- Carousel Navigation ---

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

  // --- Submission Handler ---

  // Use bucket name from env or fallback to actual project bucket
  const STORAGE_BUCKET = (import.meta.env.VITE_POSTS_BUCKET as string) || 'posts_picture'

  const handleSave = async () => {
    if (files.length === 0) {
      alert('Please upload at least one picture.')
      return
    }

    if (!title || !description || !date) {
      alert('Please fill out all required fields (Title, Description, Date).')
      return
    }

    // Ensure user is logged in (backend expects auth token)
    const { user, error: userError } = await getCurrentUser()
    if (userError || !user) {
      console.error('User not logged in or error:', userError)
      alert('You must be logged in to create a post. Please sign in first.')
      return
    }

    try {
      // Upload files via backend storage endpoint (will trigger size check there)
      const imageUrls: string[] = []

      for (const file of files) {
        const resp = await uploadFileToStorage(file, STORAGE_BUCKET)
        imageUrls.push(resp.url)
      }

      // Create the post (backend will take organizer from auth middleware)
      await createPost({
        title: title,
        body: description,
        start_date: date ? date.toISOString() : new Date().toISOString(),
        post_picture_url: imageUrls.length > 0 ? imageUrls[0] : null,
      } as any)

      alert('Listing and pictures saved successfully!')

      files.forEach((file) => URL.revokeObjectURL(file.preview))

      setTitle('')
      setDescription('')
      setAttendees('')
      setDate(dayjs())
      setFiles([])
      setCurrentImageIndex(0)
    } catch (err) {
      console.error('Error saving data:', err)
      // Surface the backend message when available
      const message = (err as Error).message || 'Error saving data.'
      alert(`Error saving data: ${message}`)
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

        {/* Navigation Arrows */}
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

        {/* Image Counter */}
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
        <p className='mt-5 w-1/3 break-words text-center text-white'>
          As you create your listing, you can preview how it will appear to others on Marketplace.
        </p>
      </>
    )

  // --- Main Component Render ---
  return (
    <div className='w-full min-h-screen flex'>
      <div className='flex w-1/3 m-10 flex-col'>
        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className='bg-[var(--secondary)] rounded-xl w-[40vh] h-[20vh] flex flex-row items-center justify-start flex-wrap gap-2 cursor-pointer border-2 border-dashed border-gray-400 p-2'
        >
          <input {...getInputProps()} />

          {files.length > 0 ? (
            // Show a gallery of small previews
            <div className='flex flex-wrap gap-2 w-full h-full'>
              {smallPreviews}
              {/* Show 'Add More' only if maxFiles limit hasn't been reached */}
              {files.length < MAX_FILES && (
                <div className='bg-[var(--primary)] text-white w-[8vh] h-[8vh] flex items-center justify-center rounded text-xs'>Add More</div>
              )}
            </div>
          ) : (
            // Default dropzone content
            <div className='flex flex-col items-center justify-center w-full h-full'>
              <img src={uploadIcon} className='h-10 w-10 text-white' alt='Upload Icon' />
              <h2 className='font-semibold text-xl m-2 text-white text-center'>
                {isDragActive ? 'Drop files here' : `Upload Pictures (Max ${MAX_FILES})`}
              </h2>
              <p className='text-xs text-gray-300'>(.jpg, .png, .jpeg)</p>
            </div>
          )}
        </div>
        {/* End Dropzone Integration */}

        {uploadError && (
          <p className='mt-2 text-sm text-red-500'>
            {uploadError}
          </p>
        )}

        <div className=' flex flex-col mt-10 '>
          <h2 className='text-xl font-semibold mb-5'>Title</h2>
          <input placeholder='Event Title' value={title} onChange={(e) => setTitle(e.target.value)} className=' border-2 rounded p-2' />
        </div>
        <div className=' flex flex-col mt-10 '>
          <h2 className='text-xl font-semibold mb-5'>Description</h2>
          <textarea
            placeholder='Event description...'
            // 👇 FIX APPLIED: Added overflow-y-auto to enforce scrolling within the fixed h-[20vh]
            className=' border-2 rounded p-2 h-[20vh] resize-none text-sm placeholder:text-gray-400 overflow-y-auto'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className='w-1/2 mt-10 flex justify-center'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label='Event Date' value={date} onChange={(newValue) => setDate(newValue)} />
          </LocalizationProvider>
        </div>
        <div className=' flex flex-col mt-10 '>
          <h2 className='text-xl font-semibold mb-5'>Attendees</h2>
          <input placeholder='Amount of People' className='border-2 rounded p-2' value={attendees} onChange={(e) => setAttendees(e.target.value)} />
        </div>
        <div className='flex flex-col justify-center items-center w-1/2 '>
          <button onClick={handleSave} className='bg-[var(--primary-hover)]  w-full mt-10 rounded cursor-pointer p-3 text-white font-bold'>
            Submit
          </button>
        </div>
      </div>

      {/* Listing Preview Section: The Carousel */}
      <div className='w-3/4 flex-col min-h-screen mt-10'>
        <h1 className='font-semibold'>
          Preview ({files.length} / {MAX_FILES} Pictures)
        </h1>
        <div className='w-3/4 bg-[var(--secondary-hover)] h-[80vh] flex items-center justify-center flex-col overflow-hidden rounded-xl relative'>
          {mainCarouselPreview}
        </div>
      </div>

      {/* Details Preview Section */}
      <div className='w-1/4 flex-col flex min-h-screen mt-10'>
        <h2 className='font-bold text-4xl break-words'>{title || 'Title'}</h2>
        {date && <p className='font-semibold text-2xl mt-10'>Event Date: {date.format('MMMM D, YYYY')}</p>}{' '}
        <h2 className='font-semibold text-l mt-10 break-words '>{description || 'Description'}</h2>
        {attendees && <h2 className='font-bold text-2xl mt-10'>Attendees </h2>}
        {attendees && <h2 className='font-bold text-2xl mt-2'>{attendees || 'Limit'}</h2>}
      </div>
    </div>
  )
}
