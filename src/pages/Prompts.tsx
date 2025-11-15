import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, List } from 'lucide-react';
import { getPromptsByGradeAndSection } from '@/data/prompts';

const Prompts = () => {
  const navigate = useNavigate();
  const { grade, section } = useParams<{ grade: string; section: string }>();
  
  const gradeNum = parseInt(grade!) as 6 | 7 | 8;
  const sectionStr = section as 'Humanity' | 'Honors';
  
  const prompts = getPromptsByGradeAndSection(gradeNum, sectionStr);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/select-section/${grade}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Section Selection
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Method</h1>
          <p className="text-muted-foreground text-lg">
            Grade {grade} - {section}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {prompts.length} prompts available
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            className="cursor-pointer transition-all hover:shadow-strong hover:scale-105 bg-gradient-to-br from-accent/10 to-secondary/10"
            onClick={() => navigate(`/wheel/${grade}/${section}`)}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center mb-4 shadow-medium animate-pulse">
                <Sparkles className="w-12 h-12 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Spin the Wheel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Let fate decide! Spin the wheel for a random prompt that hasn't been used yet.
              </p>
              <Button size="lg" className="w-full">
                Spin the Wheel
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-strong hover:scale-105 bg-gradient-to-br from-primary/10 to-secondary/10"
            onClick={() => navigate(`/manual/${grade}/${section}`)}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-medium">
                <List className="w-12 h-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Choose Manually</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Browse all prompts and select the one that fits your needs today.
              </p>
              <Button size="lg" className="w-full" variant="outline">
                Browse Prompts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prompts;
