import { supabase } from '@/lib/supabase';
import type { UploadedMaterial } from '@/types/database.types';

/**
 * Get uploaded materials by grade and review type
 */
export async function getMaterialsByGradeAndType(
    grade: number,
    reviewType: 'schedule' | 'solved' | 'unsolved'
): Promise<UploadedMaterial[]> {
    try {
        // Return empty array if Supabase is not configured
        if (!supabase) {
            console.warn('Supabase not configured. Using mock data.');
            return [];
        }

        const { data, error } = await supabase
            .from('uploaded_materials')
            .select('*')
            .eq('grade', grade)
            .eq('review_type', reviewType)
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('Error fetching materials:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching materials:', error);
        return [];
    }
}

/**
 * Download PDF file
 */
export function downloadPDF(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
