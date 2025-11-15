import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getPromptsByGradeAndSection } from '@/data/prompts';
import { getFinishedPromptsByGradeAndSection } from '@/lib/storage';
import SpinWheel from '@/components/SpinWheel';

const Wheel = () => {
  const navigate = useNavigate();
  const { grade, section } = useParams<{ grade: string; section: string }>();
  
  const gradeNum = parseInt(grade!) as 6 | 7 | 8;
  const sectionStr = section as 'Humanity' | 'Honors';
  
  const allPrompts = getPromptsByGradeAndSection(gradeNum, sectionStr);
  const finishedPrompts = getFinishedPromptsByGradeAndSection(gradeNum, sectionStr);
  const finishedIds = new Set(finishedPrompts.map(fp => fp.promptId));
  
  // Only include unfinished prompts in the wheel
  const availablePrompts = allPrompts.filter(prompt => !finishedIds.has(prompt.id));

  const handleSelectPrompt = (prompt: any) => {
    navigate(`/prompt/${prompt.id}`);
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
            {availablePrompts.length} of {allPrompts.length} prompts remaining
          </p>
        </div>

        <div className="flex justify-center">
          <SpinWheel prompts={availablePrompts} onSelect={handleSelectPrompt} />
        </div>
      </div>
    </div>
  );
};

export default Wheel;
