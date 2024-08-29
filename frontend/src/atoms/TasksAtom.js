import { atom } from 'recoil';

export const TasksAtom = atom({
  key: 'TasksAtom', 
  default: [
    {
      classGroup: 1,
      title: 'Machine Learning',
      totalSubmissions: 30,
      reviewedSubmission: 15,
      dueDate: "September 14, 2023",
      status: 'Ongoing',
      type: 'Assignment'
    },
    {
      classGroup: 2,
      title: 'Advanced Algorithms Quiz',
      totalSubmissions: 25,
      reviewedSubmission: 20,
      dueDate: "September 20, 2023",
      status: 'Completed',
      type: 'Quiz'
    },
    {
      classGroup: 3,
      title: 'Database Design Project',
      totalSubmissions: 18,
      reviewedSubmission: 5,
      dueDate: "October 5, 2023",
      status: 'Ongoing',
      type: 'Project'
    },
    {
      classGroup: 4,
      title: 'Software Engineering Midterm Exam',
      totalSubmissions: 22,
      reviewedSubmission: 12,
      dueDate: "October 15, 2023",
      status: 'Ongoing',
      type: 'Exam'
    },
    {
      classGroup: 5,
      title: 'Operating Systems Lab Report',
      totalSubmissions: 16,
      reviewedSubmission: 8,
      dueDate: "October 20, 2023",
      status: 'Pending',
      type: 'Lab Report'
    }
  ]
});
