import {
  Code2,
  Trophy,
  Users,
  Zap,
  ChevronRight,
  Play,
  Star,
  Moon,
  Sun,
  Menu,
  ChevronFirst,
  ChevronUpSquareIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { onBoardUser } from "@/modules/auth/actions";

export default async function Home() {
  await onBoardUser();

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Code & Execute",
      description:
        "Write, run, and test your solutions directly in the browser with real execution results.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Progress Insights",
      description:
        "Track solved problems, submission history, and your improvement over time.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Built for Developers",
      description:
        "Designed for learners, interview preparation, and developers who value clean execution.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Verdicts",
      description:
        "Get immediate feedback with test case validation, runtime details, and execution status.",
    },
  ];

  const stats = [
    { number: "1K+", label: "Problems Available" },
    { number: "10K+", label: "Submissions Executed" },
    { number: "10+", label: "Languages Supported" },
    { number: "Live", label: "Code Evaluation" },
    
  ];

  const problemCategories = [
    {
      level: "Starter",
      title: "Foundations",
      description:
        "Build strong fundamentals with beginner-friendly problems and guided test cases.",
      count: "Easy Level",
      color: "amber",
    },
    {
      level: "Core",
      title: "DSA Practice",
      description:
        "Strengthen your understanding of data structures and algorithms through practice.",
      count: "Medium Level",
      color: "indigo",
    },
    {
      level: "Advanced",
      title: "Problem Solving",
      description:
        "Tackle complex logic, edge cases, and performance-focused challenges.",
      count: "Hard Level",
      color: "amber",
    },
  ];

  return (
    <div className="min-h-screen transition-colors mt-24">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-16">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-8 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900"
          >
            <Star className="w-4 h-4 mr-2" />
            Practice • Execute • Improve
          </Badge>

          {/* Main Heading */}
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-8">
            Solve. Submit.
            <br />
            <span className="relative inline-block">
              <span className="px-6 py-3 bg-amber-500 dark:bg-amber-400 text-white dark:text-gray-900 rounded-2xl transform -rotate-1 inline-block shadow-lg">
                Improve.
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            SolveX is a modern coding platform to practice data structures,
            algorithms, and real-world problems with instant code evaluation and
            detailed execution feedback.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Solving and improving
              <ChevronUpSquareIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gray-50 dark:bg-neutral-900/50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to{" "}
              <span className="text-amber-600 dark:text-amber-400">
                practice better
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              SolveX focuses on execution, feedback, and consistent improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${
                      index % 2 === 0
                        ? "bg-amber-100 dark:bg-amber-900"
                        : "bg-indigo-100 dark:bg-indigo-900"
                    } rounded-xl flex items-center justify-center ${
                      index % 2 === 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    } mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Categories */}
      <section id="problems" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Pick a{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                difficulty
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Practice problems based on your current skill level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problemCategories.map((category, index) => (
              <Card
                key={index}
                className={`border-2 hover:shadow-lg transition-all duration-200 ${
                  category.color === "amber"
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700"
                    : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                <CardHeader>
                  <Badge
                    variant="secondary"
                    className={`w-fit ${
                      category.color === "amber"
                        ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                        : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {category.level}
                  </Badge>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {category.description}
                  </CardDescription>
                  <div
                    className={`font-semibold ${
                      category.color === "amber"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    {category.count}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-amber-600 to-amber-300 dark:from-amber-600 dark:to-indigo-600 rounded-md">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start solving with SolveX
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Practice consistently, understand your mistakes, and grow as a
            problem solver.
          </p>
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
          >
            Aao Code Karen
          </Button>
        </div>
      </section>
    </div>
  );
}
