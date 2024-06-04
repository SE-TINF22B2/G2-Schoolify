import { Lesson } from "./LessonType";

export const fetchLessons = (classId: number)  => {
  return fetch(`api/lesson/getLessonsForWeek?classId=${classId}`)
      .then((response:Response) => response.json()).then((data: Lesson[][]) => {return data})
}