"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-24 mt-5">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center space-y-4">
          <Badge
            variant="secondary"
            className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          >
            About SolveX
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Built for problem solvers
          </h1>
          <p className="text-lg text-muted-foreground">
            Not just to write code — but to think better.
          </p>
        </div>

        {/* Main About Card */}
        <Card>
          <CardHeader>
            <CardTitle>What is SolveX?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <span className="font-semibold text-foreground">SolveX</span> is a
              modern coding platform designed for developers who want to master
              problem-solving through consistent practice.
            </p>
            <p>
              Inspired by competitive programming platforms, SolveX focuses on
              clean execution, real test cases, and meaningful feedback — so you
              can actually improve, not just submit.
            </p>
            <p>
              Whether you are preparing for interviews, strengthening data
              structures, or sharpening algorithmic thinking, SolveX gives you
              the environment to do it right.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Why SolveX?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>• Real code execution using an online judge</p>
              <p>• Multiple difficulty levels — Easy, Medium, Hard</p>
              <p>• Language support with starter templates</p>
              <p>• Clean UI with zero distractions</p>
              <p>• Transparent verdicts — Accepted or Wrong Answer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                We believe solving fewer problems deeply is better than chasing
                streaks.
              </p>
              <p>
                SolveX encourages understanding, debugging, and learning from
                failures — just like real engineering.
              </p>
              <p>No noise. No shortcuts. Just logic, code, and growth.</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Crafted with logic, late nights, and unnecessary console.logs.</p>
          <p>
            Made by{" "}
            <span className="font-semibold text-foreground">
              Dhiman Majumdar
            </span>{" "}
            — because LeetCode wasn’t stressful enough 😁.
          </p>
        </div>
      </div>
    </div>
  );
}
