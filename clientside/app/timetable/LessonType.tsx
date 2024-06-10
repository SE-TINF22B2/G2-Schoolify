type Subject = {
  subjectID: number;
  name: string;
};

type Test = {
  testID: number;
  topic: string;
};

type Teacher = {
  teacherID: number;
  user_Login_DataUser_Login_DataID: number;
  name: string;
  lastname: string;
};

export type Lesson = {
  lessonID: number;
  day: string;  // Alternatively, you can use Date type if you plan to parse it into a Date object
  timeslot: number;
  testTestID?: number;
  classClassID: number;
  subjectSubjectID: number;
  roomNumber: number
  Subject: Subject;
  Test?: Test;
  Teacher: Teacher;
};