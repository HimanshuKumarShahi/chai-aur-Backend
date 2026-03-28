import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/course`)
      .then(res => setCourses(res.data));
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl text-orange-500 mb-6">Courses</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}