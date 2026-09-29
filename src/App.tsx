import './App.css';

const schedules = {
  'CS-2018-2019': {
    title: 'CS Courses for 2018-2019',
    courses: {
      F101: {
        term: 'Fall',
        number: '101',
        meets: 'MWF 11:00-11:50',
        title: 'Computer Science: Concepts, Philosophy, and Connections',
      },
      F110: {
        term: 'Fall',
        number: '110',
        meets: 'MWF 10:00-10:50',
        title: 'Intro Programming for non-majors',
      },
      S313: {
        term: 'Spring',
        number: '313',
        meets: 'TuTh 15:30-16:50',
        title: 'Tangible Interaction Design and Learning',
      },
      S314: {
        term: 'Spring',
        number: '314',
        meets: 'TuTh 9:30-10:50',
        title: 'Tech & Human Interaction',
      },
    },
  },
} as const;

const App = () => (
  <main>
    {Object.values(schedules).map((schedule) => (
      <section key={schedule.title}>
        <h1>{schedule.title}</h1>
        <ul>
          {Object.values(schedule.courses).map((course) => (
            <li key={`${course.term}-${course.number}`}>
              {course.term} CS{course.number}: {course.title}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </main>
);

export default App;