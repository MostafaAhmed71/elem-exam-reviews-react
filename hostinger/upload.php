<?php
/**
 * File Upload Handler for Educational Materials
 * This script receives files from the admin interface and saves them to Hostinger
 * 
 * Expected POST parameters:
 * - file: The uploaded file
 * - grade: Grade level (1-6)
 * - subject: Subject name in Arabic
 * 
 * Returns JSON response:
 * {
 *   "success": true/false,
 *   "message": "Success or error message",
 *   "fileUrl": "URL of uploaded file" (on success)
 * }
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Allow CORS (adjust domain as needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
define('UPLOAD_DIR', __DIR__ . '/uploads/materials/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_DOCUMENT_EXTENSIONS', ['pdf', 'doc', 'docx', 'ppt', 'pptx']);
define('ALLOWED_IMAGE_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('BASE_URL', 'https://northelite0.com/uploads/materials/');

/**
 * Send JSON response and exit
 */
function sendResponse($success, $message, $fileUrl = null, $httpCode = null) {
    $code = $httpCode ?? ($success ? 200 : 400);
    http_response_code($code);

    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($fileUrl) {
        $response['fileUrl'] = $fileUrl;
    } else if (!$success) {
        $response['error'] = $message;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Normalize a single-file entry from $_FILES (works for any input name, e.g. file, image, document).
 *
 * @return array{name:string,type:string,tmp_name:string,error:int,size:int}|null
 */
function resolveUploadedFileEntry() {
    if (empty($_FILES)) {
        return null;
    }

    // Prefer the documented field name
    $candidates = ['file'];
    foreach (array_keys($_FILES) as $key) {
        if ($key !== 'file') {
            $candidates[] = $key;
        }
    }

    $firstBlockingError = null;

    foreach ($candidates as $field) {
        if (!isset($_FILES[$field]) || !is_array($_FILES[$field])) {
            continue;
        }
        $file = $_FILES[$field];

        // Skip HTML5 multiple-array shape (not used by this app)
        if (isset($file['error']) && is_array($file['error'])) {
            continue;
        }

        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            continue;
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $firstBlockingError = $file;
            continue;
        }

        if (!empty($file['tmp_name']) && is_uploaded_file($file['tmp_name'])) {
            return $file;
        }
    }

    if ($firstBlockingError !== null) {
        return $firstBlockingError;
    }

    return null;
}

/**
 * Sanitize filename
 */
function sanitizeFilename($filename) {
    // Get file extension
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
    // Get filename without extension
    $name = pathinfo($filename, PATHINFO_FILENAME);
    
    // Remove special characters and replace spaces with underscores
    $name = preg_replace('/[^a-zA-Z0-9\-_\u0600-\u06FF]/', '_', $name);
    
    // Add timestamp to make filename unique
    $timestamp = time();
    
    return $name . '_' . $timestamp . '.' . $ext;
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'طريقة الطلب غير صحيحة');
}

$file = resolveUploadedFileEntry();

if ($file === null) {
    sendResponse(false, 'لم يتم اختيار ملف أو لم يصل الملف إلى السيرفر (تحقق من حقل الرفع وحدود PHP مثل post_max_size وupload_max_filesize)');
}

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'الملف كبير جداً',
        UPLOAD_ERR_FORM_SIZE => 'الملف كبير جداً',
        UPLOAD_ERR_PARTIAL => 'تم رفع جزء من الملف فقط',
        UPLOAD_ERR_NO_FILE => 'لم يتم اختيار ملف',
        UPLOAD_ERR_NO_TMP_DIR => 'مجلد مؤقت مفقود',
        UPLOAD_ERR_CANT_WRITE => 'فشل كتابة الملف',
        UPLOAD_ERR_EXTENSION => 'امتداد PHP أوقف رفع الملف'
    ];
    
    $message = $errorMessages[$file['error']] ?? 'خطأ غير معروف في رفع الملف';
    sendResponse(false, $message);
}

// Validate grade
if (!isset($_POST['grade']) || !is_numeric($_POST['grade'])) {
    sendResponse(false, 'الصف غير صحيح');
}

$grade = intval($_POST['grade']);
if ($grade < 1 || $grade > 6) {
    sendResponse(false, 'الصف يجب أن يكون بين 1 و 6');
}

// Validate subject
if (!isset($_POST['subject']) || empty(trim($_POST['subject']))) {
    sendResponse(false, 'اسم المادة مطلوب');
}

$subject = trim($_POST['subject']);

// Get review type (optional, defaults to 'solved' for backward compatibility)
$reviewType = isset($_POST['review_type']) ? trim($_POST['review_type']) : 'solved';

// Validate file size
if ($file['size'] > MAX_FILE_SIZE) {
    sendResponse(false, 'حجم الملف كبير جداً (الحد الأقصى 50 ميجابايت)');
}

// Validate file extension based on review type
$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if ($reviewType === 'schedule') {
    // For schedule, only allow images
    if (!in_array($fileExtension, ALLOWED_IMAGE_EXTENSIONS)) {
        sendResponse(false, 'نوع الملف غير مدعوم (الصور فقط: JPG, PNG, GIF, WEBP)');
    }
} else {
    // For solved/unsolved, only allow documents
    if (!in_array($fileExtension, ALLOWED_DOCUMENT_EXTENSIONS)) {
        sendResponse(false, 'نوع الملف غير مدعوم (PDF, Word, PowerPoint فقط)');
    }
}

// Create upload directory if it doesn't exist
if (!file_exists(UPLOAD_DIR)) {
    if (!mkdir(UPLOAD_DIR, 0755, true)) {
        sendResponse(false, 'فشل إنشاء مجلد الرفع');
    }
}

// Create grade subdirectory
$gradeDir = UPLOAD_DIR . 'grade_' . $grade . '/';
if (!file_exists($gradeDir)) {
    if (!mkdir($gradeDir, 0755, true)) {
        sendResponse(false, 'فشل إنشاء مجلد الصف');
    }
}

// Sanitize and generate unique filename
$safeFilename = sanitizeFilename($file['name']);
$targetPath = $gradeDir . $safeFilename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    sendResponse(false, 'فشل حفظ الملف');
}

// Set file permissions
chmod($targetPath, 0644);

// Generate file URL
$fileUrl = BASE_URL . 'grade_' . $grade . '/' . $safeFilename;

// Log upload (optional)
$logEntry = sprintf(
    "[%s] Grade: %d, Subject: %s, File: %s, Size: %d bytes\n",
    date('Y-m-d H:i:s'),
    $grade,
    $subject,
    $safeFilename,
    $file['size']
);
file_put_contents(__DIR__ . '/upload_log.txt', $logEntry, FILE_APPEND);

// Send success response
sendResponse(true, 'تم رفع الملف بنجاح', $fileUrl);
?>
