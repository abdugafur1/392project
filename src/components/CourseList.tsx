import type { Course, Schedule } from '../types/Course';
import type { Term } from './TermSelector';

interface CourseListProps {
  schedule: Schedule;
  selectedTerm: Term;
  selectedCourseIds: ReadonlySet<string>;
  disabledCourseIds: ReadonlySet<string>;
  onCourseToggle: (courseId: string) => void;
}

const isInSelectedTerm = (course: Course, selectedTerm: Term) => {
  const courseTerm = course.term.trim().toLowerCase();
  const term = selectedTerm.toLowerCase();

  return courseTerm === term || courseTerm.startsWith(`${term} `);
};

const getCourseId = (course: Course) =>
  JSON.stringify([course.term, course.number]);

export const CourseList = ({
  schedule,
  selectedTerm,
  selectedCourseIds,
  disabledCourseIds,
  onCourseToggle,
}: CourseListProps) => (
  <section>
    <h1>{schedule.title}</h1>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
      {Object.values(schedule.courses)
        .filter((course) => isInSelectedTerm(course, selectedTerm))
        .map((course) => {
          const courseId = getCourseId(course);
          const isSelected = selectedCourseIds.has(courseId);
          const isDisabled = disabledCourseIds.has(courseId) && !isSelected;

          return (
            <li key={`${course.term}-${course.number}`}>
              <button
                aria-disabled={isDisabled}
                aria-pressed={isSelected}
                className={[
                  'flex h-full w-full flex-col gap-3 rounded-lg border p-4 text-left shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                  isDisabled
                    ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 opacity-50'
                    : 'cursor-pointer border-gray-500 bg-white text-black hover:bg-gray-100',
                  isSelected ? 'bg-blue-100 shadow-md' : '',
                ].join(' ')}
                disabled={isDisabled}
                onClick={() => onCourseToggle(courseId)}
                type="button"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold">
                    {course.term} CS{course.number}
                  </span>
                  {isDisabled && (
                    <span aria-hidden="true" className="text-xs font-bold text-red-600">
                      ✕
                    </span>
                  )}
                </span>
                <span>{course.title}</span>
                <span className="mt-auto border-t border-current pt-3">
                  {course.meets}
                </span>
              </button>
            </li>
          );
        })}
    </ul>
  </section>
);
