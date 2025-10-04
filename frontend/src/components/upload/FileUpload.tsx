import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  Music,
  FileText,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
  error?: string;
}

interface FileUploadProps {
  onUploadComplete?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
  if (type.startsWith('video/')) return <Video className="w-6 h-6" />;
  if (type.startsWith('audio/')) return <Music className="w-6 h-6" />;
  if (type.includes('pdf') || type.includes('document')) return <FileText className="w-6 h-6" />;
  return <File className="w-6 h-6" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const createPreview = (file: File): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      resolve(undefined);
    }
  });
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 100, // 100MB default
  allowedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  className
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = async (uploadFile: UploadFile) => {
    // Simulate upload progress
    const totalSteps = 100;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, progress: i, status: i === 100 ? 'completed' : 'uploading' }
            : f
        )
      );
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < files.length && newFiles.length < maxFiles; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: 'error',
          error: `File size exceeds ${maxSize}MB limit`
        });
        continue;
      }

      // Check file type
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: 'error',
          error: 'File type not supported'
        });
        continue;
      }

      const preview = await createPreview(file);
      const uploadFile: UploadFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading',
        preview
      };

      newFiles.push(uploadFile);
      
      // Start upload simulation
      setTimeout(() => simulateUpload(uploadFile), 100);
    }

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Call onUploadComplete for successful files
    const successfulFiles = newFiles
      .filter(f => f.status !== 'error')
      .map(f => f.file);
    
    if (successfulFiles.length > 0 && onUploadComplete) {
      onUploadComplete(successfulFiles);
    }
  }, [maxFiles, maxSize, allowedTypes, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Zone */}
      <Card 
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-gold-500 bg-gold-500/10' 
            : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
        }`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-12 text-center">
          <motion.div
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Upload className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragOver ? 'Drop files here' : 'Upload your files'}
            </h3>
            <p className="text-white/70 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <div className="text-sm text-white/50 space-y-1">
              <p>Supported formats: Images, Videos, Audio, Documents</p>
              <p>Maximum file size: {maxSize}MB</p>
              <p>Maximum files: {maxFiles}</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-white">
              Uploading Files ({uploadFiles.length})
            </h4>
            
            {uploadFiles.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {uploadFile.preview ? (
                          <img
                            src={uploadFile.preview}
                            alt={uploadFile.file.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white/60">
                            {getFileIcon(uploadFile.file.type)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-white font-medium text-sm truncate">
                            {uploadFile.file.name}
                          </h5>
                          <div className="flex items-center gap-2">
                            {uploadFile.status === 'uploading' && (
                              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            )}
                            {uploadFile.status === 'completed' && (
                              <Check className="w-4 h-4 text-green-400" />
                            )}
                            {uploadFile.status === 'error' && (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(uploadFile.id);
                              }}
                              className="text-white/50 hover:text-white transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                          <span>{formatFileSize(uploadFile.file.size)}</span>
                          <Badge 
                            className={
                              uploadFile.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : uploadFile.status === 'error'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }
                            size="sm"
                          >
                            {uploadFile.status === 'uploading' && `${uploadFile.progress}%`}
                            {uploadFile.status === 'completed' && 'Complete'}
                            {uploadFile.status === 'error' && 'Error'}
                          </Badge>
                        </div>

                        {uploadFile.status === 'uploading' && (
                          <Progress value={uploadFile.progress} className="h-2" />
                        )}

                        {uploadFile.error && (
                          <p className="text-red-400 text-xs mt-1">{uploadFile.error}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};