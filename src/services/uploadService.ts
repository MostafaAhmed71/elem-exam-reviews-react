import { supabase } from '../lib/supabase';
import type { UploadedMaterial, UploadResponse } from '../types/database.types';

// Configuration - يرجى تحديث هذا الرابط برابط upload.php الخاص بك
const UPLOAD_API_URL = 'https://northelite0.com/upload.php';
const DELETE_API_URL = 'https://northelite0.com/delete.php';

// Allowed file types for documents
const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

// Allowed file types for images
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
];

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Validate file before upload
 */
export function validateFile(file: File, reviewType?: 'schedule' | 'solved' | 'unsolved'): { valid: boolean; error?: string } {
    if (!file) {
        return { valid: false, error: 'الرجاء اختيار ملف' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'حجم الملف كبير جداً (الحد الأقصى 50 ميجابايت)' };
    }

    // For schedule, allow images only
    if (reviewType === 'schedule') {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return { valid: false, error: 'نوع الملف غير مدعوم (الصور فقط: JPG, PNG, GIF, WEBP)' };
        }
    } else {
        // For solved/unsolved, allow documents only
        if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
            return { valid: false, error: 'نوع الملف غير مدعوم (PDF, Word, PowerPoint فقط)' };
        }
    }

    return { valid: true };
}

/**
 * Upload file to Hostinger via upload.php
 */
export async function uploadFileToHostinger(
    file: File,
    grade: number,
    subjectName: string,
    reviewType?: 'schedule' | 'solved' | 'unsolved',
    onProgress?: (progress: number) => void
): Promise<UploadResponse> {
    console.log('🚀 Starting upload:', { fileName: file.name, grade, subject: subjectName, reviewType });

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('grade', grade.toString());
        formData.append('subject', subjectName);
        if (reviewType) {
            formData.append('review_type', reviewType);
        }

        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    console.log('📊 Upload progress:', progress + '%');
                    onProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                console.log('📥 Server response status:', xhr.status);
                console.log('📥 Server response:', xhr.responseText);

                let parsed: UploadResponse & { message?: string; error?: string } | null = null;
                try {
                    parsed = JSON.parse(xhr.responseText);
                } catch {
                    // non-JSON body
                }

                if (xhr.status === 200) {
                    if (parsed) {
                        console.log('✅ Parsed response:', parsed);
                        resolve(parsed);
                    } else {
                        console.error('❌ Failed to parse response');
                        reject({
                            success: false,
                            message: 'فشل',
                            error: 'خطأ في قراءة استجابة السيرفر',
                        });
                    }
                } else {
                    console.error('❌ Upload failed with status:', xhr.status);
                    const serverMsg =
                        parsed?.message || parsed?.error || `خطأ في الرفع: ${xhr.status}`;
                    reject({
                        success: false,
                        message: 'فشل',
                        error: serverMsg,
                    });
                }
            });

            xhr.addEventListener('error', () => {
                console.error('❌ Network error during upload');
                reject({
                    success: false,
                    message: 'فشل',
                    error: 'فشل الاتصال بالسيرفر',
                });
            });

            console.log('📤 Sending request to:', UPLOAD_API_URL);
            xhr.open('POST', UPLOAD_API_URL);
            xhr.send(formData);
        });
    } catch (error) {
        console.error('❌ Exception during upload:', error);
        return {
            success: false,
            message: 'فشل',
            error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        };
    }
}

/**
 * Save file URL to Supabase
 */
export async function saveFileUrlToSupabase(
    material: Omit<UploadedMaterial, 'id' | 'uploaded_at'>
): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
        return { success: false, error: 'Supabase غير متصل' };
    }

    try {
        const { error } = await supabase
            .from('uploaded_materials')
            .insert([
                {
                    grade: material.grade,
                    subject_name: material.subject_name,
                    review_type: material.review_type,
                    file_name: material.file_name,
                    file_url: material.file_url,
                    file_size: material.file_size,
                    uploaded_at: new Date().toISOString(),
                },
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Save to Supabase error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'خطأ في حفظ البيانات',
        };
    }
}

/**
 * Complete upload process: upload file to Hostinger and save URL to Supabase
 */
