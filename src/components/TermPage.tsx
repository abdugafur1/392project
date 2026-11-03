import { useState } from 'react';
import type { Schedule } from '../types/Course';
import { CourseList } from './CourseList';
import { TermSelector, type Term } from './TermSelector';

interface TermPageProps {
  schedules: Record<string, Schedule>;
}

export const TermPage = ({ schedules }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleCourse = (courseId: string) => {
    setSelectedCourseIds((currentSelection) => {
      const nextSelection = new Set(currentSelection);

      if (nextSelection.has(courseId)) {
        nextSelection.delete(courseId);
      } else {
        nextSelection.add(courseId);
      }

      return nextSelection;
    });
  };

  return (
    <main>
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
          onCourseToggle={toggleCourse}
        />
      ))}
    </main>
  );
};
