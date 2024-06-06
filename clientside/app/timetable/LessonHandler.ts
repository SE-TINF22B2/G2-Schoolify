import { Lesson } from "./LessonType";

export const fetchLessons = (classId: number, weekStart: string, setLessons: any, setLoading: any) => {
    setLoading(true);
    return fetch(`api/lesson/getLessonsForWeek?classId=${classId}&weekStart=2024-06-03`)
        .then((response: Response) => response.json())
        .then((data: Lesson[][]) => {
            setLessons(data);
            setLoading(false);
            console.log(data)
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
