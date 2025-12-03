import { X } from 'lucide-react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[var(--card-bg)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-800 cursor-pointer"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Terms & Policies</h2>

        <div className="space-y-4 text-[var(--text)]">
          <section>
            <h3 className="text-xl font-semibold mb-2">1. No Cyberbullying</h3>
            <p className="text-sm">
              All users are expected to treat others with respect. Harassment, bullying, or any form of abusive behavior will not be tolerated.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">2. Appropriate Language</h3>
            <p className="text-sm">
              Use of inappropriate, offensive, or vulgar language is strictly prohibited. Keep all communications professional and respectful.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">3. No Selling or Transferring Profiles</h3>
            <p className="text-sm">
              User accounts are personal and non-transferable. Selling, trading, or transferring your profile is not allowed.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">4. No Inappropriate Images</h3>
            <p className="text-sm">
              Posting explicit, offensive, or inappropriate images is forbidden. All content should be suitable for all audiences.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">5. No Solicitation</h3>
            <p className="text-sm">
              Soliciting other users for commercial purposes, spam, or any unsolicited communications is prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">6. FIU Modesto Maidique Campus Events Only</h3>
            <p className="text-sm">
              Only events taking place at FIU Modesto Maidique Campus may be advertised or discussed on this platform. Events at other locations are not permitted.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">7. Compliance</h3>
            <p className="text-sm">
              Violation of these terms may result in account suspension or termination. By using this app, you agree to abide by these policies.
            </p>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] dark:text-[var(--background)] font-bold py-2 px-4 rounded cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  )
}
