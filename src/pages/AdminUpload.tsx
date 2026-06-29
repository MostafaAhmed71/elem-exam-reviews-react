import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { navigateTo, navigateToMaterials } from '../lib/navigation';
import { uploadMaterial, getRecentUploads } from '../services/uploadService';
import type { UploadedMaterial } from '../types/database.types';
import './AdminUpload.css';

export function AdminUpload() {
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [selectedReviewType, setSelectedReviewType] = useState<'schedule' | 'solved' | 'unsolved' | null>(null);
    const [subjectName, setSubjectName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [recentUploads, setRecentUploads] = useState<UploadedMaterial[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const grades = [
        { id: 1, name: 'الصف الأول' },
        { id: 2, name: 'الصف الثاني' },
        { id: 3, name: 'الصف الثالث' },
        { id: 4, name: 'الصف الرابع' },
        { id: 5, name: 'الصف الخامس' },
        { id: 6, name: 'الصف السادس' },
    ];

    const getGradeName = (gradeId: number): string => {
        const grade = grades.find(g => g.id === gradeId);
        return grade ? grade.name : `الصف ${gradeId}`;
    };

    const subjects = [
        'إسلاميات',
        'الدراسات الاجتماعية',
        'الرياضيات',
        'العلوم',
        'اللغة الإنجليزية',
        'اللغة العربية',
        'المهارات الحياتية',
        'المهارات الرقمية',
        'تنمية المهارات',
        'توحيد',
        'فقة',
        'قرآن'
    ];

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setMessage(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedGrade || !selectedReviewType || !selectedFile) {
            setMessage({ type: 'error', text: 'الرجاء إكمال جميع الحقول' });
            return;
        }
        
        // For schedule, subject_name is automatically set. For others, it must be provided.
        if (selectedReviewType !== 'schedule' && !subjectName.trim()) {
            setMessage({ type: 'error', text: 'الرجاء اختيار المادة' });
            return;
        }
        
        const finalSubjectName = selectedReviewType === 'schedule' ? 'جدول الاختبارات' : subjectName.trim();

        setUploading(true);
        setUploadProgress(0);
        setMessage(null);

        const result = await uploadMaterial(
            selectedFile,
            selectedGrade,
            finalSubjectName,
            selectedReviewType,
            (progress) => setUploadProgress(progress)
        );

        setUploading(false);

        if (result.success) {
            setMessage({ type: 'success', text: 'تم رفع الملف بنجاح!' });
            // Reset form
            setSelectedGrade(null);
            setSelectedReviewType(null);
            setSubjectName('');
            setSelectedFile(null);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Refresh recent uploads
            loadRecentUploads();
        } else {
            setMessage({ type: 'error', text: result.error || 'فشل رفع الملف' });
        }
    };

    const loadRecentUploads = async () => {
        const uploads = await getRecentUploads(5);
        setRecentUploads(uploads);
    };

    // Load recent uploads on mount
    useEffect(() => {
        loadRecentUploads();
    }, []);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Layout showFooter={false}>
            <div className="admin-upload">
                <div className="admin-header">
                    <div className="admin-title-container">
                        <h1 className="admin-title">رفع المواد الدراسية</h1>
                        <p className="admin-subtitle">لوحة تحكم المدير</p>
                    </div>
                    <div className="admin-header-actions">
                        <Button
                            variant="primary"
                            onClick={() => navigateToMaterials()}
                            className="admin-materials-button"
                        >
                            إدارة المواد
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                window.location.hash = '';
                                navigateTo('welcome');
                            }}
                            className="admin-exit-button"
                        >
                            العودة للصفحة الرئيسية
                        </Button>
                    </div>
                </div>

                <div className="upload-form">
                    {/* Grade Selection */}
                    <div className="form-section">
                        <label className="form-label">اختر الصف</label>
                        <div className="grade-grid">
                            {grades.map((grade) => (
                                <button
                                    key={grade.id}
                                    className={`grade-btn ${selectedGrade === grade.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedGrade(grade.id)}
                                    disabled={uploading}
                                >
                                    {grade.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Type Selection */}
                    <div className="form-section">
                        <label className="form-label">نوع المراجعة</label>
                        <div className="review-type-grid">
                            <button
                                className={`review-type-btn ${selectedReviewType === 'schedule' ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedReviewType('schedule');
                                    setSubjectName('جدول الاختبارات');
                                }}
                                disabled={uploading}
                            >
                                <span className="review-icon">📅</span>
                                <span>جدول الاختبارات</span>
                            </button>
                            <button
                                className={`review-type-btn ${selectedReviewType === 'solved' ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedReviewType('solved');
                                    setSubjectName('');
                                }}
                                disabled={uploading}
                            >
                                <span className="review-icon">✅</span>
                                <span>محلولة</span>
                            </button>
                            <button
                                className={`review-type-btn ${selectedReviewType === 'unsolved' ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedReviewType('unsolved');
                                    setSubjectName('');
                                }}
                                disabled={uploading}
                            >
                                <span className="review-icon">📝</span>
                                <span>غير محلولة</span>
                            </button>
                        </div>
                    </div>

                    {/* Subject Name */}
                    {selectedReviewType !== 'schedule' && (
                    <div className="form-section">
                        <label className="form-label" htmlFor="subject-select">
                            اسم المادة
                        </label>
                        <select
                            id="subject-select"
                            className="subject-select"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            disabled={uploading}
                        >
                            <option value="">اختر المادة</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>
                    )}

                    {/* File Upload */}
                    <div className="form-section">
                        <label className="form-label">الملف</label>
                        <div
                            className={`file-drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="file-input-hidden"
                                accept={selectedReviewType === 'schedule' ? "image/*" : ".pdf,.doc,.docx,.ppt,.pptx"}
                                onChange={handleFileInputChange}
                                disabled={uploading}
                            />
                            {selectedFile ? (
                                <div className="file-preview">
                                    {selectedReviewType === 'schedule' && selectedFile.type.startsWith('image/') ? (
                                        <div className="image-preview">
                                            <img 
                                                src={URL.createObjectURL(selectedFile)} 
                                                alt="Preview" 
                                                className="preview-image"
                                            />
                                            <div className="file-info">
                                                <p className="file-name">{selectedFile.name}</p>
                                                <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="file-info">
                                            <p className="file-name">{selectedFile.name}</p>
                                            <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="file-placeholder">
                                    <p className="upload-text">اسحب الملف هنا أو انقر للاختيار</p>
                                    <p className="upload-hint">
                                        {selectedReviewType === 'schedule' 
                                            ? 'صورة (JPG, PNG, GIF, WEBP - حتى 50 ميجابايت)' 
                                            : 'PDF, Word, PowerPoint (حتى 50 ميجابايت)'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="progress-section">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <p className="progress-text">{uploadProgress}%</p>
                        </div>
                    )}

                    {/* Message */}
                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={uploading || !selectedGrade || !selectedReviewType || !selectedFile || (selectedReviewType !== 'schedule' && !subjectName.trim())}
                        className="upload-btn"
                    >
                        {uploading ? 'جاري الرفع...' : 'رفع الملف'}
                    </Button>
                </div>

                {/* Recent Uploads */}
                {recentUploads.length > 0 && (
                    <div className="recent-uploads">
                        <h2 className="section-title">آخر الملفات المرفوعة</h2>
                        <div className="uploads-list">
                            {recentUploads.map((upload) => (
                                <div key={upload.id} className="upload-item">
                                    <div className="upload-item-info">
                                        <p className="upload-item-subject">{upload.subject_name}</p>
                                        <p className="upload-item-details">
                                            {getGradeName(upload.grade)} • {formatFileSize(upload.file_size)}
                                        </p>
                                        {upload.uploaded_at && (
                                            <p className="upload-item-date">{formatDate(upload.uploaded_at)}</p>
                                        )}
                                    </div>
                                    <a
                                        href={upload.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="upload-item-link"
                                    >
                                        عرض
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
