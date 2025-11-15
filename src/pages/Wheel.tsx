import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { getPromptsByGradeAndSection, getFinishedPromptIds, JournalPrompt } from '@/lib/promptService';
import SpinWheel from '@/components/SpinWheel';

const Wheel = () => {
  const navigate = useNavigate();
  const { grade, section } = useParams<{ grade: string; section: string }>();

  const gradeNum = parseInt(grade!) as 6 | 7 | 8;
  const sectionStr = section as 'Humanity' | 'Honors';

  const [allPrompts, setAllPrompts] = useState<JournalPrompt[]>([]);
  const [availablePrompts, setAvailablePrompts] = useState<JournalPrompt[]>([]);
  const [wheelPrompts, setWheelPrompts] = useState<JournalPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [prompts, finishedIds] = await Promise.all([
        getPromptsByGradeAndSection(gradeNum, sectionStr),
        getFinishedPromptIds(gradeNum, sectionStr)
      ]);
      setAllPrompts(prompts);
      const available = prompts.filter(p => !finishedIds.has(p.id));
      setAvailablePrompts(available);
      setWheelPrompts(getRandomPrompts(available));
      setLoading(false);
    };
    loadData();
  }, [gradeNum, sectionStr]);

  const getRandomPrompts = (prompts: JournalPrompt[]) => {
    if (prompts.length <= 5) {
      return prompts;
    }
    const shuffled = [...prompts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

  const handleSelectPrompt = (prompt: any) => {
    navigate(`/prompt/${prompt.id}`);
  };

  const handleRefresh = () => {
    setWheelPrompts(getRandomPrompts(availablePrompts));
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
          <h1 className="text-4xl font-bold mb-2">Spin the Wheel!</h1>
          <p className="text-muted-foreground text-lg">
            Grade {grade} - {section}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Showing 5 random prompts from {availablePrompts.length} available
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="gap-2"
            disabled={availablePrompts.length === 0}
          >
            <RefreshCw className="w-4 h-4" />
            Get Different Prompts
          </Button>

          <SpinWheel prompts={wheelPrompts} onSelect={handleSelectPrompt} />
        </div>
      </div>
    </div>
  );
};

export default Wheel;
