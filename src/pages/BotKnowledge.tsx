import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Database, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { botKnowledgeAPI } from '@/lib/bot-knowledge';
import * as XLSX from 'xlsx';

const BotKnowledge = () => {
  const [textContent, setTextContent] = useState('');
  const [uploadedContent, setUploadedContent] = useState('');
  const [existingKnowledge, setExistingKnowledge] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState('paste');

  const fetchKnowledge = useCallback(async () => {
    try {
      const knowledge = await botKnowledgeAPI.getKnowledge();
      setExistingKnowledge(knowledge || '');
    } catch (error: any) {
      if (!error.message.includes('404')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  const handleTextSubmit = async () => {
    if (!textContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some text content"
      });
      return;
    }

    setIsLoading(true);
    try {
      await botKnowledgeAPI.createKnowledge({
        sourceType: 'MANUAL_INPUT',
        content: textContent
      });
      toast({
        title: "Success",
        description: "Text knowledge uploaded successfully"
      });
      setTextContent('');
      await fetchKnowledge();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(txt|xlsx)$/i)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a .txt or .xlsx file"
      });
      return;
    }

    setIsLoading(true);
    try {
      let content = '';
      
      if (file.name.endsWith('.txt')) {
        content = await file.text();
      } else if (file.name.endsWith('.xlsx')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        content = XLSX.utils.sheet_to_csv(worksheet);
      }

      setUploadedContent(content);
      
      await botKnowledgeAPI.createKnowledge({
        sourceType: 'FILE',
        content
      });
      
      toast({
        title: "Success",
        description: "File uploaded and processed successfully"
      });
      
      await fetchKnowledge();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(existingKnowledge);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      await botKnowledgeAPI.updateKnowledge(editContent);
      toast({
        title: "Success",
        description: "Knowledge updated successfully"
      });
      setIsEditing(false);
      await fetchKnowledge();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete all bot knowledge? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await botKnowledgeAPI.deleteKnowledge();
      toast({
        title: "Success",
        description: "Knowledge deleted successfully"
      });
      setExistingKnowledge('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="btn-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Bot Knowledge Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload and manage the knowledge base for your AI bot
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Uploaded Knowledge
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">Paste Your Content</h3>
                <p className="text-muted-foreground mb-6">
                  Enter or paste the text content you want your bot to learn from
                </p>
                
                <Textarea
                  placeholder="Paste your content here... (e.g., FAQ, product descriptions, company information)"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[300px] glow-border resize-none"
                />
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleTextSubmit}
                    disabled={isLoading || !textContent.trim()}
                    className="glow-effect"
                  >
                    {isLoading ? 'Uploading...' : 'Upload Knowledge'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">Upload File</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a .txt or .xlsx file containing your bot's knowledge base
                </p>
                
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer hover:border-primary/50 ${
                    isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-medium mb-2">
                    {isDragOver ? 'Drop your file here' : 'Choose file or drag and drop'}
                  </h4>
                  <p className="text-muted-foreground">
                    Supports .txt and .xlsx files (max 10MB)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".txt,.xlsx"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {uploadedContent && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-3">File Preview:</h4>
                    <div className="bg-secondary/10 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {uploadedContent.slice(0, 1000)}
                        {uploadedContent.length > 1000 && '...'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Knowledge Base Management</h3>
                    <p className="text-muted-foreground">
                      View, edit, and manage your bot's knowledge base
                    </p>
                  </div>
                  {existingKnowledge && !isEditing && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                {existingKnowledge ? (
                  <div>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Database className="w-5 h-5 text-primary" />
                          <h4 className="text-lg font-medium">Editing Knowledge Content</h4>
                        </div>
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[300px] glow-border"
                          placeholder="Update your bot's knowledge content..."
                        />
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveEdit}
                            disabled={isLoading || !editContent.trim()}
                            className="glow-effect"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Updating...' : 'Update Knowledge'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Database className="w-5 h-5 text-primary" />
                          <h4 className="text-lg font-medium">Current Knowledge Content</h4>
                          <span className="text-sm text-muted-foreground">
                            ({existingKnowledge.length} characters)
                          </span>
                        </div>
                        <div className="bg-secondary/10 rounded-lg p-4 max-h-96 overflow-y-auto border">
                          <pre className="text-sm whitespace-pre-wrap leading-relaxed">
                            {existingKnowledge}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">No Knowledge Base Found</h4>
                    <p className="text-muted-foreground mb-6">
                      Create your first knowledge entry using the tabs above to get started
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('paste')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Add Text Content
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('upload')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BotKnowledge;