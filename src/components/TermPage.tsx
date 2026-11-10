import { useMemo, useState } from 'react';
import type { Course, Schedule } from '../types/Course';
import { hasConflictWithAnySelectedCourse } from '../utilities/courseConflict';
import { CourseList } from './CourseList';
import { TermSelector, type Term } from './TermSelector';

interface TermPageProps {
  schedules: Record<string, Schedule>;
}

const getCourseId = (course: Course) => JSON.stringify([course.term, course.number]);

export const TermPage = ({ schedules }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isCoursePlanOpen, setIsCoursePlanOpen] = useState(false);

  const allCourses = useMemo(
    () =>
      Object.values(schedules).flatMap((schedule) =>
        Object.values(schedule.courses),
      ),
    [schedules],
  );

  const selectedCourses = allCourses.filter((course) =>
    selectedCourseIds.has(getCourseId(course)),
  );

  const disabledCourseIds = useMemo(() => {
    const nextDisabledCourseIds = new Set<string>();

    allCourses.forEach((course) => {
      const courseId = getCourseId(course);

      if (selectedCourseIds.has(courseId)) {
        return;
      }

      if (hasConflictWithAnySelectedCourse(course, selectedCourses)) {
        nextDisabledCourseIds.add(courseId);
      }
    });

    return nextDisabledCourseIds;
  }, [allCourses, selectedCourseIds, selectedCourses]);

  const toggleCourse = (courseId: string) => {
    setSelectedCourseIds((currentSelection) => {
      const nextSelection = new Set(currentSelection);

      if (nextSelection.has(courseId)) {
        nextSelection.delete(courseId);
        return nextSelection;
      }

      const candidateCourse = allCourses.find(
        (course) => getCourseId(course) === courseId,
      );

      if (!candidateCourse) {
        return currentSelection;
      }

      if (
        hasConflictWithAnySelectedCourse(candidateCourse, selectedCourses)
      ) {
        return currentSelection;
      }

      nextSelection.add(courseId);
      return nextSelection;
    });
  };

  return (
    <main className="space-y-6 p-4">
      <div className="flex justify-end">
        <button
          className="cursor-pointer rounded border border-gray-500 bg-white px-4 py-2 font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => setIsCoursePlanOpen(true)}
          type="button"
        >
          Course Plan
        </button>
      </div>

      <TermSelector
        onTermChange={setSelectedTerm}
        selectedTerm={selectedTerm}
      />

      {Object.values(schedules).map((schedule) => (
        <CourseList
          key={schedule.title}
          schedule={schedule}
          selectedTerm={selectedTerm}
          selectedCourseIds={selectedCourseIds}
          disabledCourseIds={disabledCourseIds}
          onCourseToggle={toggleCourse}
        />
      ))}

      {isCoursePlanOpen && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsCoursePlanOpen(false)}
          role="dialog"
        >
          <div
            className="max-h-[80vh] w-full max-w-xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Course Plan</h2>
              <button
                aria-label="Close course plan"
                className="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={() => setIsCoursePlanOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>

            {selectedCourses.length === 0 ? (
              <div className="space-y-2">
                <p className="font-medium">No courses selected yet.</p>
                <p>Select courses from the list to build your plan.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {selectedCourses.map((course) => (
                  <li
                    key={`${course.term}-${course.number}`}
                    className="rounded border border-gray-200 p-3"
                  >
                    <div className="font-semibold">
                      {course.term} CS{course.number}
                    </div>
                    <div>{course.title}</div>
                    <div className="text-sm text-gray-600">{course.meets}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
