export interface Grade {
    id: number;
    name_ar: string;
    order_num: number;
}

export interface ReviewType {
    id: number;
    name_ar: string;
    is_solved: boolean;
}

export interface Subject {
    id: number;
    name_ar: string;
    icon_name?: string;
    grade_id: number;
    review_type_id: number;
    pdf_url: string;
}

export interface UploadedMaterial {
    id?: number;
    grade: number;
    subject_name: string;
    review_type: 'schedule' | 'solved' | 'unsolved';
    file_name: string;
    file_url: string;
    file_size: number;
    uploaded_at?: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    fileUrl?: string;
    error?: string;
}
