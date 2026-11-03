import { fireEvent, render, screen } from '@testing-library/react';
import { TermPage } from './TermPage';

describe('TermPage', () => {
  it('starts on Fall and filters courses when the selected term changes', () => {
    render(
      <TermPage
        schedules={{
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
        }}
      />,
    );

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
});
