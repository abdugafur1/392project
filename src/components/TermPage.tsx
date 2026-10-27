import { useState } from 'react';
import type { Schedule } from '../types/Course';
import { CourseList } from './CourseList';
import { TermSelector, type Term } from './TermSelector';

interface TermPageProps {
  schedules: Record<string, Schedule>;
}

export const TermPage = ({ schedules }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');

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
        />
      ))}
    </main>
  );
};
