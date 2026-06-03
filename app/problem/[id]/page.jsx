
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Send,
  Code,
  FileText,
  Lightbulb,
  Trophy,
  ArrowLeft,
  Loader2,
  Sparkles,
  BrainCircuit,
  RotateCw,
  Clock,
  Layers,
  Copy,
  Check,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { getJudge0LanguageId } from "@/lib/judge0";
import { toast } from "sonner";
import Link from "next/link";
import { executeCode, getAllSubmissionByCurrentUserForProblem, getProblemById } from "@/modules/problems/actions";
import { SubmissionDetails } from "@/modules/problems/components/submission-details";
import { TestCaseTable } from "@/modules/problems/components/test-case-table";
import { SubmissionHistory } from "@/modules/problems/components/submission-history";
import { getAiHint, reviewCode } from "@/modules/ai/actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 border-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "HARD":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ProblemIdPage = ({ params }) => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [executionResponse, setExecutionResponse] = useState(null);
  const { theme } = useTheme();

  // AI Assistant and Review States
  const [aiHint, setAiHint] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [copiedReviewCode, setCopiedReviewCode] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const hasPassedAll = executionResponse?.submission?.status === "Accepted";
  const isCodeModified = hasPassedAll && code.trim() !== executionResponse?.submission?.sourceCode?.trim();

  const handleGetAiHint = async () => {
    try {
      setIsLoadingHint(true);
      const res = await getAiHint({
        problemTitle: problem.title,
        problemDescription: problem.description,
        code,
        language: selectedLanguage,
      });
      if (res.success) {
        setAiHint(res.hint);
        toast.success("AI Hint generated successfully!");
      } else {
        toast.error(res.error || "Failed to generate hint.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleGetAiReview = async () => {
    try {
      setIsLoadingReview(true);
      const res = await reviewCode({
        problemTitle: problem.title,
        problemDescription: problem.description,
        code,
        language: selectedLanguage,
      });
      if (res.success) {
        setAiReview(res.review);
        toast.success("AI Code Review completed!");
      } else {
        toast.error(res.error || "Failed to perform review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoadingReview(false);
    }
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedReviewCode(true);
    toast.success("Refactored code copied to clipboard!");
    setTimeout(() => setCopiedReviewCode(false), 2000);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const resolvedParams = await params;
        const problemData = await getProblemById(resolvedParams.id);
        if (problemData.success) {
          setProblem(problemData.data);

          setCode(problemData.data.codeSnippets[selectedLanguage] || "");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [params]);


  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const resolvedParams = await params;
        const submissionHistory = await getAllSubmissionByCurrentUserForProblem(resolvedParams.id);
        if (submissionHistory.success) {
          setSubmissionHistory(submissionHistory.data);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    }

    fetchSubmissionHistory();
  }, [params])



  useEffect(() => {
    if (problem && problem.codeSnippets[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
      setAiReview(null);
      setAiHint("");
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setAiReview(null);
      setAiHint("");
      const language_id = getJudge0LanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      const res = await executeCode(
        code,
        language_id,
        stdin,
        expected_outputs,
        problem.id
      );

      setExecutionResponse(res);
      if (res.success) {
        if (res.submission?.status === "Accepted") {
          toast.success("Accepted! All test cases passed successfully.");
        } else {
          toast.error("Wrong Answer! Some test cases failed.");
        }
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast.error(error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => { };

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin size-5 text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">{problem?.title}</h1>
              <Badge
                className={cn(
                  "font-medium",
                  getDifficultyColor(problem?.difficulty)
                )}
              >
                {problem?.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem?.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ModeToggle />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-foreground leading-relaxed">
                    {problem?.description}
                  </p>

                  {/* Examples */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Example:</h3>
                    {problem?.examples[selectedLanguage] && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div>
                          <span className="font-medium text-amber-400">
                            Input:{" "}
                          </span>
                          <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                            {problem?.examples[selectedLanguage].input}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium text-amber-400">
                            Output:{" "}
                          </span>
                          <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                            {problem?.examples[selectedLanguage].output}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Explanation: </span>
                          <span className="text-sm">
                            {problem?.examples[selectedLanguage]?.explanation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Constraints:</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {problem?.constraints}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Tabs defaultValue="submissions" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 h-auto">
                    <TabsTrigger
                      value="submissions"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium"
                    >
                      <Trophy className="h-4 w-4 shrink-0" />
                      <span>Submissions</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="editorial"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>Editorial</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium"
                    >
                      <Lightbulb className="h-4 w-4 shrink-0" />
                      <span>Hints</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="ai-review"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium"
                    >
                      <BrainCircuit className="h-4 w-4 shrink-0 text-purple-500" />
                      <span>AI Review</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="submissions" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Submission History</p>
                      <SubmissionHistory submissions={submissionHistory} />
                    </div>
                  </TabsContent>
                  <TabsContent value="editorial" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem.editorial
                        ? problem.editorial
                        : "Editorial not available yet."}
                    </div>
                  </TabsContent>
                  <TabsContent value="hints" className="p-6 space-y-4">
                    <div className="text-center py-4 text-muted-foreground">
                      {problem.hints
                        ? problem.hints
                        : "No hints available for this problem."}
                    </div>
                    
                    <div className="mt-4 p-4 border border-dashed rounded-lg text-center bg-zinc-50 dark:bg-zinc-900/40">
                      <h4 className="text-sm font-semibold mb-2 flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                        Need dynamic code guidance?
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3 max-w-sm mx-auto">
                        Ask our AI Tutor to inspect your active code in the editor and give you step-by-step suggestions.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/10"
                        onClick={() => setIsTutorOpen(true)}
                      >
                        Launch AI Tutor
                      </Button>
                    </div>
                  </TabsContent>

                  {/* AI Review Tab */}
                  <TabsContent value="ai-review" className="p-4 space-y-6">
                    {!hasPassedAll ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="bg-zinc-100 dark:bg-zinc-800/60 p-4 rounded-full border border-zinc-200 dark:border-zinc-700">
                          <BrainCircuit className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="max-w-md">
                          <h3 className="font-semibold text-lg mb-1">AI Code Review Locked</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            AI Code Review & Complexity Analysis will unlock once you submit your code and pass all test cases successfully!
                          </p>
                        </div>
                      </div>
                    ) : isCodeModified ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="bg-amber-100 dark:bg-amber-950/40 p-4 rounded-full border border-amber-200 dark:border-amber-900/60">
                          <BrainCircuit className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="max-w-md">
                          <h3 className="font-semibold text-lg mb-1">Code Modified</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            You have modified the code in the editor. Please click "Run & Submit" to verify your new solution before analyzing it with AI.
                          </p>
                        </div>
                      </div>
                    ) : !aiReview ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                        <div className="bg-purple-100 dark:bg-purple-950/40 p-4 rounded-full">
                          <BrainCircuit className="h-10 w-10 text-purple-500" />
                        </div>
                        <div className="max-w-md">
                          <h3 className="font-semibold text-lg mb-1">Instant Code Quality Audit</h3>
                          <p className="text-sm text-muted-foreground">
                            Analyze the time and space complexity of your current editor solution, view performance bottlenecks, and get an optimized, refactored version of your code.
                          </p>
                        </div>
                        <Button 
                          onClick={handleGetAiReview} 
                          disabled={isLoadingReview}
                          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm transition-all"
                        >
                          {isLoadingReview ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Performing Audit...
                            </>
                          ) : (
                            <>
                              <BrainCircuit className="h-4 w-4" />
                              Analyze My Code
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 text-left">
                        {/* Complexity Cards */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-950 p-4 rounded-xl flex items-center gap-3">
                            <Clock className="h-8 w-8 text-purple-500 shrink-0" />
                            <div>
                              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Time Complexity</div>
                              <div className="text-lg font-bold text-purple-700 dark:text-purple-300 font-mono mt-0.5">
                                {aiReview.timeComplexity}
                              </div>
                            </div>
                          </div>

                          <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950 p-4 rounded-xl flex items-center gap-3">
                            <Layers className="h-8 w-8 text-indigo-500 shrink-0" />
                            <div>
                              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Space Complexity</div>
                              <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300 font-mono mt-0.5">
                                {aiReview.spaceComplexity}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Review Summary */}
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                          <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Quality Summary</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {aiReview.reviewSummary}
                          </p>
                        </div>

                        {/* Suggestions */}
                        {aiReview.suggestions && aiReview.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Refactoring Suggestions</h4>
                            <ul className="space-y-2">
                              {aiReview.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                                  <span className="text-purple-500 font-bold shrink-0 mt-0.5">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Refactored Code Block */}
                        {aiReview.refactoredCode && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Proposed Refactored Solution</h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyCode(aiReview.refactoredCode)}
                                className="h-8 gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                              >
                                {copiedReviewCode ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy Code
                                  </>
                                )}
                              </Button>
                            </div>
                            <div className="relative border rounded-xl overflow-hidden bg-zinc-950 text-zinc-200 p-4 font-mono text-xs leading-relaxed max-h-80 overflow-y-auto text-left">
                              <pre className="whitespace-pre">{aiReview.refactoredCode}</pre>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                          <Button 
                            variant="outline"
                            onClick={handleGetAiReview}
                            disabled={isLoadingReview}
                            className="gap-2 border-purple-200 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-700 dark:text-purple-300"
                          >
                            {isLoadingReview ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCw className="h-4 w-4" />
                            )}
                            Re-Analyze Code
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsTutorOpen(true)}
                      className="gap-2 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/10 shrink-0"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                      Ask AI Tutor
                    </Button>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                        <SelectItem value="PYTHON">Python</SelectItem>
                        <SelectItem value="JAVA">Java</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={
                      selectedLanguage.toLowerCase() === "javascript"
                        ? "javascript"
                        : selectedLanguage.toLowerCase()
                    }
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                    }}
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleRun}
                    disabled={isRunning}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {isRunning ? "Submitting..." : "Run & Submit"}
                  </Button>

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>
                  Run your code against these test cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-4">
                    {problem.testCases.map((testCase, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">
                          Test Case {index + 1}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Input:{" "}
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {testCase.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Expected:{" "}
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {testCase.output}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Test Results and Submission Details */}
            {executionResponse && executionResponse.submission && (
              <div className="space-y-4 mt-4">
                <SubmissionDetails submission={executionResponse.submission} />
                <TestCaseTable testCases={executionResponse.submission.testCases} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Global AI Tutor Sidebar Sheet */}
      <Sheet open={isTutorOpen} onOpenChange={setIsTutorOpen}>
        <SheetContent className="w-[450px] sm:max-w-[450px] p-0 flex flex-col h-full bg-background border-l shadow-2xl">
          <SheetHeader className="p-6 border-b bg-amber-50/50 dark:bg-amber-950/5">
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
              AI Coding Tutor
            </SheetTitle>
            <SheetDescription>
              Get smart coding assistance, debug compiler errors, or ask for guidance without spoiling the solution.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!aiHint ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="bg-amber-100 dark:bg-amber-950/40 p-4 rounded-full">
                  <Sparkles className="h-10 w-10 text-amber-500 animate-pulse" />
                </div>
                <div className="max-w-xs">
                  <h3 className="font-semibold text-lg mb-1">Stuck on your solution?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our AI Coding Assistant will analyze your current code in the editor and give you a helpful nudge in the right direction.
                  </p>
                </div>
                <Button 
                  onClick={handleGetAiHint} 
                  disabled={isLoadingHint}
                  className="gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm transition-all w-full"
                >
                  {isLoadingHint ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Get Tutor Hint
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/60 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300">Tutor Suggestion</h4>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap text-left text-sm">
                    {aiHint}
                  </div>
                </div>

                <Button 
                  variant="outline"
                  onClick={handleGetAiHint}
                  disabled={isLoadingHint}
                  className="gap-2 border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-800 dark:text-amber-300 w-full"
                >
                  {isLoadingHint ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCw className="h-4 w-4" />
                  )}
                  Analyze Again / Get New Hint
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProblemIdPage;
