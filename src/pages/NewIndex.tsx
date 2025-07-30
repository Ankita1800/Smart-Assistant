import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Pen, 
  Lightbulb, 
  Copy, 
  Download, 
  Wand2, 
  RefreshCw, 
  Heart, 
  ThumbsDown,
  Clock,
  FileText,
  Save,
  Image as ImageIcon,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useUnsplash } from "@/hooks/useUnsplash";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  calculateReadingTime, 
  countWords, 
  downloadTXT, 
  downloadPDF,
  generatePromptVariations 
} from "@/lib/utils";

interface GeneratedContent {
  id: string;
  content: string;
  type: string;
  prompt: string;
  wordCount: number;
  timestamp: number;
  liked?: boolean;
  disliked?: boolean;
}

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState("story");
  const [targetWordCount, setTargetWordCount] = useState([200]);
  const [savedContent, setSavedContent] = useLocalStorage<GeneratedContent[]>("ai-writing-content", []);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { toast } = useToast();
  const { searchImages, isLoading: imageLoading } = useUnsplash();

  // Calculate stats for current content
  const wordCount = countWords(generatedContent);
  const readingTime = calculateReadingTime(generatedContent);
  const progress = targetWordCount[0] > 0 ? Math.min((wordCount / targetWordCount[0]) * 100, 100) : 0;

  // Content type options
  const contentTypes = [
    { value: "story", label: "Creative Story" },
    { value: "email", label: "Professional Email" },
    { value: "essay", label: "Essay/Article" },
    { value: "blog", label: "Blog Post" },
    { value: "social", label: "Social Media Post" },
    { value: "poem", label: "Poem" },
    { value: "script", label: "Script/Dialogue" },
    { value: "letter", label: "Formal Letter" }
  ];

  // Enhanced AI content generation
  const generateContent = async (type: string, prompt: string, words: number) => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what you want to create.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const samples = {
      story: `In a realm where ${prompt.toLowerCase() || "magic existed"}, there lived a curious explorer whose destiny was intertwined with the very fabric of reality. Each step they took seemed to ripple through time itself, creating waves of change that would echo through generations.

The protagonist discovered that their journey was not merely about reaching a destination, but about understanding the profound connections between all living things. As they ventured deeper into this mystical world, the landscape responded to their emotions - blooming with ethereal flowers when joy filled their heart, and weaving gentle mists when contemplation took hold.

This was a place where thoughts held tangible power, where dreams could reshape the world, and where every choice created infinite possibilities. The explorer soon realized that they were not just traveling through this magical realm, but actively participating in its creation, their very presence adding new threads to the tapestry of existence.`,
      
      email: `Subject: ${prompt || "Important Update"} - Action Required

Dear [Recipient Name],

I hope this message finds you in good health and high spirits. I'm writing to discuss ${prompt.toLowerCase() || "our upcoming collaboration"}, which I believe presents an exceptional opportunity for mutual growth and success.

After thorough analysis and careful consideration of all variables, I'm confident that this initiative aligns perfectly with our strategic objectives. The potential benefits include enhanced efficiency, improved outcomes, and stronger partnerships moving forward.

Key points to consider:
• Immediate action items and timelines
• Resource allocation and budget considerations
• Expected deliverables and success metrics
• Risk assessment and mitigation strategies

I would appreciate the opportunity to discuss this matter in greater detail at your earliest convenience. Please let me know your availability for a comprehensive meeting within the next week.

Thank you for your time and consideration. I look forward to your prompt response and to moving forward together on this exciting venture.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`,
      
      essay: `The Profound Impact of ${prompt || "Artificial Intelligence"} on Modern Society

In today's rapidly evolving technological landscape, few developments have captured our collective imagination quite like ${prompt.toLowerCase() || "artificial intelligence"}. This revolutionary force stands at the intersection of human ingenuity and computational power, promising to reshape virtually every aspect of our daily lives.

The transformative potential of this technology extends far beyond simple automation. We are witnessing the emergence of systems capable of creative thought, complex problem-solving, and nuanced decision-making that were once considered exclusively human domains. From healthcare diagnostics that can detect diseases with unprecedented accuracy to creative tools that assist artists and writers in expanding their artistic horizons, the applications seem limitless.

However, with great power comes great responsibility. As we integrate these powerful technologies into our society, we must carefully consider the ethical implications, ensure equitable access, and maintain human agency in critical decisions. The future will likely depend on our ability to harness this potential while preserving the values and principles that define our humanity.

In conclusion, ${prompt || "artificial intelligence"} represents both an unprecedented opportunity and a significant challenge that requires thoughtful consideration, collaborative effort, and responsible implementation from all stakeholders in our global community.`,
      
      blog: `${prompt || "The Future of Technology"}: A Deep Dive

Hey there, fellow tech enthusiasts! 👋

Today, I want to talk about something that's been on my mind lately: ${prompt.toLowerCase() || "the incredible pace of technological advancement"}. It's absolutely mind-blowing how quickly things are changing, and I think it's worth taking a moment to really think about what this means for all of us.

Let's be real here – we're living in the most exciting time in human history. Every day brings new innovations, breakthrough discoveries, and solutions to problems we didn't even know existed. But here's the thing: with all this rapid change comes both incredible opportunities and some serious challenges we need to address.

**What I find most fascinating:**
• The democratization of powerful tools and technologies
• How creativity and innovation are being amplified
• The potential for solving global challenges
• The way communities are forming around shared interests

But let's not forget the human element in all of this. Technology is amazing, but it's the people behind it – the dreamers, the builders, the problem-solvers – who really make the magic happen.

What do you think? How has technology impacted your life recently? Drop a comment below and let's start a conversation!

#Technology #Innovation #Future`,
      
      social: `🚀 Just discovered something amazing about ${prompt || "innovation"}! 

It's incredible how ${prompt.toLowerCase() || "new ideas"} can completely change our perspective and open up possibilities we never imagined. Sometimes the best breakthroughs come from the most unexpected places.

What's the most inspiring thing you've learned recently? Share it below! ⬇️

#Innovation #Growth #Learning #Inspiration`,
      
      poem: `${prompt || "A Moment in Time"}

In quiet moments when the world stands still,
And ${prompt.toLowerCase() || "dreams"} dance softly through the mind,
We find the magic that we've always sought,
In simple truths that help us see and feel.

The gentle whisper of the morning breeze,
The golden light that paints the evening sky,
These fleeting moments hold eternity,
And speak of beauty that will never die.

So let us pause and breathe the sweet air,
And listen to the music of our hearts,
For in these precious seconds we can find
The peace that every searching soul requires.`,
      
      script: `**Scene: A Conversation About ${prompt || "Dreams"}**

*Setting: A cozy coffee shop on a rainy afternoon. Two friends sit across from each other, steam rising from their cups.*

**ALEX:** You know, I've been thinking a lot about ${prompt.toLowerCase() || "following our dreams"} lately.

**JORDAN:** *looking up from their coffee* Really? What brought that on?

**ALEX:** *gazing out the window* I guess seeing all these changes in the world... it makes you wonder what's really important, you know?

**JORDAN:** *nodding thoughtfully* I get that. Sometimes it feels like we're all just going through the motions, doesn't it?

**ALEX:** Exactly! But what if we didn't have to? What if we could actually pursue what matters to us?

**JORDAN:** *leaning forward with interest* Tell me more. What would that look like for you?

*The conversation continues as rain patters against the window, creating an intimate atmosphere for deep discussion.*`,
      
      letter: `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

[Date]

[Recipient's Name]
[Title]
[Organization]
[Address]
[City, State, ZIP Code]

Dear [Recipient's Name],

I am writing to formally address the matter of ${prompt || "our recent discussion"}, which I believe requires immediate attention and careful consideration.

After thorough review and analysis of the situation, I would like to present the following points for your consideration:

First, the significance of ${prompt.toLowerCase() || "this matter"} extends beyond immediate concerns and has implications for long-term success and sustainability. The current circumstances present both challenges and opportunities that must be carefully balanced.

Second, I believe that collaborative effort and open communication will be essential in reaching a satisfactory resolution. All stakeholders should have the opportunity to contribute their perspectives and expertise.

Finally, I propose that we schedule a formal meeting to discuss these matters in detail and establish a clear path forward. I am confident that with proper planning and execution, we can achieve outcomes that benefit all parties involved.

I appreciate your time and consideration of these matters. Please feel free to contact me at your convenience to discuss next steps.

Sincerely,

[Your Signature]
[Your Printed Name]
[Your Title]`
    };

    const content = samples[type as keyof typeof samples] || samples.story;
    
    // Adjust content length based on target word count
    const currentWords = countWords(content);
    let finalContent = content;
    
    if (currentWords < words * 0.8) {
      finalContent += `\n\n[Content would be expanded to meet the ${words}-word target in a real implementation]`;
    } else if (currentWords > words * 1.2) {
      const sentences = content.split('. ');
      const targetSentences = Math.floor((sentences.length * words) / currentWords);
      finalContent = sentences.slice(0, targetSentences).join('. ') + '.';
    }

    setGeneratedContent(finalContent);
    
    // Save to localStorage
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      content: finalContent,
      type,
      prompt,
      wordCount: countWords(finalContent),
      timestamp: Date.now()
    };
    
    setSavedContent(prev => [newContent, ...prev.slice(0, 9)]); // Keep last 10
    setCurrentContentId(newContent.id);
    
    // Generate background image based on content
    if (prompt.trim()) {
      try {
        const images = await searchImages(prompt);
        if (images.length > 0) {
          setBackgroundImage(images[0].urls.regular);
        }
      } catch (error) {
        console.error('Failed to fetch background image:', error);
      }
    }
    
    setIsGenerating(false);
  };

  const enhanceText = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "No text to enhance",
        description: "Please enter some text to improve.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced text improvement
    const enhanced = text
      .replace(/\b(good|nice|ok|okay)\b/gi, "excellent")
      .replace(/\b(very)\b/gi, "exceptionally")
      .replace(/\b(big)\b/gi, "substantial")
      .replace(/\b(small)\b/gi, "compact")
      .replace(/\b(fast)\b/gi, "rapid")
      .replace(/\b(slow)\b/gi, "gradual")
      .replace(/\b(happy)\b/gi, "delighted")
      .replace(/\b(sad)\b/gi, "melancholy")
      .replace(/\b(angry)\b/gi, "frustrated")
      .replace(/\b(pretty)\b/gi, "beautiful");
    
    const improvements = [
      "• Enhanced vocabulary with more specific and impactful words",
      "• Improved clarity and readability",
      "• Strengthened emotional impact",
      "• Maintained original meaning while elevating language",
      "• Applied professional writing standards"
    ];
    
    const finalContent = `**Enhanced Version:**\n\n${enhanced}\n\n**Improvements Made:**\n${improvements.join('\n')}`;
    setGeneratedContent(finalContent);
    
    // Save enhanced content
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      content: finalContent,
      type: 'enhanced',
      prompt: 'Text Enhancement',
      wordCount: countWords(finalContent),
      timestamp: Date.now()
    };
    
    setSavedContent(prev => [newContent, ...prev.slice(0, 9)]);
    setCurrentContentId(newContent.id);
    setIsGenerating(false);
  };

  const regenerateContent = () => {
    if (inputText.trim()) {
      generateContent(contentType, inputText, targetWordCount[0]);
    } else {
      toast({
        title: "No prompt to regenerate",
        description: "Please enter a prompt first.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard! 📋",
      description: "The content has been copied to your clipboard."
    });
  };

  const handleLike = () => {
    if (currentContentId) {
      setSavedContent(prev => 
        prev.map(item => 
          item.id === currentContentId 
            ? { ...item, liked: !item.liked, disliked: false }
            : item
        )
      );
      toast({
        title: "Thanks for the feedback! ❤️",
        description: "Your preference has been saved."
      });
    }
  };

  const handleDislike = () => {
    if (currentContentId) {
      setSavedContent(prev => 
        prev.map(item => 
          item.id === currentContentId 
            ? { ...item, disliked: !item.disliked, liked: false }
            : item
        )
      );
      toast({
        title: "Feedback received 👍",
        description: "We'll use this to improve future generations."
      });
    }
  };

  const loadSavedContent = (content: GeneratedContent) => {
    setGeneratedContent(content.content);
    setCurrentContentId(content.id);
    setContentType(content.type);
    toast({
      title: "Content loaded",
      description: "Previous content has been restored."
    });
  };

  const clearSavedContent = () => {
    setSavedContent([]);
    toast({
      title: "Content cleared",
      description: "All saved content has been removed."
    });
  };

  const currentContent = savedContent.find(item => item.id === currentContentId);

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900"
         style={backgroundImage ? {
           backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         } : {}}>
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Writing Assistant
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm hidden sm:inline-flex">
                ✨ Powered by AI
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Unleash Your Creative Potential
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into compelling content with our AI-powered writing tools. 
            Generate stories, enhance your writing, and discover new creative possibilities.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generate" className="w-full max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Content Generation</span>
              <span className="sm:hidden">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="enhance" className="flex items-center gap-2">
              <Pen className="h-4 w-4" />
              <span className="hidden sm:inline">Writing Enhancement</span>
              <span className="sm:hidden">Enhance</span>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Creative Prompts</span>
              <span className="sm:hidden">Prompts</span>
            </TabsTrigger>
          </TabsList>

          {/* Generate Content Tab */}
          <TabsContent value="generate">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Input Panel */}
              <div className="xl:col-span-1 space-y-6">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Content Generator
                    </CardTitle>
                    <CardDescription>
                      Describe what you want to create and let AI generate it for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="content-type">Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="word-count">
                        Target Word Count: {targetWordCount[0]}
                        {wordCount > 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Current: {wordCount})
                          </span>
                        )}
                      </Label>
                      <Slider
                        id="word-count"
                        min={50}
                        max={1000}
                        step={25}
                        value={targetWordCount}
                        onValueChange={setTargetWordCount}
                        className="mt-2"
                      />
                      {progress > 0 && (
                        <Progress value={progress} className="mt-2" />
                      )}
                    </div>

                    <div>
                      <Label htmlFor="prompt-input">Your Prompt</Label>
                      <Textarea
                        id="prompt-input"
                        placeholder="Describe what you want to create... (e.g., 'A story about time travel' or 'Email about project deadline')"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="mt-1 min-h-[120px]"
                      />
                    </div>

                    <Button
                      onClick={() => generateContent(contentType, inputText, targetWordCount[0])}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <Settings className="h-5 w-5 text-gray-500" />
                      Advanced Options
                    </CardTitle>
                  </CardHeader>
                  {showAdvanced && (
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm">Background image generation</span>
                        <Badge variant="outline" className="text-xs">
                          {backgroundImage ? "On" : "Off"}
                        </Badge>
                      </div>
                      {savedContent.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSavedContent}
                          className="w-full"
                        >
                          Clear All Saved Content
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Output Panel */}
              <div className="xl:col-span-2">
                <Card className="h-fit">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Content</CardTitle>
                        <CardDescription>
                          Your AI-generated content will appear here
                          {wordCount > 0 && readingTime > 0 && (
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {wordCount} words
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readingTime} min read
                              </div>
                            </div>
                          )}
                        </CardDescription>
                      </div>
                      {generatedContent && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLike}
                            className={currentContent?.liked ? "text-red-500" : ""}
                          >
                            <Heart className={`h-4 w-4 ${currentContent?.liked ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDislike}
                            className={currentContent?.disliked ? "text-gray-500" : ""}
                          >
                            <ThumbsDown className={`h-4 w-4 ${currentContent?.disliked ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {generatedContent ? (
                      <div className="space-y-4">
                        <Textarea
                          value={generatedContent}
                          readOnly
                          className="min-h-[400px] resize-none font-mono text-sm"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTXT(generatedContent)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            TXT
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadPDF(generatedContent)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={regenerateContent}
                            disabled={isGenerating || !inputText.trim()}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Ready to create something amazing?</p>
                        <p className="text-sm">Enter a prompt and generate your first piece of content!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Saved Content */}
                {savedContent.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Save className="h-5 w-5 text-green-500" />
                        Recently Generated ({savedContent.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                        {savedContent.map((content) => (
                          <div
                            key={content.id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => loadSavedContent(content)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {contentTypes.find(t => t.value === content.type)?.label || content.type}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {content.liked && <Heart className="h-3 w-3 text-red-500 fill-current" />}
                                {content.disliked && <ThumbsDown className="h-3 w-3 text-gray-500 fill-current" />}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {content.prompt}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{content.wordCount} words</span>
                              <span>•</span>
                              <span>{new Date(content.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Enhance Writing Tab */}
          <TabsContent value="enhance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pen className="h-5 w-5 text-blue-500" />
                    Text Enhancement
                  </CardTitle>
                  <CardDescription>
                    Paste your text and get AI-powered improvements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="enhance-input">Your Text</Label>
                    <Textarea
                      id="enhance-input"
                      placeholder="Paste the text you want to improve..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="mt-1 min-h-[200px]"
                    />
                  </div>

                  <Button
                    onClick={() => enhanceText(inputText)}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Pen className="h-4 w-4 mr-2" />
                        Enhance Text
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Version</CardTitle>
                  <CardDescription>
                    See the improved version of your text
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <div className="space-y-4">
                      <Textarea
                        value={generatedContent}
                        readOnly
                        className="min-h-[300px] resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadTXT(generatedContent)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          TXT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadPDF(generatedContent)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Pen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter some text to see enhancements here!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Creative Prompts Tab */}
          <TabsContent value="prompts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Story Starters",
                  prompts: [
                    "A world where colors have sounds",
                    "The last library on Earth",
                    "Messages found in old books",
                    "A city that exists only at night",
                    "Dreams that predict the future"
                  ],
                  color: "purple"
                },
                {
                  title: "Character Ideas",
                  prompts: [
                    "A detective who solves crimes through dreams",
                    "A chef who cooks with emotions",
                    "A musician who can play memories",
                    "A gardener who grows impossible plants",
                    "A librarian who protects forbidden knowledge"
                  ],
                  color: "blue"
                },
                {
                  title: "Writing Exercises",
                  prompts: [
                    "Write from an object's perspective",
                    "Describe a place using only sounds",
                    "Write a conversation without dialogue tags",
                    "Tell a story backwards",
                    "Create a world with different physics"
                  ],
                  color: "green"
                },
                {
                  title: "Business & Professional",
                  prompts: [
                    "A proposal for sustainable innovation",
                    "Email announcing a new partnership",
                    "Report on quarterly achievements",
                    "Meeting agenda for team collaboration",
                    "Product launch announcement"
                  ],
                  color: "orange"
                },
                {
                  title: "Creative Content",
                  prompts: [
                    "A day in the life of a superhero",
                    "Recipe for happiness",
                    "Travel guide to an imaginary place",
                    "Review of a movie that doesn't exist",
                    "Interview with a historical figure"
                  ],
                  color: "pink"
                },
                {
                  title: "Educational",
                  prompts: [
                    "Explain quantum physics to a child",
                    "History lesson through a story",
                    "How to build confidence",
                    "The importance of creativity",
                    "Future of renewable energy"
                  ],
                  color: "teal"
                }
              ].map((category, index) => (
                <Card key={index} className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className={`h-5 w-5 text-${category.color}-500`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.prompts.map((prompt, promptIndex) => (
                      <div
                        key={promptIndex}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setInputText(prompt)}
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300">{prompt}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-gray-600 dark:text-gray-400">Create stories, emails, and essays with advanced AI technology</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Pen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Writing Enhancement</h3>
              <p className="text-gray-600 dark:text-gray-400">Improve your existing text with intelligent suggestions</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Lightbulb className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Creative Inspiration</h3>
              <p className="text-gray-600 dark:text-gray-400">Discover new ideas with our curated writing prompts</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 AI Writing Assistant. Created with ❤️ using React & AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
