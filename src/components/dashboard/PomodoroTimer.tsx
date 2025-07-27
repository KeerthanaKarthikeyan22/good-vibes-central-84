import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Timer, Coffee, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TimerMode = 'work' | 'break';

export const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const { toast } = useToast();

  const workDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = mode === 'work' ? workDuration : breakDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  }, [mode, workDuration, breakDuration]);

  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? workDuration : breakDuration);
  }, [workDuration, breakDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1);
        toast({
          title: "Work Session Complete! 🎉",
          description: "Time for a well-deserved break!",
        });
        switchMode('break');
      } else {
        toast({
          title: "Break Complete! ⚡",
          description: "Ready to get back to work?",
        });
        switchMode('work');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, toast, switchMode]);

  return (
    <div className="space-y-6">
      {/* Main Timer Card */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            {mode === 'work' ? (
              <>
                <BookOpen className="w-6 h-6" />
                Focus Time
              </>
            ) : (
              <>
                <Coffee className="w-6 h-6" />
                Break Time
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === 'work' 
              ? "25 minutes of focused work" 
              : "5 minutes to recharge"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-foreground mb-4 font-mono">
              {formatTime(timeLeft)}
            </div>
            <Progress 
              value={getProgress()} 
              className="w-full h-3"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              variant={isActive ? "outline" : "hero"}
              size="lg"
              className="flex-1 max-w-xs"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => switchMode('work')}
              variant={mode === 'work' ? "secondary" : "outline"}
              className="flex-1 max-w-xs"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Work (25min)
            </Button>
            <Button
              onClick={() => switchMode('break')}
              variant={mode === 'break' ? "secondary" : "outline"}
              className="flex-1 max-w-xs"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Break (5min)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Session Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Completed Sessions</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {completedSessions}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Current Mode</span>
                <Badge variant={mode === 'work' ? "default" : "outline"}>
                  {mode === 'work' ? 'Work' : 'Break'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Timer Status</span>
                <Badge variant={isActive ? "secondary" : "outline"}>
                  {isActive ? 'Running' : 'Paused'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Pomodoro Technique</CardTitle>
            <CardDescription>How it works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Work for 25 minutes</p>
                  <p className="text-muted-foreground">Focus on a single task</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Take a 5-minute break</p>
                  <p className="text-muted-foreground">Relax and recharge</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Repeat the cycle</p>
                  <p className="text-muted-foreground">Build consistent focus habits</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {completedSessions > 0 && (
        <Card className="bg-gradient-secondary text-secondary-foreground border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-center">🎉 Great Progress!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg">
              You've completed <strong>{completedSessions}</strong> focus session{completedSessions !== 1 ? 's' : ''} today!
            </p>
            <p className="text-secondary-foreground/80 mt-2">
              Keep up the excellent work and maintain your momentum.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};