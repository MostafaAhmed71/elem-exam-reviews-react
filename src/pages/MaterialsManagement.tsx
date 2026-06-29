import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { getAllMaterials, updateMaterial, deleteMaterial } from '@/services/uploadService';
import type { UploadedMaterial } from '@/types/database.types';
import './MaterialsManagement.css';

export function MaterialsManagement() {
    const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMaterial, setEditingMaterial] = useState<UploadedMaterial | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        setLoading(true);
        const data = await getAllMaterials();
        setMaterials(data);
        setLoading(false);
    };

    const handleEdit = (material: UploadedMaterial) => {
        setEditingMaterial({ ...material });
        setShowEditModal(true);
        setMessage(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
            return;
        }

        setMessage(null);
        const result = await deleteMaterial(id);
        if (result.success) {
            setMessage({ type: 'success', text: 'تم حذف المادة بنجاح' });
            // Wait a bit to ensure database is updated, then reload
            setTimeout(() => {
                loadMaterials();
            }, 500);
        } else {
            setMessage({ type: 'error', text: result.error || 'فشل حذف المادة' });
        }
    };

    const handleSaveEdit = async () => {
        if (!editingMaterial || !editingMaterial.id) return;

        const result = await updateMaterial(editingMaterial.id, {
            grade: editingMaterial.grade,
            subject_name: editingMaterial.subject_name,
            review_type: editingMaterial.review_type,
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'تم تحديث المادة بنجاح' });
            setShowEditModal(false);
            setEditingMaterial(null);
            loadMaterials();
        } else {
            setMessage({ type: 'error', text: result.error || 'فشل تحديث المادة' });
        }
    };

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

    if (loading) {
        return (
            <Layout showFooter>
                <div className="materials-management">
                    <BackButton />
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h1 className="materials-title">جاري التحميل...</h1>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showFooter>
            <div className="materials-management">
                <BackButton />
                <h1 className="materials-title">إدارة المواد المرفوعة</h1>
                <p className="materials-subtitle">عرض وتعديل وحذف المواد الدراسية</p>

                {message && (
                    <div className={`materials-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {materials.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-text">لا توجد مواد مرفوعة</p>
                    </div>
                ) : (
                    <div className="materials-list">
                        {materials.map((material) => (
                            <div key={material.id} className="material-item">
                                <div className="material-info">
                                    <div className="material-details">
                                        <h3 className="material-subject">{material.subject_name}</h3>
                                        <p className="material-meta">
                                            {getGradeName(material.grade)} • {material.review_type === 'schedule' ? 'جدول الاختبارات' : material.review_type === 'solved' ? 'محلولة' : 'غير محلولة'}
                                        </p>
                                        <p className="material-file">
                                            {material.file_name} • {formatFileSize(material.file_size)}
                                        </p>
                                        {material.uploaded_at && (
                                            <p className="material-date">{formatDate(material.uploaded_at)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="material-actions">
                                    <Button
                                        variant="primary"
                                        onClick={() => window.open(material.file_url, '_blank')}
                                        className="material-view-btn"
                                    >
                                        عرض
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleEdit(material)}
                                        className="material-edit-btn"
                                    >
                                        تعديل
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => material.id && handleDelete(material.id)}
                                        className="material-delete-btn"
                                    >
                                        حذف
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && editingMaterial && (
                    <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                            <h2 className="edit-modal-title">تعديل المادة</h2>
                            
                            <div className="edit-form">
                                <div className="form-group">
                                    <label className="form-label">الصف</label>
                                    <select
                                        className="form-select"
                                        value={editingMaterial.grade}
                                        onChange={(e) => setEditingMaterial({
                                            ...editingMaterial,
                                            grade: parseInt(e.target.value)
                                        })}
                                    >
                                        {grades.map((grade) => (
                                            <option key={grade.id} value={grade.id}>
                                                {grade.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">المادة</label>
                                    <select
                                        className="form-select"
                                        value={editingMaterial.subject_name}
                                        onChange={(e) => setEditingMaterial({
                                            ...editingMaterial,
                                            subject_name: e.target.value
                                        })}
                                    >
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">نوع المراجعة</label>
                                    <select
                                        className="form-select"
                                        value={editingMaterial.review_type}
                                        onChange={(e) => setEditingMaterial({
                                            ...editingMaterial,
                                            review_type: e.target.value as 'solved' | 'unsolved'
                                        })}
                                    >
                                        <option value="solved">محلولة</option>
                                        <option value="unsolved">غير محلولة</option>
                                    </select>
                                </div>
                            </div>

                            <div className="edit-modal-actions">
                                <Button
                                    variant="primary"
                                    onClick={handleSaveEdit}
                                    fullWidth
                                >
                                    حفظ التغييرات
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingMaterial(null);
                                    }}
                                    fullWidth
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

