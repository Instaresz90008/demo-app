
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, X, Star, CheckSquare, Circle, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type QuestionType = 'text' | 'textarea' | 'boolean' | 'single-choice' | 'multiple-choice' | 'rating' | 'number';

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  maxRating?: number;
  minValue?: number;
  maxValue?: number;
  placeholder?: string;
  order: number;
  isActive: boolean;
}

const QUESTION_TYPE_CONFIG = {
  text: { icon: '📝', label: 'Text Input', description: 'Single line text input' },
  textarea: { icon: '📄', label: 'Long Text', description: 'Multi-line text area' },
  boolean: { icon: '✅', label: 'Yes/No', description: 'Boolean true/false question' },
  'single-choice': { icon: '🔘', label: 'Single Choice', description: 'Select one option from list' },
  'multiple-choice': { icon: '☑️', label: 'Multiple Choice', description: 'Select multiple options' },
  rating: { icon: '⭐', label: 'Rating', description: 'Star rating (1-5 or 1-10)' },
  number: { icon: '🔢', label: 'Number', description: 'Numeric input with min/max' }
};

interface QuestionsManagerProps {
  onClose: () => void;
}

export const QuestionsManager: React.FC<QuestionsManagerProps> = ({ onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'text',
    required: false,
    isActive: true,
    options: [],
    maxRating: 5
  });
  const { toast } = useToast();

  const handleCreateQuestion = () => {
    if (!newQuestion.title) {
      toast({ title: 'Error', description: 'Question title is required', variant: 'destructive' });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      title: newQuestion.title,
      description: newQuestion.description,
      type: newQuestion.type as QuestionType,
      required: newQuestion.required || false,
      options: newQuestion.options || [],
      maxRating: newQuestion.maxRating || 5,
      minValue: newQuestion.minValue,
      maxValue: newQuestion.maxValue,
      placeholder: newQuestion.placeholder,
      order: questions.length + 1,
      isActive: newQuestion.isActive || true
    };

    setQuestions([...questions, question]);
    setNewQuestion({ type: 'text', required: false, isActive: true, options: [], maxRating: 5 });
    setShowCreateDialog(false);
    
    toast({ title: 'Success', description: 'Question created successfully' });
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion || !editingQuestion.title) {
      toast({ title: 'Error', description: 'Question title is required', variant: 'destructive' });
      return;
    }

    setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setEditingQuestion(null);
    
    toast({ title: 'Success', description: 'Question updated successfully' });
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    toast({ title: 'Success', description: 'Question deleted successfully' });
  };

  const handleToggleActive = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, isActive: !q.isActive } : q
    ));
  };

  const addOption = (options: string[], setOptions: (options: string[]) => void) => {
    setOptions([...options, '']);
  };

  const updateOption = (options: string[], index: number, value: string, setOptions: (options: string[]) => void) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (options: string[], index: number, setOptions: (options: string[]) => void) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const renderQuestionForm = (question: Partial<Question>, setQuestion: (q: Partial<Question>) => void, isEditing = false) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Question Title *</Label>
        <Input
          id="title"
          value={question.title || ''}
          onChange={(e) => setQuestion({ ...question, title: e.target.value })}
          placeholder="Enter your question"
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={question.description || ''}
          onChange={(e) => setQuestion({ ...question, description: e.target.value })}
          placeholder="Additional context for the question"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="type">Question Type</Label>
        <Select value={question.type} onValueChange={(value) => setQuestion({ ...question, type: value as QuestionType })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(QUESTION_TYPE_CONFIG).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <div>
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Options for choice questions */}
      {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {(question.options || []).map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(question.options || [], index, e.target.value, (options) => setQuestion({ ...question, options }))}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(question.options || [], index, (options) => setQuestion({ ...question, options }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addOption(question.options || [], (options) => setQuestion({ ...question, options }))}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      )}

      {/* Rating configuration */}
      {question.type === 'rating' && (
        <div>
          <Label htmlFor="maxRating">Maximum Rating</Label>
          <Select value={question.maxRating?.toString()} onValueChange={(value) => setQuestion({ ...question, maxRating: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="10">10 Points</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Number configuration */}
      {question.type === 'number' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minValue">Minimum Value</Label>
            <Input
              id="minValue"
              type="number"
              value={question.minValue || ''}
              onChange={(e) => setQuestion({ ...question, minValue: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
          <div>
            <Label htmlFor="maxValue">Maximum Value</Label>
            <Input
              id="maxValue"
              type="number"
              value={question.maxValue || ''}
              onChange={(e) => setQuestion({ ...question, maxValue: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
        </div>
      )}

      {/* Placeholder for text inputs */}
      {(question.type === 'text' || question.type === 'textarea') && (
        <div>
          <Label htmlFor="placeholder">Placeholder Text</Label>
          <Input
            id="placeholder"
            value={question.placeholder || ''}
            onChange={(e) => setQuestion({ ...question, placeholder: e.target.value })}
            placeholder="Placeholder text for the input"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={question.required || false}
            onCheckedChange={(checked) => setQuestion({ ...question, required: checked })}
          />
          <Label htmlFor="required">Required</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={question.isActive !== false}
            onCheckedChange={(checked) => setQuestion({ ...question, isActive: checked })}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Questions Manager</CardTitle>
            <CardDescription>
              Create and manage questions to collect additional information from your booking clients
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 mb-6">Create your first question to start collecting information from clients</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card key={question.id} className={`border-l-4 ${question.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{QUESTION_TYPE_CONFIG[question.type].icon}</span>
                        <h3 className="font-semibold">{question.title}</h3>
                        {question.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                        <Badge variant={question.isActive ? "default" : "secondary"} className="text-xs">
                          {question.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {question.description && (
                        <p className="text-sm text-muted-foreground mb-2">{question.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Type: {QUESTION_TYPE_CONFIG[question.type].label}</span>
                        {question.options && question.options.length > 0 && (
                          <span>Options: {question.options.length}</span>
                        )}
                        {question.type === 'rating' && (
                          <span>Max Rating: {question.maxRating}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(question.id)}
                        className={question.isActive ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                      >
                        {question.isActive ? "Active" : "Inactive"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
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

        {/* Create Question Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
              <DialogDescription>
                Add a new question to collect information from your booking clients
              </DialogDescription>
            </DialogHeader>
            {renderQuestionForm(newQuestion, setNewQuestion)}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuestion}>
                Create Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Question Dialog */}
        <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>
                Update the question details and configuration
              </DialogDescription>
            </DialogHeader>
            {editingQuestion && renderQuestionForm(editingQuestion, (updatedQuestion) => {
              setEditingQuestion({ ...editingQuestion, ...updatedQuestion });
            }, true)}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuestion}>
                Update Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuestionsManager;
