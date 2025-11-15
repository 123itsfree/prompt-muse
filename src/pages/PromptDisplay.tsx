import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Volume2, VolumeX, Image, CheckCircle2, Circle } from 'lucide-react';
import { journalPrompts } from '@/data/prompts';
import { isPromptFinished, markPromptFinished, unmarkPromptFinished } from '@/lib/storage';
import { toast } from 'sonner';

const PromptDisplay = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const prompt = journalPrompts.find(p => p.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [finished, setFinished] = useState(false);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynthesis(window.speechSynthesis);
    }
    if (prompt) {
      setFinished(isPromptFinished(prompt.id));
    }
  }, [prompt]);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/select-grade')}>
              Return to Grade Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (!synthesis) return;

    if (isPlaying) {
      synthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(
        `${prompt.title}. ${prompt.text}. ${prompt.instructions}`
      );
      utterance.onend = () => setIsPlaying(false);
      synthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const toggleFinished = () => {
    if (finished) {
      unmarkPromptFinished(prompt.id);
      setFinished(false);
      toast.success('Prompt unmarked');
    } else {
      markPromptFinished(prompt.id, prompt.grade, prompt.section);
      setFinished(true);
      toast.success('Prompt marked as finished!');
    }
  };

  // Generate a simple example image placeholder
  const exampleImageSrc = prompt.exampleImage || `https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop`;
  const backgroundImageSrc = prompt.backgroundImage || `https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop`;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImageSrc})`,
      }}
    >
      <div className="min-h-screen backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <Button
            variant="secondary"
            onClick={() => navigate(`/manual/${prompt.grade}/${prompt.section}`)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prompts
          </Button>

          <Card className="shadow-strong backdrop-blur-md bg-card/95">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center gap-3">
                <CardTitle className="text-4xl font-bold">{prompt.title}</CardTitle>
                {finished && (
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    FINISHED
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">Grade {prompt.grade}</Badge>
                <Badge variant="outline">{prompt.section}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-xl text-center font-medium mb-4">
                  {prompt.text}
                </p>
                
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePlayPause}
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX className="h-5 w-5" />
                        Stop Reading
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-5 w-5" />
                        Read Aloud
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <p className="text-muted-foreground">{prompt.instructions}</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant={finished ? "outline" : "default"}
                  size="lg"
                  onClick={toggleFinished}
                  className="gap-2"
                >
                  {finished ? (
                    <>
                      <Circle className="h-5 w-5" />
                      Mark as Not Finished
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Finished
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowExample(true)}
                  className="gap-2"
                >
                  <Image className="h-5 w-5" />
                  View Example
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example Image Modal */}
        <Dialog open={showExample} onOpenChange={setShowExample}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Example Image - {prompt.title}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <img
                src={exampleImageSrc}
                alt={`Example for ${prompt.title}`}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PromptDisplay;
