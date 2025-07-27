import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Heart, Share, Quote, Star, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const motivationalQuotes = [
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "action"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "confidence"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "persistence"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "beginning"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
    category: "resilience"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "mindset"
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "action"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action"
  }
];

const categories = [
  { name: "all", label: "All Quotes", icon: Quote },
  { name: "action", label: "Action", icon: Target },
  { name: "confidence", label: "Confidence", icon: Star },
  { name: "perseverance", label: "Perseverance", icon: Heart },
];

export const MotivationalQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const { toast } = useToast();

  const getFilteredQuotes = () => {
    if (selectedCategory === "all") return motivationalQuotes;
    return motivationalQuotes.filter(quote => quote.category === selectedCategory);
  };

  const getRandomQuote = () => {
    const filteredQuotes = getFilteredQuotes();
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  const toggleLike = () => {
    const quoteId = `${currentQuote.text}-${currentQuote.author}`;
    setLikedQuotes(prev => {
      if (prev.includes(quoteId)) {
        return prev.filter(id => id !== quoteId);
      } else {
        toast({
          title: "Quote Liked! ❤️",
          description: "Added to your favorites",
        });
        return [...prev, quoteId];
      }
    });
  };

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Motivational Quote',
        text: `"${currentQuote.text}" - ${currentQuote.author}`,
      });
    } else {
      navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
      toast({
        title: "Quote Copied!",
        description: "Quote has been copied to clipboard",
      });
    }
  };

  const isCurrentQuoteLiked = () => {
    const quoteId = `${currentQuote.text}-${currentQuote.author}`;
    return likedQuotes.includes(quoteId);
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        getRandomQuote();
      }, 10000); // Change quote every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, selectedCategory]);

  useEffect(() => {
    // Update current quote when category changes
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length > 0 && !filteredQuotes.includes(currentQuote)) {
      setCurrentQuote(filteredQuotes[0]);
    }
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5" />
            Quote Categories
          </CardTitle>
          <CardDescription>Choose your inspiration theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  variant={selectedCategory === category.name ? "secondary" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Quote Display */}
      <Card className="bg-gradient-hero text-primary-foreground border-border shadow-card">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <Quote className="w-12 h-12 mx-auto opacity-50" />
            
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            
            <div className="flex items-center justify-center gap-2">
              <div className="h-px bg-primary-foreground/30 flex-1 max-w-20"></div>
              <cite className="text-lg opacity-90">— {currentQuote.author}</cite>
              <div className="h-px bg-primary-foreground/30 flex-1 max-w-20"></div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {currentQuote.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Quote Controls</CardTitle>
            <CardDescription>Manage your inspiration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={getRandomQuote} variant="hero" className="flex-1">
                <Shuffle className="w-4 h-4 mr-2" />
                New Quote
              </Button>
              
              <Button 
                onClick={toggleLike} 
                variant={isCurrentQuoteLiked() ? "secondary" : "outline"}
                className="px-4"
              >
                <Heart className={`w-4 h-4 ${isCurrentQuoteLiked() ? 'fill-current' : ''}`} />
              </Button>
              
              <Button onClick={shareQuote} variant="outline" className="px-4">
                <Share className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Auto-play quotes</span>
              <Button
                onClick={() => setAutoPlay(!autoPlay)}
                variant={autoPlay ? "secondary" : "outline"}
                size="sm"
              >
                {autoPlay ? "On" : "Off"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>Track your motivation journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Liked Quotes</span>
                <Badge variant="secondary">
                  {likedQuotes.length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Current Category</span>
                <Badge variant="outline" className="capitalize">
                  {selectedCategory}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Auto-play</span>
                <Badge variant={autoPlay ? "secondary" : "outline"}>
                  {autoPlay ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Motivation Tips */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle>💡 Daily Motivation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium mb-2">Set Daily Goals</h3>
              <p className="text-muted-foreground">Start each day with clear, achievable objectives</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-medium mb-2">Practice Gratitude</h3>
              <p className="text-muted-foreground">Appreciate your progress and small wins</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium mb-2">Stay Consistent</h3>
              <p className="text-muted-foreground">Small daily actions lead to big results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liked Quotes */}
      {likedQuotes.length > 0 && (
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Your Favorite Quotes ({likedQuotes.length})
            </CardTitle>
            <CardDescription>Your personal collection of inspiration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              Keep collecting quotes that resonate with you! They'll be saved here for quick access.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};