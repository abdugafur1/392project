import './App.css';
import { useJsonQuery } from './utilities/fetch';
import { TermPage } from './components/TermPage';
import type { Course, Schedule } from './types/Course';

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

  return <TermPage schedules={data.schedules} />;
};

export default App;