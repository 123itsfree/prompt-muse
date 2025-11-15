import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getPromptsByGradeAndSection, getFinishedPromptIds, unmarkPromptAsFinished, JournalPrompt } from '@/lib/promptService';
import { toast } from 'sonner';

const Manual = () => {
  const navigate = useNavigate();
  const { grade, section } = useParams<{ grade: string; section: string }>();

  const gradeNum = parseInt(grade!) as 6 | 7 | 8;
  const sectionStr = section as 'Humanity' | 'Honors';

  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [finishedIds, setFinishedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [fetchedPrompts, finished] = await Promise.all([
        getPromptsByGradeAndSection(gradeNum, sectionStr),
        getFinishedPromptIds(gradeNum, sectionStr)
      ]);
      setPrompts(fetchedPrompts);
      setFinishedIds(finished);
      setLoading(false);
    };
    loadData();
  }, [gradeNum, sectionStr]);

  const handleUnmark = async (promptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await unmarkPromptAsFinished(promptId);
    setFinishedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(promptId);
      return newSet;
    });
    toast.success('Prompt unmarked and returned to available prompts');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/prompts/${grade}/${section}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Method Selection
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose a Prompt</h1>
          <p className="text-muted-foreground text-lg">
            Grade {grade} - {section}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {prompts.length} prompts available
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading prompts...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => {
              const finished = finishedIds.has(prompt.id);
            
            return (
              <Card
                key={prompt.id}
                className={`cursor-pointer transition-all hover:shadow-medium ${
                  finished ? 'opacity-75' : 'hover:scale-105'
                }`}
                onClick={() => navigate(`/prompt/${prompt.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">
                      {prompt.title}
                    </CardTitle>
                    {finished && (
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success shrink-0"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        FINISHED
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {prompt.text}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Prompt
                    </Button>
                    {finished && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleUnmark(prompt.id, e)}
                        className="shrink-0"
                      >
                        Unmark
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Manual;
