import { useState } from "react";
import { Plus, Pencil, Trash2, Save, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface SuggestedQuestion {
  id: string;
  text: string;
  enabled: boolean;
}

interface ResponseTemplate {
  id: string;
  trigger: string;
  response: string;
  enabled: boolean;
}

interface PageSettings {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  noMatchMessage: string;
  maxRecommendations: number;
}

const initialQuestions: SuggestedQuestion[] = [
  { id: "1", text: "I love woody and musky scents", enabled: true },
  { id: "2", text: "Looking for something fresh and citrusy", enabled: true },
  { id: "3", text: "Recommend a romantic floral perfume", enabled: true },
  { id: "4", text: "I want something like Sauvage", enabled: true },
  { id: "5", text: "What's good for office wear?", enabled: true },
  { id: "6", text: "Something with vanilla notes", enabled: true },
];

const initialTemplates: ResponseTemplate[] = [
  { 
    id: "1", 
    trigger: "office,work", 
    response: "For office wear, I'd recommend these sophisticated yet subtle fragrances that won't overpower your colleagues.",
    enabled: true 
  },
  { 
    id: "2", 
    trigger: "date,romantic,evening", 
    response: "For a romantic occasion, these captivating fragrances will leave a lasting impression.",
    enabled: true 
  },
  { 
    id: "3", 
    trigger: "fresh,citrus,summer", 
    response: "For a fresh and invigorating experience, these citrusy fragrances are perfect.",
    enabled: true 
  },
];

const AiAdvisorAdmin = () => {
  const [questions, setQuestions] = useState<SuggestedQuestion[]>(initialQuestions);
  const [templates, setTemplates] = useState<ResponseTemplate[]>(initialTemplates);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "Find Your Perfect Scent",
    subtitle: "Tell me what you like, and I'll recommend the perfect fragrance for you",
    welcomeMessage: "Hi! I'm your personal fragrance advisor. Tell me about the notes you love, describe a perfume you've enjoyed, or share the occasion you're shopping for. I'll recommend perfect matches from our collection!",
    noMatchMessage: "I couldn't find exact matches for that, but let me know more about what you're looking for! Do you prefer fresh, woody, floral, or oriental scents?",
    maxRecommendations: 4,
  });

  // Question Dialog State
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SuggestedQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({ text: "" });

  // Template Dialog State
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({ trigger: "", response: "" });

  // Question CRUD
  const openQuestionDialog = (question?: SuggestedQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({ text: question.text });
    } else {
      setEditingQuestion(null);
      setQuestionForm({ text: "" });
    }
    setQuestionDialogOpen(true);
  };

  const saveQuestion = () => {
    if (!questionForm.text.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? { ...q, text: questionForm.text } : q)));
      toast.success("Question updated successfully");
    } else {
      setQuestions([...questions, { id: Date.now().toString(), text: questionForm.text, enabled: true }]);
      toast.success("Question added successfully");
    }
    setQuestionDialogOpen(false);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success("Question deleted");
  };

  const toggleQuestion = (id: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, enabled: !q.enabled } : q)));
  };

  // Template CRUD
  const openTemplateDialog = (template?: ResponseTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({ trigger: template.trigger, response: template.response });
    } else {
      setEditingTemplate(null);
      setTemplateForm({ trigger: "", response: "" });
    }
    setTemplateDialogOpen(true);
  };

  const saveTemplate = () => {
    if (!templateForm.trigger.trim() || !templateForm.response.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map((t) => (t.id === editingTemplate.id ? { ...t, ...templateForm } : t)));
      toast.success("Template updated successfully");
    } else {
      setTemplates([...templates, { id: Date.now().toString(), ...templateForm, enabled: true }]);
      toast.success("Template added successfully");
    }
    setTemplateDialogOpen(false);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast.success("Template deleted");
  };

  const toggleTemplate = (id: string) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  const savePageSettings = () => {
    toast.success("Page settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Advisor Page
          </h1>
          <p className="text-muted-foreground">Manage the AI fragrance advisor chat experience</p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="questions">Suggested Questions ({questions.filter((q) => q.enabled).length})</TabsTrigger>
          <TabsTrigger value="templates">Response Templates ({templates.length})</TabsTrigger>
        </TabsList>

        {/* Page Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Title</label>
                  <Input
                    value={pageSettings.title}
                    onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Recommendations</label>
                  <Input
                    type="number"
                    value={pageSettings.maxRecommendations}
                    onChange={(e) => setPageSettings({ ...pageSettings, maxRecommendations: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  value={pageSettings.subtitle}
                  onChange={(e) => setPageSettings({ ...pageSettings, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Welcome Message</label>
                <Textarea
                  value={pageSettings.welcomeMessage}
                  onChange={(e) => setPageSettings({ ...pageSettings, welcomeMessage: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No Match Message</label>
                <Textarea
                  value={pageSettings.noMatchMessage}
                  onChange={(e) => setPageSettings({ ...pageSettings, noMatchMessage: e.target.value })}
                  rows={2}
                />
              </div>
              <Button onClick={savePageSettings} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggested Questions Tab */}
        <TabsContent value="questions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Suggested Questions</CardTitle>
              <Button onClick={() => openQuestionDialog()} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-24">Enabled</TableHead>
                    <TableHead className="text-right w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.text}</TableCell>
                      <TableCell>
                        <Switch checked={question.enabled} onCheckedChange={() => toggleQuestion(question.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openQuestionDialog(question)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteQuestion(question.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Response Templates</CardTitle>
              <Button onClick={() => openTemplateDialog()} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Trigger Keywords</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead className="w-24">Enabled</TableHead>
                    <TableHead className="text-right w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {template.trigger.split(",").map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{template.response}</TableCell>
                      <TableCell>
                        <Switch checked={template.enabled} onCheckedChange={() => toggleTemplate(template.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openTemplateDialog(template)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteTemplate(template.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Question Dialog */}
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Edit Question" : "Add Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Suggested Question</label>
              <Textarea
                value={questionForm.text}
                onChange={(e) => setQuestionForm({ text: e.target.value })}
                placeholder="e.g., I love woody and musky scents"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveQuestion} className="bg-primary hover:bg-primary/90">
              {editingQuestion ? "Update" : "Add"} Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Add Template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger Keywords (comma separated)</label>
              <Input
                value={templateForm.trigger}
                onChange={(e) => setTemplateForm({ ...templateForm, trigger: e.target.value })}
                placeholder="e.g., office, work, formal"
              />
              <p className="text-xs text-muted-foreground">
                When user message contains any of these keywords, this response will be used.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Response Message</label>
              <Textarea
                value={templateForm.response}
                onChange={(e) => setTemplateForm({ ...templateForm, response: e.target.value })}
                placeholder="The AI will use this response when the trigger keywords are detected..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplate} className="bg-primary hover:bg-primary/90">
              {editingTemplate ? "Update" : "Add"} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AiAdvisorAdmin;
