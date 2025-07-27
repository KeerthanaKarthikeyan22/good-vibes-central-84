import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaceRecognition } from "./FaceRecognition";
import { PomodoroTimer } from "./PomodoroTimer";
import { MotivationalQuotes } from "./MotivationalQuotes";
import { Camera, Timer, MessageCircle, Shield, Users, Zap } from "lucide-react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const features = [
    {
      id: "face-unlock",
      icon: Shield,
      title: "🔥 Face Boss Battle",
      description: "Only YOUR face can defeat this alarm monster! Show your morning warrior spirit! 💪",
      component: FaceRecognition,
      gradient: "bg-gradient-primary"
    },
    {
      id: "pomodoro",
      icon: Timer,
      title: "⚡ Power-Up Timer",
      description: "25-min BEAST MODE + 5-min celebration break! Level up your focus game! 🎮",
      component: PomodoroTimer,
      gradient: "bg-gradient-secondary"
    },
    {
      id: "motivation",
      icon: MessageCircle,
      title: "🚀 Epic Motivation",
      description: "Daily dose of LEGENDARY quotes to fuel your inner champion! 🏆",
      component: MotivationalQuotes,
      gradient: "bg-gradient-hero"
    }
  ];

  const additionalFeatures = [
    {
      icon: Camera,
      title: "🎭 Register Your Battle Face",
      description: "Train Wakezilla to recognize YOUR unique morning warrior face! 📸"
    },
    {
      icon: Users,
      title: "👥 Multi-Hero Squad",
      description: "Assemble your household wake-up squad! Each hero gets their own battle profile! 🦸‍♀️"
    },
    {
      icon: Zap,
      title: "⚡ Lightning Fast Monster",
      description: "This prehistoric beast runs smooth as butter on ANY device! 🧈"
    }
  ];

  if (activeSection) {
    const feature = features.find(f => f.id === activeSection);
    if (feature) {
      const Component = feature.component;
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveSection(null)}
                className="mb-4 text-lg font-semibold"
              >
                🦖 ← Back to Wakezilla HQ
              </Button>
              <h1 className="text-4xl font-bold text-foreground">{feature.title}</h1>
            </div>
            <Component />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-pulse">🦖 WAKEZILLA</h1>
          <p className="text-2xl mb-8 opacity-90 font-semibold">
            The ULTIMATE Wake-Up Challenge! 💪 Face the monster within!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-2 animate-bounce">
              🎯 Epic Wake-Up Boss Battles
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 animate-bounce [animation-delay:0.1s]">
              🔥 Addictive & Fun
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 animate-bounce [animation-delay:0.2s]">
              🚀 Level Up Your Morning
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">🎮 EPIC FEATURES</h2>
          <p className="text-muted-foreground text-xl font-semibold">
            Unlock your LEGENDARY morning powers! 🌟
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="bg-gradient-card border-border shadow-card hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection(feature.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${feature.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="feature" className="w-full text-lg font-bold">
                    🚀 BATTLE NOW!
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">🎁 BONUS POWERS</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-card border-border shadow-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;