export async function uploadMaterial(
    file: File,
    grade: number,
    subjectName: string,
    reviewType: 'schedule' | 'solved' | 'unsolved',
    onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string }> {
    // Validate file
    const validation = validateFile(file, reviewType);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    try {
        // Upload to Hostinger
        const uploadResponse = await uploadFileToHostinger(file, grade, subjectName, reviewType, onProgress);

        console.log('📦 Upload response:', uploadResponse);

        if (!uploadResponse.success) {
            return {
                success: false,
                error: uploadResponse.error || 'فشل رفع الملف',
            };
        }

        // Get file URL (server returns 'url' not 'fileUrl')
        const fileUrl = uploadResponse.fileUrl || (uploadResponse as any).url;

        if (!fileUrl) {
            return {
                success: false,
                error: 'لم يتم استلام رابط الملف من السيرفر',
            };
        }

        console.log('💾 Saving to Supabase:', fileUrl);

        // Save URL to Supabase
        const saveResponse = await saveFileUrlToSupabase({
            grade,
            subject_name: subjectName,
            review_type: reviewType,
            file_name: file.name,
            file_url: fileUrl,
            file_size: file.size,
        });

        if (!saveResponse.success) {
            console.warn('⚠️ File uploaded but failed to save to Supabase:', saveResponse.error);
            return {
                success: false,
                error: `تم رفع الملف ولكن فشل حفظ الرابط: ${saveResponse.error}`,
            };
        }

        console.log('✅ Upload complete!');
        return { success: true };
    } catch (error) {
        console.error('❌ Upload material error:', error);
        const fromReject =
            error &&
            typeof error === 'object' &&
            'error' in error &&
            typeof (error as { error?: unknown }).error === 'string'
                ? (error as { error: string }).error
                : null;
        return {
            success: false,
            error: fromReject ?? (error instanceof Error ? error.message : 'حدث خطأ أثناء الرفع'),
        };
    }
}

/**
 * Get recent uploads from Supabase
 */
export async function getRecentUploads(limit = 10): Promise<UploadedMaterial[]> {
    if (!supabase) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('uploaded_materials')
            .select('*')
            .order('uploaded_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching uploads:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching uploads:', error);
        return [];
    }
}

/**
 * Get all materials from Supabase
 */
export async function getAllMaterials(): Promise<UploadedMaterial[]> {
    if (!supabase) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('uploaded_materials')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('Error fetching all materials:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching all materials:', error);
        return [];
    }
}

/**
 * Update material in Supabase
 */
export async function updateMaterial(
    id: number,
    updates: Partial<Omit<UploadedMaterial, 'id' | 'uploaded_at'>>
): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
        return { success: false, error: 'Supabase غير متصل' };
    }

    try {
        const { error } = await supabase
            .from('uploaded_materials')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating material:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating material:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'خطأ في تحديث البيانات',
        };
    }
}

/**
 * Delete file from Hostinger server
 */
export async function deleteFileFromHostinger(fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
        console.log('🗑️ Attempting to delete file:', fileUrl);
        
        const formData = new FormData();
        formData.append('fileUrl', fileUrl);

        const response = await fetch(DELETE_API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Delete request failed:', response.status, errorText);
            return {
                success: false,
                error: `خطأ في حذف الملف: ${response.status}`,
            };
        }

        const result = await response.json();
        console.log('📥 Delete response:', result);
        
        if (!result.success) {
            // Check if the error is because file doesn't exist (which is fine)
            const errorMsg = result.error || result.message || '';
            if (errorMsg.includes('غير موجود') || errorMsg.includes('تم حذفه مسبقاً')) {
                console.log('ℹ️ File already deleted from server (this is fine)');
                return { success: true };
            }
            
            return {
                success: false,
                error: errorMsg || 'فشل حذف الملف من السيرفر',
            };
        }

        console.log('✅ File deleted successfully from Hostinger');
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting file from Hostinger:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'فشل الاتصال بالسيرفر لحذف الملف',
        };
    }
}

/**
 * Delete material from Supabase and Hostinger
 */
export async function deleteMaterial(id: number): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
        return { success: false, error: 'Supabase غير متصل' };
    }

    try {
        // First, get the material to get the file URL
        const { data: material, error: fetchError } = await supabase
            .from('uploaded_materials')
            .select('file_url')
            .eq('id', id)
            .single();

        if (fetchError || !material) {
            console.error('Error fetching material:', fetchError);
            return { success: false, error: 'لم يتم العثور على المادة' };
        }

        // Delete file from Hostinger first
        if (material.file_url) {
            const deleteFileResult = await deleteFileFromHostinger(material.file_url);
            if (!deleteFileResult.success) {
                console.warn('⚠️ Failed to delete file from Hostinger:', deleteFileResult.error);
                // Continue to delete from database even if file deletion fails
                // (file might already be deleted or not exist)
            }
        }

        // Delete from Supabase
        console.log('🗑️ Deleting material from Supabase, ID:', id);
        const { data: deleteData, error } = await supabase
            .from('uploaded_materials')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('❌ Error deleting material from Supabase:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Material deleted from Supabase:', deleteData);
        
        // Check if deletion was successful
        // If deleteData is empty array or null, the material was not found (already deleted)
        // If deleteData has items, the deletion was successful
        if (deleteData && deleteData.length > 0) {
            console.log('✅ Material deletion confirmed - record was deleted');
            return { success: true };
        } else {
            // Material might have been already deleted or doesn't exist
            // This is still considered success since the goal is to ensure it's deleted
            console.log('ℹ️ Material not found (may have been already deleted)');
            return { success: true };
        }
    } catch (error) {
        console.error('Error deleting material:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'خطأ في حذف البيانات',
        };
    }
}