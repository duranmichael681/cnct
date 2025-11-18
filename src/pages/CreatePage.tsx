import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { motion, Reorder } from "framer-motion";
import uploadIcon from "../assets/icons/upload_24dp_F3F3F3_FILL0_wght400_GRAD0_opsz24.svg";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

interface FileWithPreview extends File {
  preview: string;
}

// Define the maximum file limit
const MAX_FILES = 3;

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fileRef = useRef<FileWithPreview[]>([]);

  // --- Load Draft on Mount ---

  useEffect(() => {
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
        // Note: Files can't be restored from localStorage for security reasons
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // --- Dropzone Logic ---

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Calculate slots available
      const remainingSlots = MAX_FILES - files.length;
      if (remainingSlots <= 0) return; // Prevent processing if limit is reached

      // Take only the files that fit
      const filesToProcess = acceptedFiles.slice(0, remainingSlots);

      const newFilesWithPreview: FileWithPreview[] = filesToProcess.map(
        (file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }) as FileWithPreview
      );

      setFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview]);
      setCurrentImageIndex(0);
    },
    [files.length]
  ); // Dependency needed for remainingSlots calculation

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
    maxFiles: MAX_FILES, // <-- Enforces the limit
  });

  // --- Cleanup Logic ---

  useEffect(() => {
    fileRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      fileRef.current.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  // --- Carousel Navigation ---

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === files.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? files.length - 1 : prevIndex - 1
    );
  };

  const removeFile = (name: string) => {
    const fileToRemove = files.find((file) => file.name === name);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((file) => file.name !== name);
    setFiles(updatedFiles);

    if (currentImageIndex >= updatedFiles.length && updatedFiles.length > 0) {
      setCurrentImageIndex(updatedFiles.length - 1);
    } else if (updatedFiles.length === 0) {
      setCurrentImageIndex(0);
    }
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
      files.length > 0
    );
  };

  const handleSave = async () => {
    // Validation checks
    const missingFields: string[] = [];
    
    if (!title.trim()) missingFields.push("Title");
    if (!description.trim()) missingFields.push("Description");
    if (!date) missingFields.push("Event Date");
    if (!attendees.trim()) missingFields.push("Attendees");
    if (files.length === 0) missingFields.push("At least 1 image");

    if (missingFields.length > 0) {
      alert(`Please complete the following required fields:\n\n${missingFields.join("\n")}`);
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("attendees", attendees);
    formData.append("date", date ? date.toISOString() : "");

    files.forEach((file, index) => {
      formData.append(`picture-${index}`, file);
    });

    try {
      const response = await fetch("/api/upload-listing", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Listing and pictures saved successfully!");

        files.forEach((file) => URL.revokeObjectURL(file.preview));

        // Clear draft from localStorage
        localStorage.removeItem('eventDraft');

        setTitle("");
        setDescription("");
        setAttendees("");
        setDate(dayjs());
        setFiles([]);
        setCurrentImageIndex(0);
      } else {
        const errorData = await response.json();
        alert(`Failed to save. ${errorData.message || ""}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving data.");
    }
  };

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
      <div className="relative w-full h-full flex items-center justify-center">
        {currentImageIndex < files.length && (
          <img
            src={files[currentImageIndex].preview}
            className="object-contain w-full h-full"
            alt={`Listing Preview ${files[currentImageIndex].name}`}
          />
        )}

        {/* Navigation Arrows */}
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

        {/* Image Counter */}
        {files.length > 0 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {files.length}
          </div>
        )}
      </div>
    ) : (
      // Default content when no files are uploaded
      <>
        <h2 className="font-semibold text-2xl text-[var(--primary)]">
          Your Listing Preview
        </h2>
        <p className="mt-5 w-full md:w-1/3 break-words text-center text-[var(--primary)] opacity-70 px-4">
          As you create your listing, you can preview how it will appear to
          others on Marketplace.
        </p>
      </>
    );

  // --- Main Component Render ---
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-[var(--background)]"
    >
      <div className="flex flex-1">
        <SideBar />
        <div className="flex-1 w-full min-h-screen flex flex-col md:flex-row md:ml-[70px] pb-24 md:pb-6">
        
        {/* Left Column - Form Inputs */}
        <div className="flex w-full max-w-md mx-auto md:max-w-none md:w-1/3 md:mx-10 flex-col mt-4 md:mt-10 px-4 md:px-0">
          
          {/* Mobile: Title and Date Preview */}
          <div className="md:hidden mb-6">
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
          <div className="bg-[var(--secondary)] rounded-xl w-full md:w-[60vh] md:mx-auto h-[18vh] md:h-[20vh] flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] p-2">
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
              className="w-full border-2 border-[var(--border)] rounded p-2 h-[15vh] md:h-[20vh] resize-none text-sm placeholder:text-[var(--text-secondary)] overflow-y-auto bg-[var(--card-bg)] text-[var(--text)]"
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
          <div className="flex flex-col gap-3 mt-6 w-full md:w-[40vh] md:mx-auto">
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
        <div className="w-full max-w-md mx-auto md:max-w-none md:w-2/5 flex flex-col mt-6 md:mt-10 px-4 md:px-0">
          <h1 className="font-semibold text-base text-center md:text-left text-[var(--text)] mb-2">
            Preview ({files.length} / {MAX_FILES} Pictures)
          </h1>
          <div className="w-full bg-[var(--secondary-hover)] h-[40vh] md:h-[80vh] flex items-center justify-center flex-col overflow-hidden rounded-xl relative">
            {mainCarouselPreview}
          </div>
        </div>

        {/* Right Column - Preview Details (Desktop Only) */}
        <div className="hidden md:flex md:w-1/4 flex-col mt-10 px-10 pr-10">
          <h2 className="font-bold text-4xl break-words text-[var(--text)]">{title || "Title"}</h2>
          {date && (
            <p className="font-semibold text-2xl mt-6 text-[var(--text)]">
              Event Date: {date.format("MMMM D, YYYY")}
            </p>
          )}
          <h2 className="font-semibold text-lg mt-6 break-words text-[var(--text)]">
            {description || "Description"}
          </h2>
          {attendees && (
            <>
              <h2 className="font-bold text-2xl mt-6 text-[var(--text)]">Attendees</h2>
              <h2 className="font-bold text-xl mt-2 text-[var(--text)]">{attendees}</h2>
            </>
          )}
        </div>

        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
