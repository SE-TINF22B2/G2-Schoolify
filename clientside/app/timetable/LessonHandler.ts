import { Lesson } from "./LessonType";

export const fetchLessons = (classId: number, weekStart: string, setLessons: any) => {
    return fetch(`api/lesson/getLessonsForWeek?classId=${classId}`)
        .then((response: Response) => response.json())
        .then((data: Lesson[][]) => {
            setLessons(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

export const getLesson = (
    timeslot: number,
    dayIndex: number,
    lessons: Lesson[][]
): Lesson | undefined => {
    const dayLessons = lessons[dayIndex];

    if (dayLessons === undefined) return undefined;
    return dayLessons.find((lesson) => lesson.timeslot === timeslot);
};
