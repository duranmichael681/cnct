import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import NavigationButtons from './NavigationButtons'
import Dropdown from './Dropdown'
import MultiSelect from './MultiSelect'

export interface QuestionnaireData {
  firstName: string
  lastName: string
  pronouns: string
  classStanding: string
  major: string
  interests: string[]
  nickname: string
  email: string
}

const TOTAL_STEPS = 5

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const { step } = useParams<{ step: string }>()
  const currentStep = parseInt(step || '1')

  const [formData, setFormData] = useState<QuestionnaireData>(() => {
    const saved = localStorage.getItem('questionnaireData')
    return saved
      ? JSON.parse(saved)
      : {
          firstName: '',
          lastName: '',
          pronouns: '',
          classStanding: '',
          major: '',
          interests: [],
          nickname: '',
          email: ''
        }
  })

  useEffect(() => {
    localStorage.setItem('questionnaireData', JSON.stringify(formData))
  }, [formData])

  const updateField = <K extends keyof QuestionnaireData>(field: K, value: QuestionnaireData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // FIU email: 4+ letters, 3+ digits, @fiu.edu
  const isValidFiuEmail = (email: string) => {
    return /^[a-zA-Z]{4,}[0-9]{3,}@fiu\.edu$/.test(email)
  }

  const canProceedFromStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return formData.firstName.trim() !== ''
      case 2:
        return formData.pronouns !== ''
      case 3:
        return formData.classStanding !== ''
      case 4:
        return formData.interests.length > 0
      case 5:
        return formData.nickname.trim() !== '' && isValidFiuEmail(formData.email)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedFromStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        navigate(`/questionnaire/${currentStep + 1}`)
      } else {
        navigate('/questionnaire/complete')
      }
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/questionnaire/start')
    } else if (currentStep > 1) {
      navigate(`/questionnaire/${currentStep - 1}`)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Required Field Legend - Only on Q1 */}
        {currentStep === 1 && (
          <div className="text-center mb-6">
            <p className="text-xs font-bold text-[var(--text)]">
              <span className="text-red-500">*</span> Answer Required
            </p>
          </div>
        )}

        {/* Question Content */}
        <div className="bg-[var(--card-bg)] rounded-lg p-6 md:p-8 shadow-xl mb-6 text-[var(--text)] dark:text-[var(--primary)]">
          {/* Question 1: Name */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
                  What is your first name (Can be preferred name)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Enter text here."
                  className="w-full h-11 bg-white dark:bg-[var(--background)] border-2 border-[var(--border)] rounded-[50px] px-6 text-sm font-bold text-[var(--text)] placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
                  What is your last name?
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Enter text here."
                  className="w-full h-11 bg-white dark:bg-[var(--background)] border-2 border-[var(--border)] rounded-[50px] px-6 text-sm font-bold text-[var(--text)] placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Question 2: Pronouns */}
          {currentStep === 2 && (
            <Dropdown
              label="What are your pronouns?"
              required
              options={['he/him', 'she/her', 'they/them', 'other', 'prefer not to answer']}
              value={formData.pronouns}
              onChange={(value) => updateField('pronouns', value)}
            />
          )}

          {/* Question 3: Class Standing & Major */}
          {currentStep === 3 && (
            <div>
              <Dropdown
                label="What is your class standing?"
                required
                options={['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate/Alumni']}
                value={formData.classStanding}
                onChange={(value) => updateField('classStanding', value)}
              />

              <div className="mt-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
                  What is your major?
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => updateField('major', e.target.value)}
                  placeholder="Enter your major"
                  className="w-full h-11 bg-white dark:bg-[var(--background)] border-2 border-[var(--border)] rounded-[50px] px-6 text-sm font-bold text-[var(--text)] placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Question 4: Interests */}
          {currentStep === 4 && (
            <MultiSelect
              label="What types of events are you interested in? Choose at least one."
              required
              predefinedOptions={[
                'Academic & Career',
                'Arts & Culture',
                'Athletics & Recreation',
                'Campus Life & Community',
                'Information Sessions & Fairs'
              ]}
              selectedValues={formData.interests}
              onChange={(values) => updateField('interests', values)}
              placeholder="Type your own interest and press Enter"
            />
          )}

          {/* Question 5: Nickname & Email */}
          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
                  What do you want us to call you?
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => updateField('nickname', e.target.value)}
                  placeholder="Enter your nickname"
                  className="w-full h-11 bg-white dark:bg-[var(--background)] border-2 border-[var(--border)] rounded-[50px] px-6 text-sm font-bold text-[var(--text)] placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2 text-center">
                  What is your FIU Email Address? (i.e., abc123@fiu.edu)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter your FIU email"
                  className="w-full h-11 bg-white dark:bg-[var(--background)] border-2 border-[var(--border)] rounded-[50px] px-6 text-sm font-bold text-[var(--text)] placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                {formData.email && !isValidFiuEmail(formData.email) && (
                  <p className="text-xs text-red-500 mt-2 text-center">Please enter a valid FIU email address (e.g., abcd123@fiu.edu)</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Navigation Buttons */}
        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          canProceed={canProceedFromStep(currentStep)}
          isFirstStep={false}
          buttonClassName="bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white dark:text-[var(--primary)]"
        />
      </div>
    </div>
  )
}
