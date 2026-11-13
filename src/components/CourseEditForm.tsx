import { useState } from 'react';
import type { Course } from '../types/Course';

interface CourseEditFormProps {
  course: Course;
  onCancel: () => void;
}

export const CourseEditForm = ({ course, onCancel }: CourseEditFormProps) => {
  const [title, setTitle] = useState(course.title);
  const [meets, setMeets] = useState(course.meets);

  return (
    <section aria-labelledby="course-edit-heading" className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold" id="course-edit-heading">
        Edit {course.term} CS{course.number}
      </h1>
      <form
        aria-labelledby="course-edit-heading"
        className="space-y-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="space-y-1">
          <label className="block font-medium" htmlFor="course-title">
            Course title
          </label>
          <input
            className="w-full rounded border border-gray-400 px-3 py-2"
            id="course-title"
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            value={title}
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium" htmlFor="course-meets">
            Meeting times
          </label>
          <input
            className="w-full rounded border border-gray-400 px-3 py-2"
            id="course-meets"
            onChange={(event) => setMeets(event.target.value)}
            type="text"
            value={meets}
          />
        </div>
        <button
          className="cursor-pointer rounded border border-gray-500 bg-white px-4 py-2 font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </form>
    </section>
  );
};
