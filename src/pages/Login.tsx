import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setAuth } from '@/lib/storage';
import { toast } from 'sonner';
import { BookOpen, Lock } from 'lucide-react';

const CORRECT_PASSWORD = '6677';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setAuth(true);
      toast.success('Welcome! Access granted.');
      navigate('/select-grade');
    } else {
      toast.error('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Journal Prompts</CardTitle>
          <CardDescription className="text-base">
            A creative writing tool for inspiring young minds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Enter Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="text-center text-lg tracking-wider"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Access Prompts
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
