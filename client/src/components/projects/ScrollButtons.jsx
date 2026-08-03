import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function ScrollButtons({ onPrev, onNext, label = 'projects' }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label={`Scroll ${label} left`}
        className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <FiArrowLeft size={20} />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={`Scroll ${label} right`}
        className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <FiArrowRight size={20} />
      </button>
    </div>
  );
}
