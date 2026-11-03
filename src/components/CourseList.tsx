import type { Course, Schedule } from '../types/Course';
import type { Term } from './TermSelector';

interface CourseListProps {
  schedule: Schedule;
  selectedTerm: Term;
  selectedCourseIds: ReadonlySet<string>;
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
  onCourseToggle,
}: CourseListProps) => (
  <section>
    <h1>{schedule.title}</h1>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
      {Object.values(schedule.courses)
        .filter((course) => isInSelectedTerm(course, selectedTerm))
        .map((course) => (
          <li key={`${course.term}-${course.number}`}>
            <button
              aria-pressed={selectedCourseIds.has(getCourseId(course))}
              className="flex h-full w-full cursor-pointer flex-col gap-3 rounded-lg border border-gray-500 bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-100 aria-pressed:bg-blue-100 aria-pressed:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={() => onCourseToggle(getCourseId(course))}
              type="button"
            >
              <span className="font-bold">
                {course.term} CS{course.number}
              </span>
              <span>{course.title}</span>
              <span className="mt-auto border-t border-current pt-3">
                {course.meets}
              </span>
            </button>
          </li>
        ))}
    </ul>
  </section>
);
