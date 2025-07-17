import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, HelpCircle, Settings, Edit3 } from 'lucide-react';
import { ServiceQuestion } from '../types/meetingTypes';

interface Props {
  questions: ServiceQuestion[];
  onChange: (questions: ServiceQuestion[]) => void;
}

const questionTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
];

const QuestionManager: React.FC<Props> = ({ questions, onChange }) => {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const addQuestion = () => {
    const newQuestion: ServiceQuestion = {
      id: `q_${Date.now()}`,
      text: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: []
    };
    onChange([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<ServiceQuestion>) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    );
    onChange(updatedQuestions);
  };

  const deleteQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
    if (editingQuestion === id) {
      setEditingQuestion(null);
    }
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || []), ''];
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || [])];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || [])];
      newOptions.splice(optionIndex, 1);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Booking Questions</h3>
            <p className="text-sm text-muted-foreground">Collect additional information from participants</p>
          </div>
        </div>
        <Button onClick={addQuestion} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="border-2 border-dashed border-border">
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4">
              Add questions to collect additional information from participants during booking.
            </p>
            <Button onClick={addQuestion} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Question {index + 1}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {questionTypes.find(t => t.value === question.type)?.icon}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                    </div>
                    {question.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(
                        editingQuestion === question.id ? null : question.id
                      )}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {editingQuestion === question.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Question Text
                        </label>
                        <Input
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                          placeholder="Enter your question..."
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Question Type
                        </label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(question.id, { 
                            type: value as ServiceQuestion['type'],
                            options: value === 'select' || value === 'checkbox' ? [''] : undefined
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <span>{type.icon}</span>
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Placeholder Text (Optional)
                      </label>
                      <Input
                        value={question.placeholder || ''}
                        onChange={(e) => updateQuestion(question.id, { placeholder: e.target.value })}
                        placeholder="Enter placeholder text..."
                        className="bg-background"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={question.required}
                        onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                      />
                      <label className="text-sm font-medium text-foreground">
                        Required field
                      </label>
                    </div>

                    {(question.type === 'select' || question.type === 'checkbox') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">
                            Options
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                            className="h-8"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="bg-background"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="text-destructive hover:text-destructive h-8 w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingQuestion(null)}
                      >
                        Done Editing
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="space-y-2">
                    <div className="text-base font-medium text-foreground">
                      {question.text || 'Untitled Question'}
                    </div>
                    {question.placeholder && (
                      <div className="text-sm text-muted-foreground">
                        Placeholder: "{question.placeholder}"
                      </div>
                    )}
                    {(question.type === 'select' || question.type === 'checkbox') && question.options && (
                      <div className="text-sm text-muted-foreground">
                        Options: {question.options.filter(opt => opt.trim()).join(', ') || 'No options defined'}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Summary</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {questions.length} question{questions.length !== 1 ? 's' : ''} configured
            {questions.filter(q => q.required).length > 0 && (
              <> • {questions.filter(q => q.required).length} required</>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;