import { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import Cropper from 'react-easy-crop'
import type { Point, Area } from 'react-easy-crop'
import uploadIcon from '../assets/icons/upload_24dp_F3F3F3_FILL0_wght400_GRAD0_opsz24.svg'
import { uploadFileToStorage, createPost } from '../services/api'
import { getCurrentUser } from '../lib/supabaseClient'
import { supabase } from '../lib/supabaseClient'
import { motion, Reorder } from "framer-motion";
import { X, Crop } from "lucide-react";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

interface FileWithPreview extends File {
  preview: string
}

interface Building {
  building_code: string
  building_name: string
}

interface Tag {
  id: string
  code: string
}

const MAX_FILES = 3
// Use bucket name from env or fallback to actual project bucket
const STORAGE_BUCKET = (import.meta.env.VITE_POSTS_BUCKET as string) || 'posts_picture'

export default function UploadPage() {
  // --- Form State Variables ---
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [attendees, setAttendees] = useState('')
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [buildings, setBuildings] = useState<Building[]>([])
  const [buildingCode, setBuildingCode] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [timeHour, setTimeHour] = useState("12");
  const [timeMinute, setTimeMinute] = useState("00");
  const [timePeriod, setTimePeriod] = useState("PM");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Store tag IDs
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Cropping state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropIndexToEdit, setCropIndexToEdit] = useState<number | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileRef = useRef<FileWithPreview[]>([])

  // --- Helper: Create cropped image ---
  const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas size to cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels || cropIndexToEdit === null) return;

    try {
      const croppedBlob = await createCroppedImage(imageToCrop, croppedAreaPixels);
      const croppedFile = new File(
        [croppedBlob],
        files[cropIndexToEdit].name,
        { type: 'image/jpeg' }
      ) as FileWithPreview;
      croppedFile.preview = URL.createObjectURL(croppedBlob);

      // Revoke old preview URL
      URL.revokeObjectURL(files[cropIndexToEdit].preview);

      // Update the file in the array
      const newFiles = [...files];
      newFiles[cropIndexToEdit] = croppedFile;
      setFiles(newFiles);

      // Close modal
      setCropModalOpen(false);
      setImageToCrop(null);
      setCropIndexToEdit(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    }
  };

  const openCropModal = (index: number) => {
    setImageToCrop(files[index].preview);
    setCropIndexToEdit(index);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropModalOpen(true);
  };

  // --- Load Draft and Buildings on Mount ---

  useEffect(() => {
    document.title = 'CNCT | Create Event';
    
    // Fetch buildings from Supabase
    const fetchBuildings = async () => {
      const { data: buildingsData, error: buildingsError } = await supabase
        .from('fiu_buildings')
        .select('building_code, building_name')
        .order('building_code', { ascending: true });
      
      if (buildingsError) {
        console.error('Error fetching buildings:', buildingsError);
      } else {
        setBuildings(buildingsData || []);
      }
    };
    
    fetchBuildings();

    // Fetch tags from Supabase
    const fetchTags = async () => {
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('id, code')
        .order('id', { ascending: true });
      
      if (tagsError) {
        console.error('Error fetching tags:', tagsError);
      } else {
        setAvailableTags(tagsData?.map(tag => ({ id: tag.id.toString(), code: tag.code })) || []);
      }
    };
    
    fetchTags();

    // Load saved draft
    const savedDraft = localStorage.getItem('eventDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setDescription(draft.description || "");
        setAttendees(draft.attendees || "");
        if (draft.date) {
          setDate(dayjs(draft.date));
        }
        setBuildingCode(draft.buildingCode || "");
        setRoomNumber(draft.roomNumber || "");
        setTimeHour(draft.timeHour || "12");
        setTimeMinute(draft.timeMinute || "00");
        setTimePeriod(draft.timePeriod || "PM");
        setSelectedTags(draft.selectedTags || []);
        // Note: Files can't be restored from localStorage for security reasons
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

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

  // Keep a ref of current files for unmount cleanup only
  useEffect(() => {
    fileRef.current = files
  }, [files])

  // Revoke object URLs only on unmount to avoid StrictMode double-invoke issues
  useEffect(() => {
    return () => {
      fileRef.current.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [])

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

  // --- Tag Management ---

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  // --- Submission Handler ---

  const clearDraft = () => {
    const confirmed = window.confirm("Are you sure you want to clear the draft? This action cannot be undone.");
    if (confirmed) {
      localStorage.removeItem('eventDraft');
      
      // Revoke object URLs to free memory
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      
      // Clear all fields
      setTitle("");
      setDescription("");
      setAttendees("");
      setDate(dayjs());
      setBuildingCode("");
      setRoomNumber("");
      setTimeHour("12");
      setTimeMinute("00");
      setTimePeriod("PM");
      setSelectedTags([]);
      setFiles([]);
      setCurrentImageIndex(0);
      
      alert("Draft cleared successfully!");
    }
  };

  const saveDraft = () => {
    const draft = {
      title,
      description,
      attendees,
      date: date ? date.toISOString() : null,
      buildingCode,
      roomNumber,
      timeHour,
      timeMinute,
      timePeriod,
      selectedTags,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('eventDraft', JSON.stringify(draft));
    alert("Draft saved successfully!");
  };

  // Check if form has any content
  const hasFormContent = () => {
    return (
      title.trim() !== "" ||
      description.trim() !== "" ||
      attendees.trim() !== "" ||
      buildingCode !== "" ||
      roomNumber !== "" ||
      selectedTags.length > 0 ||
      files.length > 0
    );
  };

  const handleSave = async () => {
    // Validation checks
    const missingFields: string[] = [];
    
    if (!title.trim()) missingFields.push("Title");
    if (!description.trim()) missingFields.push("Description");
    if (!date) missingFields.push("Event Date");
    if (!buildingCode) missingFields.push("Building Location");
    if (files.length === 0) missingFields.push("At least 1 image");

    if (missingFields.length > 0) {
      alert(`Please complete the following required fields:\n\n${missingFields.join("\n")}`);
      return;
    }

    // Check if user is logged in
    console.log('🔍 DEBUG - Checking current user...');
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      console.error('❌ User not logged in:', userError);
      alert('You must be logged in to create a post. Please sign in first.');
      return;
    }
    
    console.log('✅ User authenticated:', user.email, 'ID:', user.id);
    
    let imageUrls: string[] = [];

    try {

      // Upload Pictures to Supabase Storage via backend
      for (const file of files) {
        const { url } = await uploadFileToStorage(file, STORAGE_BUCKET);
        imageUrls.push(url);
      }

      console.log('📸 Uploaded images:', imageUrls);

      // Insert Post Data into the 'posts' table via backend
      // Note: organizer_id will come from the auth token, not from the request body
      const created = await createPost({
        title: title,
        body: description,
        start_date: date ? date.toISOString() : new Date().toISOString(),
        post_picture_url: imageUrls.length > 0 ? imageUrls[0] : null,
        building: buildingCode || null,
        tag_ids: selectedTags.map(id => parseInt(id)).filter(id => !isNaN(id)), // Convert to integers, filter invalid
      } as any);

      console.log('✅ Post created:', created);
      alert('Listing saved successfully!');

      // Cleanup and Reset
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      
      // Clear draft from localStorage
      localStorage.removeItem('eventDraft');
      
      setTitle('');
      setDescription('');
      setAttendees('');
      setDate(dayjs());
      setBuildingCode("");
      setRoomNumber("");
      setTimeHour("12");
      setTimeMinute("00");
      setTimePeriod("PM");
      setSelectedTags([]);
      setFiles([]);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Submission Error:', error);
      alert(`Error saving data. ${(error as Error).message}`);
    }
  }

  // --- Rendered Previews (Small Upload Box) ---

  const smallPreviews = files.map((file, index) => (
    <Reorder.Item
      key={file.name}
      value={file}
      className="relative w-[8vh] h-[8vh] rounded overflow-hidden cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 10 }}
      onClick={() => setCurrentImageIndex(index)}
    >
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <img
          src={file.preview}
          className="object-cover w-full h-full pointer-events-none"
          alt={`Preview of ${file.name}`}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            openCropModal(index);
          }}
          className="absolute top-0 left-0 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold z-10 hover:bg-blue-700 transition-colors"
          aria-label={`Crop ${file.name}`}
          title="Crop image"
        >
          <Crop size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFile(file.name);
          }}
          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold z-10 hover:bg-red-700 transition-colors"
          aria-label={`Remove ${file.name}`}
        >
          &times;
        </button>
      </motion.div>
    </Reorder.Item>
  ));

  // --- Main Carousel Preview (Large Display Area) ---
  const mainCarouselPreview =
    files.length > 0 ? (
      <div className='relative w-full aspect-[16/9] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--tertiary)]/20 rounded-lg overflow-hidden group flex items-center justify-center'>
        {currentImageIndex < files.length && (
          <img
            src={files[currentImageIndex].preview}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            alt={`Listing Preview ${files[currentImageIndex].name}`}
          />
        )}
        {files.length > 1 && (
          <>
            <button
              onClick={goToPreviousImage}
              className="absolute left-2 bg-black bg-opacity-50 text-white p-2 rounded-full text-2xl z-10 hover:bg-opacity-75 transition-opacity cursor-pointer"
              aria-label="Previous image"
            >
              &#10094;
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-2 bg-black bg-opacity-50 text-white p-2 rounded-full text-2xl z-10 hover:bg-opacity-75 transition-opacity cursor-pointer"
              aria-label="Next image"
            >
              &#10095;
            </button>
          </>
        )}
        {files.length > 0 && (
          <>
            <div className='absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
              {currentImageIndex + 1} / {files.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openCropModal(currentImageIndex);
              }}
              className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full z-10 hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
              aria-label="Crop current image"
              title="Crop this image"
            >
              <Crop size={18} />
              <span className="text-sm font-semibold">Crop</span>
            </button>
          </>
        )}
      </div>
    ) : (
      // Default content when no files are uploaded - matching PostCard empty state
      <div className='relative w-full aspect-[16/9] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--tertiary)]/20 rounded-lg overflow-hidden flex items-center justify-center'>
        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/30 via-[var(--secondary)]/30 to-[var(--tertiary)]/30 flex flex-col items-center justify-center">
          <div className="text-[var(--text-secondary)] text-6xl mb-4 opacity-20">📸</div>
          <h2 className="font-semibold text-2xl text-[var(--primary)]">
            Your Listing Preview
          </h2>
          <p className="mt-3 w-full md:w-2/3 break-words text-center text-[var(--primary)] opacity-70 px-4">
            Upload images to see how your post will appear
          </p>
        </div>
      </div>
    )

  // --- Main Component Render ---
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-[var(--background)]"
    >
      {/* Crop Modal */}
      {cropModalOpen && imageToCrop && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCropModalOpen(false);
              setImageToCrop(null);
              setCropIndexToEdit(null);
            }
          }}
        >
          <div className="bg-[var(--card-bg)] rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl font-bold text-[var(--text)]">Crop Image (16:9)</h2>
              <button
                onClick={() => {
                  setCropModalOpen(false);
                  setImageToCrop(null);
                  setCropIndexToEdit(null);
                }}
                className="text-[var(--text)] hover:text-[var(--danger)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="relative flex-1 bg-black" style={{ minHeight: 0 }}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </div>
            
            <div className="p-4 border-t border-[var(--border)] flex-shrink-0">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--text)]">
                    Zoom
                  </label>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => {
                    e.stopPropagation();
                    setZoom(Number(e.target.value));
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full h-2 bg-[var(--secondary)] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((zoom - 1) / 2) * 100}%, var(--secondary) ${((zoom - 1) / 2) * 100}%, var(--secondary) 100%)`
                  }}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setCropModalOpen(false);
                    setImageToCrop(null);
                    setCropIndexToEdit(null);
                  }}
                  className="px-4 py-2 bg-[var(--secondary)] text-[var(--text)] rounded-lg hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <SideBar />
        <div className="flex-1 w-full min-h-screen flex flex-col lg:flex-row md:ml-[70px] pb-24 md:pb-6">
        
        {/* Left Column - Form Inputs */}
        <div className="flex w-full max-w-2xl mx-auto lg:max-w-none lg:w-full lg:flex-1 flex-col mt-4 md:mt-10 px-4 md:px-6 lg:px-8">
          
          {/* Mobile: Title and Date Preview */}
          <div className="lg:hidden mb-6">
            <h2 className="font-bold text-2xl text-center text-[var(--text)] mb-4">
              {title || "Title"}
            </h2>
            {date && (
              <p className="font-semibold text-lg text-center text-[var(--text)]">
                Event Date: {date.format("MMMM D, YYYY")}
              </p>
            )}
          </div>

          {/* Dropzone Area */}
          <div className="bg-[var(--secondary)] rounded-xl w-full max-w-2xl mx-auto h-48 lg:h-56 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] p-2">
            {files.length === 0 ? (
              <div
                {...getRootProps()}
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <img
                  src={uploadIcon}
                  className="h-10 w-10"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(63%) sepia(45%) saturate(451%) hue-rotate(0deg) brightness(94%) contrast(87%)'
                  }}
                  alt="Upload Icon"
                />
                <h2 className="text-xl m-2 text-[var(--primary)] text-center">
                  {isDragActive ? "Drop files here" : (
                    <>
                      Upload Pictures (Max {MAX_FILES}) <span className="text-red-600">*</span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-[var(--primary)] mt-1">(.jpg, .png, .jpeg)</p>
              </div>
            ) : (
              <div
                {...getRootProps({ onClick: (e) => e.stopPropagation() })}
                className="w-full h-full flex flex-row items-center justify-start flex-wrap gap-2"
              >
                <input {...getInputProps()} />
                <Reorder.Group
                  axis="x"
                  values={files}
                  onReorder={setFiles}
                  className="flex flex-wrap gap-2"
                >
                  {smallPreviews}
                </Reorder.Group>
                {files.length < MAX_FILES && (
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (input) input.click();
                    }}
                    className="bg-[var(--primary)] text-white w-[8vh] h-[8vh] flex items-center justify-center rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add More
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="flex flex-col mt-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text)]">
              Title <span className="text-red-600">*</span>
            </h2>
            <input
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-[var(--border)] rounded p-2 bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* Description Input */}
          <div className="flex flex-col mt-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text)]">
              Description <span className="text-red-600">*</span>
            </h2>
            <textarea
              placeholder="Event description..."
              className="w-full border-2 border-[var(--border)] rounded p-2 h-32 lg:h-40 resize-none text-sm placeholder:text-[var(--text-secondary)] overflow-y-auto bg-[var(--card-bg)] text-[var(--text)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Date Picker */}
          <div className="w-full mt-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={
                  <span>
                    Event Date <span className="text-red-600">*</span>
                  </span>
                }
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      style: { color: 'var(--text)', borderColor: 'var(--border)', borderWidth: '2px'}
                    },
                    InputLabelProps: {
                      style: { 
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                        backgroundColor: 'var(--background)',
                        paddingLeft: '4px',
                        paddingRight: '4px'
                      }
                    },
                    sx: {
                      '& .MuiInputLabel-root': { 
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                      },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border) !important', borderWidth: '2px' },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                      '& .MuiIconButton-root': { color: 'var(--primary)' },
                    },
                  },
                  layout: {
                    sx: {
                      // Calendar popup styling
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text)',
                      // Calendar elements
                      '.MuiPickersDay-root': {
                        color: 'var(--text)',
                        '&.Mui-selected': {
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-text)',
                        },
                      },
                      '.MuiPickersCalendarHeader-label': { color: 'var(--text)' },
                      '.MuiIconButton-root': { color: 'var(--primary)' },
                      '.MuiDayCalendar-weekDayLabel': { color: 'var(--text)' },
                      // Mobile toolbar
                      '.MuiPickersToolbar-root': { 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-text)',
                      },
                      '.MuiPickersToolbarText-root': { color: 'var(--primary-text)' },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          {/* Location Input */}
          <div className="flex flex-col mt-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text)]">
              Location <span className="text-red-600">*</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={buildingCode}
                onChange={(e) => setBuildingCode(e.target.value)}
                className="w-full md:flex-1 px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
              >
                <option value="">Select Building</option>
                {buildings.map(building => (
                  <option key={building.building_code} value={building.building_code}>
                    {building.building_code} - {building.building_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Room #"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full md:w-24 px-4 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>

          {/* Time Picker */}
          <div className="flex flex-col mt-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text)]">
              Time (EST) <span className="text-red-600">*</span>
            </h2>
            <div className="flex gap-2">
              <select
                value={timeHour}
                onChange={(e) => setTimeHour(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              <span className="flex items-center text-[var(--text)] font-bold">:</span>
              <select
                value={timeMinute}
                onChange={(e) => setTimeMinute(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
              >
                {['00', '15', '30', '45'].map(minute => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Tags Selection */}
          <div className="flex flex-col mt-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text)]">
              Tags
            </h2>
            
            {/* Predefined tag checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-3 px-4 py-3 border-2 border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--card-bg)] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleToggleTag(tag.id)}
                    className="w-5 h-5 rounded border-2 border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                  />
                  <span className="text-[var(--text)]">{tag.code}</span>
                </label>
              ))}
            </div>

            {/* Selected tags display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedTags.map((tagId) => {
                  const tag = availableTags.find(t => t.id === tagId);
                  return (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm"
                    >
                      #{tag?.code || tagId}
                      <button
                        onClick={() => handleRemoveTag(tagId)}
                        className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Attendees Input */}
          <div className="flex flex-col mt-6">
            <h2 className="text-lg font-semibold mb-3 text-[var(--text)]">
              Attendees <span className="text-red-600">*</span>
            </h2>
            <input
              placeholder="Amount of People"
              className="w-full border-2 border-[var(--border)] rounded p-2 bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)]"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6 mb-6 lg:mb-0 w-full max-w-md mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={saveDraft}
                disabled={!hasFormContent()}
                className={`w-full md:flex-1 rounded p-3 text-white font-bold transition-opacity ${
                  hasFormContent()
                    ? 'bg-[var(--tertiary)] cursor-pointer hover:opacity-90'
                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                Save Draft
              </button>
              <button
                onClick={handleSave}
                className="bg-[var(--primary-hover)] w-full md:flex-1 rounded cursor-pointer p-3 text-white font-bold hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </div>
            <button
              onClick={clearDraft}
              disabled={!hasFormContent()}
              className={`w-full rounded p-2 text-white text-sm font-semibold transition-opacity ${
                hasFormContent()
                  ? 'bg-[var(--danger)] cursor-pointer hover:opacity-90'
                  : 'bg-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              Clear Draft
            </button>
          </div>
        </div>

        {/* Middle Column - Preview Image */}
        <div className="w-full max-w-2xl mx-auto lg:max-w-none lg:w-full lg:flex-1 flex flex-col mt-6 lg:mt-10 px-4 md:px-6 lg:px-8">
          <h1 className="font-semibold text-base text-center lg:text-left text-[var(--text)] mb-2">
            Preview ({files.length} / {MAX_FILES} Pictures)
          </h1>
          <div className="w-full flex items-center justify-center flex-col">
            {mainCarouselPreview}
          </div>
        </div>

        {/* Right Column - Preview Details (Large Screens Only) */}
        <div className="hidden xl:flex xl:w-full xl:max-w-sm flex-col mt-10 px-6 xl:px-8">
          <h2 className="font-bold text-xl break-words text-[var(--text)] truncate whitespace-nowrap overflow-hidden min-w-0">{title || "Title"}</h2>
          
          {(buildingCode || roomNumber) && (
            <div className="mt-6">
              <h3 className="font-bold text-xl text-[var(--text)] mb-2">Location</h3>
              <p className="font-semibold text-lg text-[var(--text)]">
                {buildingCode && buildings.find(b => b.building_code === buildingCode)?.building_name}
                {roomNumber && ` - Room ${roomNumber}`}
              </p>
            </div>
          )}
          
          {date && (
            <div className="mt-6">
              <h3 className="font-bold text-xl text-[var(--text)] mb-2">Event Date</h3>
              <p className="font-semibold text-lg text-[var(--text)]">
                {date.format("MMMM D, YYYY")}
              </p>
            </div>
          )}
          
          {(timeHour || timeMinute || timePeriod) && (
            <div className="mt-6">
              <h3 className="font-bold text-xl text-[var(--text)] mb-2">Time</h3>
              <p className="font-semibold text-lg text-[var(--text)]">
                {timeHour}:{timeMinute} {timePeriod} EST
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-bold text-xl text-[var(--text)] mb-2">Description</h3>
            <p className="font-semibold text-base break-words text-[var(--text)]">
              {description || "No description yet"}
            </p>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-xl text-[var(--text)] mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = availableTags.find(t => t.id === tagId);
                  return (
                    <span
                      key={tagId}
                      className="inline-block px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm"
                    >
                      #{tag?.code || tagId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-bold text-xl text-[var(--text)] mb-2">Attendees</h3>
            <p className="font-semibold text-lg text-[var(--text)]">
              {attendees || "Not specified"}
            </p>
          </div>
        </div>

        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
  