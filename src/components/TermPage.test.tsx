import { fireEvent, render, screen } from '@testing-library/react';
import { TermPage } from './TermPage';

describe('TermPage', () => {
  const schedules = {
    core: {
      title: 'Core courses',
      courses: {
        fall: {
          term: 'Fall 2026',
          number: '101',
          title: 'Fall course',
          meets: 'Monday',
        },
        winter: {
          term: 'Winter 2027',
          number: '102',
          title: 'Winter course',
          meets: 'Tuesday',
        },
        spring: {
          term: 'Spring 2027',
          number: '103',
          title: 'Spring course',
          meets: 'Wednesday',
        },
      },
    },
  };

  it('starts on Fall and filters courses when the selected term changes', () => {
    render(<TermPage schedules={schedules} />);

    expect(
      screen.getByRole('button', { name: 'Fall' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByText('Fall course')).toBeTruthy();
    expect(screen.queryByText('Winter course')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Winter' }));

    expect(
      screen
        .getByRole('button', { name: 'Winter' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.getByText('Winter course')).toBeTruthy();
    expect(screen.queryByText('Fall course')).toBeNull();

    const winterCourse = screen.getByRole('button', { name: /Winter course/ });
    fireEvent.click(winterCourse);
    expect(winterCourse.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Fall' }));
    const fallCourse = screen.getByRole('button', { name: /Fall course/ });
    fireEvent.click(fallCourse);
    expect(fallCourse.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Winter' }));
    expect(
      screen
        .getByRole('button', { name: /Winter course/ })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: /Winter course/ }));
    expect(
      screen
        .getByRole('button', { name: /Winter course/ })
        .getAttribute('aria-pressed'),
    ).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Fall' }));
    const selectedFallCourse = screen.getByRole('button', {
      name: /Fall course/,
    });
    expect(selectedFallCourse.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(selectedFallCourse);
    expect(selectedFallCourse.getAttribute('aria-pressed')).toBe('false');
  });

  it('opens a course plan dialog with empty and selected course states', () => {
    render(<TermPage schedules={schedules} />);

    fireEvent.click(screen.getByRole('button', { name: 'Course Plan' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('No courses selected yet.')).toBeTruthy();
    expect(
      screen.getByText('Select courses from the list to build your plan.'),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Fall course/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Course Plan' }));

    const selectedCourseItem = screen.getAllByText('Fall course')[1].closest('li');
    expect(selectedCourseItem?.textContent).toContain('Fall 2026');
    expect(selectedCourseItem?.textContent).toContain('CS');
    expect(selectedCourseItem?.textContent).toContain('101');
    expect(selectedCourseItem?.textContent).toContain('Monday');

    fireEvent.click(screen.getAllByText('Fall course')[1]);
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
