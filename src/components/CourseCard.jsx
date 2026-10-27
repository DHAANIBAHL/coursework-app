import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { slug, tag, title, description, color, image, lessons, quizzes } = course;

  return (
    <Card className="lift group overflow-hidden pt-0 ring-1 ring-slate-300 dark:ring-slate-700 hover:ring-slate-400 dark:hover:ring-slate-500">
      <div className="h-40 overflow-hidden">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none" />
        ) : (
          // No picture yet: show the course's topic on its color instead.
          <div className={`flex h-full items-center justify-center px-6 text-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none ${color}`}>
            <span className="text-2xl font-semibold text-white">{tag}</span>
          </div>
        )}
      </div>

      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          {tag}
        </Badge>
        <CardTitle className="text-lg transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="text-sm text-slate-500 dark:text-slate-400">
        {lessons.length > 0
          ? `${lessons.length} lessons, ${
              quizzes.length === 0 ? "no quizzes yet" : `${quizzes.length} ${quizzes.length === 1 ? "quiz" : "quizzes"}`
            }`
          : "Lessons coming soon"}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button className="w-full" onClick={() => navigate(`/course/${slug}`)}>
          View course
        </Button>
      </CardFooter>
    </Card>
  );
}
