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
    <Card className="overflow-hidden pt-0 ring-1 ring-slate-300 transition-shadow hover:border-slate-300 hover:shadow-md">
      {image ? (
        <img src={image} alt="" className="h-40 w-full object-cover" />
      ) : (
        // No picture yet: show the course's topic on its color instead.
        <div className={`flex h-40 items-center justify-center px-6 text-center ${color}`}>
          <span className="text-2xl font-semibold text-white">{tag}</span>
        </div>
      )}

      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          {tag}
        </Badge>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="text-sm text-slate-500">
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
