import './App.css';
import { useJsonQuery } from './utilities/fetch';

interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

interface Schedule {
  title: string;
  courses: Record<string, Course>;
}

interface CourseResponse {
  schedules: Record<string, Schedule>;
}

const coursesUrl =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isCourse = (value: unknown): value is Course =>
  isRecord(value) &&
  typeof value.term === 'string' &&
  typeof value.number === 'string' &&
  typeof value.meets === 'string' &&
  typeof value.title === 'string';

const isCourseResponse = (value: unknown): value is CourseResponse =>
  isRecord(value) &&
  isRecord(value.schedules) &&
  Object.values(value.schedules).every(
    (schedule) =>
      isRecord(schedule) &&
      typeof schedule.title === 'string' &&
      isRecord(schedule.courses) &&
      Object.values(schedule.courses).every(isCourse),
  );

const App = () => {
  const [data, loading, error] = useJsonQuery(coursesUrl);

  if (loading) {
    return <p role="status">Loading courses...</p>;
  }

  if (error) {
    return <p role="alert">Unable to load courses: {error.message}</p>;
  }

  if (!isCourseResponse(data)) {
    return <p role="alert">Unable to load courses: invalid response data.</p>;
  }

  return (
    <main>
      {Object.values(data.schedules).map((schedule) => (
        <section key={schedule.title}>
          <h1>{schedule.title}</h1>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
            {Object.values(schedule.courses).map((course) => (
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
      ))}
    </main>
  );
};

export default App;