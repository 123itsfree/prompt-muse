import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, ArrowLeft } from 'lucide-react';

const SelectSection = () => {
  const navigate = useNavigate();
  const { grade } = useParams<{ grade: string }>();

  const sections = [
    {
      value: 'Humanity',
      label: 'Humanity',
      description: 'Foundational prompts focusing on creativity and self-expression',
      icon: Users,
    },
    {
      value: 'Honors',
      label: 'Honors',
      description: 'Advanced prompts with analytical and philosophical depth',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/select-grade')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grade Selection
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Select Section</h1>
          <p className="text-muted-foreground text-lg">
            Grade {grade} - Choose your section
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.value}
                className="cursor-pointer transition-all hover:shadow-medium hover:scale-105"
                onClick={() => navigate(`/prompts/${grade}/${section.value}`)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mb-4 shadow-soft">
                    <Icon className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{section.label}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    Select {section.label}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectSection;
