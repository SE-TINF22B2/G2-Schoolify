import { Lesson } from "./LessonType";

export const fetchLessons = (classId: number, weekStart: string, setLessons: any, setLoading: any, setErrorMessage: any) => {
    setLoading(true);
    return fetch(`api/lesson/getLessonsForWeek?classId=${classId}&weekStart=${weekStart}`)
        .then((response: Response) => response.json())
        .then((data: Lesson[][] | {statusCode?: number; message? :string} ) => {
            if(Array.isArray(data)) {

            
            setLessons(data);
            setLoading(false);
            }else{
             setErrorMessage("Daten konnten nicht geladen werden");
             setLoading(false);     
            }
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
