import type { Course, Schedule } from '../types/Course';
import type { Term } from './TermSelector';

interface CourseListProps {
  schedule: Schedule;
  selectedTerm: Term;
}

const isInSelectedTerm = (course: Course, selectedTerm: Term) => {
  const courseTerm = course.term.trim().toLowerCase();
  const term = selectedTerm.toLowerCase();

  return courseTerm === term || courseTerm.startsWith(`${term} `);
};

export const CourseList = ({ schedule, selectedTerm }: CourseListProps) => (
  <section>
    <h1>{schedule.title}</h1>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
      {Object.values(schedule.courses)
        .filter((course) => isInSelectedTerm(course, selectedTerm))
        .map((course) => (
          <li
            className="flex h-full flex-col gap-3 rounded-lg border border-gray-500 p-4"
            key={`${course.term}-${course.number}`}
          >
            <p className="font-bold">
              {course.term} CS{course.number}
            </p>
            <p>{course.title}</p>
            <p className="mt-auto border-t border-current pt-3">
              {course.meets}
            </p>
          </li>
        ))}
    </ul>
  </section>
);
