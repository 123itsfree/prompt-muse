import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Settings } from 'lucide-react';

const SelectGrade = () => {
  const navigate = useNavigate();

  const grades = [
    { value: 6, label: '6th Grade', description: 'Creative exploration and foundational skills' },
    { value: 7, label: '7th Grade', description: 'Developing critical thinking and expression' },
    { value: 8, label: '8th Grade', description: 'Advanced analysis and mature themes' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin Panel
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 shadow-medium">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Select Grade Level</h1>
          <p className="text-muted-foreground text-lg">
            Choose the grade to access tailored journal prompts
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {grades.map((grade) => (
            <Card
              key={grade.value}
              className="cursor-pointer transition-all hover:shadow-medium hover:scale-105"
              onClick={() => navigate(`/select-section/${grade.value}`)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-secondary-foreground">
                    {grade.value}
                  </span>
                </div>
                <CardTitle className="text-xl">{grade.label}</CardTitle>
                <CardDescription>{grade.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectGrade;
