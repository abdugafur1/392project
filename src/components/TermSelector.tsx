export const terms = ['Fall', 'Winter', 'Spring'] as const;

export type Term = (typeof terms)[number];

interface TermSelectorProps {
  selectedTerm: Term;
  onTermChange: (term: Term) => void;
}

export const TermSelector = ({
  selectedTerm,
  onTermChange,
}: TermSelectorProps) => (
  <div
    aria-label="Select term"
    className="flex justify-center gap-2"
    role="group"
  >
    {terms.map((term) => (
      <button
        aria-pressed={term === selectedTerm}
        className="cursor-pointer rounded border border-gray-500 px-4 py-2 transition-colors hover:bg-gray-200 active:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 aria-pressed:bg-gray-200"
        key={term}
        onClick={() => onTermChange(term)}
        type="button"
      >
        {term}
      </button>
    ))}
  </div>
);
