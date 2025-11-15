import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase, DbPrompt } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<DbPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<DbPrompt | null>(null);
  const [formData, setFormData] = useState({
    prompt_id: '',
    title: '',
    text: '',
    instructions: '',
    grade: '6',
    section: 'Humanity',
    background_image: '',
    example_image: '',
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('grade', { ascending: true })
      .order('section', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load prompts');
      console.error(error);
    } else {
      setPrompts(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const promptData = {
      prompt_id: formData.prompt_id,
      title: formData.title,
      text: formData.text,
      instructions: formData.instructions,
      grade: parseInt(formData.grade),
      section: formData.section,
      background_image: formData.background_image || null,
      example_image: formData.example_image || null,
      is_active: true,
    };

    if (editingPrompt) {
      const { error } = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', editingPrompt.id);

      if (error) {
        toast.error('Failed to update prompt');
        console.error(error);
      } else {
        toast.success('Prompt updated successfully');
        setIsDialogOpen(false);
        fetchPrompts();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('prompts')
        .insert([promptData]);

      if (error) {
        toast.error('Failed to create prompt');
        console.error(error);
      } else {
        toast.success('Prompt created successfully');
        setIsDialogOpen(false);
        fetchPrompts();
        resetForm();
      }
    }
  };

  const handleEdit = (prompt: DbPrompt) => {
    setEditingPrompt(prompt);
    setFormData({
      prompt_id: prompt.prompt_id,
      title: prompt.title,
      text: prompt.text,
      instructions: prompt.instructions,
      grade: prompt.grade.toString(),
      section: prompt.section,
      background_image: prompt.background_image || '',
      example_image: prompt.example_image || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    const { error } = await supabase
      .from('prompts')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete prompt');
      console.error(error);
    } else {
      toast.success('Prompt deleted successfully');
      fetchPrompts();
    }
  };

  const resetForm = () => {
    setFormData({
      prompt_id: '',
      title: '',
      text: '',
      instructions: '',
      grade: '6',
      section: 'Humanity',
      background_image: '',
      example_image: '',
    });
    setEditingPrompt(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/select-grade')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Prompt Management</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="prompt_id">Prompt ID (e.g., 6h1, 7ho5)</Label>
                  <Input
                    id="prompt_id"
                    value={formData.prompt_id}
                    onChange={(e) => setFormData({ ...formData, prompt_id: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="text">Prompt Text</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => setFormData({ ...formData, grade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6th Grade</SelectItem>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Select
                      value={formData.section}
                      onValueChange={(value) => setFormData({ ...formData, section: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Humanity">Humanity</SelectItem>
                        <SelectItem value="Honors">Honors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="background_image">Background Image URL (Optional)</Label>
                  <Input
                    id="background_image"
                    value={formData.background_image}
                    onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="example_image">Example Image URL (Optional)</Label>
                  <Input
                    id="example_image"
                    value={formData.example_image}
                    onChange={(e) => setFormData({ ...formData, example_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPrompt ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Prompts ({prompts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading prompts...</p>
            ) : prompts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No prompts yet. Add your first prompt!</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Text Preview</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="font-mono text-sm">{prompt.prompt_id}</TableCell>
                        <TableCell className="font-medium">{prompt.title}</TableCell>
                        <TableCell>{prompt.grade}</TableCell>
                        <TableCell>{prompt.section}</TableCell>
                        <TableCell className="max-w-md truncate">{prompt.text}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(prompt)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
