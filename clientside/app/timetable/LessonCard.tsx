import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react"; // Replace 'your-card-library' with the actual library you are using
import getColorForLesson from './getColorForLesson';
import { Lesson } from './LessonType';


export default function LessonCard({lesson}: {lesson: Lesson | undefined}) {

  return (
    <Card
      className={lesson == null ? 'invisible' : ''}
      fullWidth
      style={{
        backgroundColor: getColorForLesson(lesson?.Subject.name ?? ''),
      }}
    >
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-default-500 text-xl text-white">
            {lesson?.Subject.name ?? ''}
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <p className="text-small text-default-500 text-xs text-white">
          {lesson?.Teacher.name} {lesson?.Teacher.lastname}
        </p>
        <p className="text-small text-default-500 text-xs text-white">
          {lesson?.roomNumber}
        </p>
      </CardBody>
    </Card>
  );
};
