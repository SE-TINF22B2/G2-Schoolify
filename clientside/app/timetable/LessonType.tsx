type Subject = {
  subjectID: number;
  name: string;
};

type Test = {
  testID: number;
  topic: string;
};

export type Lesson = {
  lessonID: number;
  day: string;  // Alternatively, you can use Date type if you plan to parse it into a Date object
  timeslot: number;
  testTestID?: number;
  classClassID: number;
  subjectSubjectID: number;
  Subject: Subject;
  Test?: Test;
};