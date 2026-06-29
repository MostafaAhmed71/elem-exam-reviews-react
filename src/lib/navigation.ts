import { atom } from 'nanostores';

export type Screen = 'welcome' | 'terms' | 'grade' | 'reviewType' | 'subject' | 'admin' | 'materials';

export const currentScreen = atom<Screen>('welcome');
export const selectedGrade = atom<number | null>(null);
export const selectedReviewType = atom<'schedule' | 'solved' | 'unsolved' | null>(null);
export const termsAccepted = atom<boolean>(false);

export function navigateTo(screen: Screen) {
    currentScreen.set(screen);
}

export function setGrade(grade: number) {
    selectedGrade.set(grade);
    navigateTo('reviewType');
}

export function setReviewType(type: 'schedule' | 'solved' | 'unsolved') {
    selectedReviewType.set(type);
    navigateTo('subject');
}

export function navigateToAdmin() {
    currentScreen.set('admin');
}

export function resetNavigation() {
    currentScreen.set('welcome');
    selectedGrade.set(null);
    selectedReviewType.set(null);
    termsAccepted.set(false);
}

export function navigateBack() {
    const screen = currentScreen.get();
    
    switch (screen) {
        case 'terms':
            navigateTo('welcome');
            break;
        case 'grade':
            navigateTo('terms');
            break;
        case 'reviewType':
            navigateTo('grade');
            break;
        case 'subject':
            navigateTo('reviewType');
            break;
        case 'admin':
            navigateTo('welcome');
            break;
        case 'materials':
            // الرجوع للصفحة السابقة حسب السياق
            // يمكن أن يكون من admin أو من subject
            navigateTo('admin');
            break;
        default:
            // welcome screen - no back navigation
            break;
    }
}

export function canGoBack(): boolean {
    const screen = currentScreen.get();
    return screen !== 'welcome';
}

export function navigateToMaterials() {
    currentScreen.set('materials');
}