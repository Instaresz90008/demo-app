
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, HelpCircle, Settings, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  options?: string[];
  required: boolean;
  category: 'booking' | 'onboarding' | 'feedback';
  order: number;
  active: boolean;
  conditions?: {
    showIf: string;
    value: string;
  };
}

const QuestionsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'What is the purpose of your visit?',
      type: 'select',
      options: ['Consultation', 'Treatment', 'Follow-up', 'Emergency'],
      required: true,
      category: 'booking',
      order: 1,
      active: true
    },
    {
      id: '2',
      question: 'Any allergies or medical conditions?',
      type: 'textarea',
      required: false,
      category: 'booking',
      order: 2,
      active: true
    },
    {
      id: '3',
      question: 'How did you hear about us?',
      type: 'radio',
      options: ['Google', 'Social Media', 'Friend', 'Advertisement'],
      required: false,
      category: 'onboarding',
      order: 3,
      active: true
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSaveQuestion = (questionData: Partial<Question>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? { ...q, ...questionData } : q
      ));
      toast({
        title: "Question Updated",
        description: "Question has been successfully updated.",
      });
    } else {
      const newQuestion: Question = {
        id: Date.now().toString(),
        question: questionData.question || '',
        type: questionData.type || 'text',
        options: questionData.options,
        required: questionData.required || false,
        category: questionData.category || 'booking',
        order: questions.length + 1,
        active: true,
        conditions: questionData.conditions
      };
      setQuestions(prev => [...prev, newQuestion]);
      toast({
        title: "Question Added",
        description: "New question has been successfully added.",
      });
    }
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question Deleted",
      description: "Question has been successfully removed.",
    });
  };

  const toggleQuestionStatus = (id: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, active: !q.active } : q
    ));
  };

  const QuestionForm: React.FC<{ question?: Question; onSave: (data: Partial<Question>) => void }> = ({ 
    question, 
    onSave 
  }) => {
    const [formData, setFormData] = useState<Partial<Question>>(question || {
      question: '',
      type: 'text',
      required: false,
      category: 'booking',
      active: true,
      options: []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="question">Question Text</Label>
          <Textarea
            id="question"
            value={formData.question || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            placeholder="Enter your question..."
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Question Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Question['type'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="textarea">Long Text</SelectItem>
              <SelectItem value="select">Dropdown</SelectItem>
              <SelectItem value="radio">Radio Buttons</SelectItem>
              <SelectItem value="checkbox">Checkboxes</SelectItem>
              <SelectItem value="date">Date Picker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(formData.type === 'select' || formData.type === 'radio' || formData.type === 'checkbox') && (
          <div>
            <Label>Options (one per line)</Label>
            <Textarea
              value={formData.options?.join('\n') || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                options: e.target.value.split('\n').filter(Boolean) 
              }))}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}

        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Question['category'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">Booking Questions</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={formData.required || false}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
          />
          <Label htmlFor="required">Required Question</Label>
        </div>

        <Button type="submit" className="w-full">
          {question ? 'Update Question' : 'Add Question'}
        </Button>
      </form>
    );
  };

  const QuestionPreview: React.FC<{ question: Question }> = ({ question }) => {
    const renderQuestionInput = () => {
      switch (question.type) {
        case 'text':
          return <Input placeholder="Enter your answer..." />;
        case 'textarea':
          return <Textarea placeholder="Enter your detailed answer..." />;
        case 'select':
          return (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'radio':
          return (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="radio" name={question.id} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          );
        case 'checkbox':
          return (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          );
        case 'date':
          return <Input type="date" />;
        default:
          return <Input placeholder="Enter your answer..." />;
      }
    };

    return (
      <div className="space-y-2">
        <Label className="text-base">
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {renderQuestionInput()}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            ❓ Questions Management
          </h1>
          <p className="text-muted-foreground">Add onboarding or booking questions with smart logic</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={previewMode ? "outline" : "default"}
            onClick={() => setPreviewMode(false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>

        {!previewMode && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingQuestion(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </DialogTitle>
              </DialogHeader>
              <QuestionForm 
                question={editingQuestion || undefined} 
                onSave={handleSaveQuestion} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {previewMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Question Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions
              .filter(q => q.active)
              .sort((a, b) => a.order - b.order)
              .map((question) => (
                <QuestionPreview key={question.id} question={question} />
              ))}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{question.question}</h3>
                      {question.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <Badge variant={question.active ? "default" : "secondary"} className="text-xs">
                        {question.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Type: {question.type} | Order: {question.order}
                    </p>
                    {question.options && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Options: {question.options.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={question.active}
                      onCheckedChange={() => toggleQuestionStatus(question.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingQuestion(question);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsManagementPage;
