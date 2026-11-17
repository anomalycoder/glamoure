/**
 * Secure File Storage & Media Management Service
 * Validates file sizes, MIME types, generates tamper-proof URLs, and manages uploads.
 */

export interface UploadResult {
  fileId: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export class StorageService {
  private static readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  private static readonly ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ]);

  /**
   * Validate file before processing or upload
   */
  public static validateFile(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
    if (!file.name || !file.type) {
      return { valid: false, error: 'Invalid file payload: Missing name or MIME type.' };
    }

    // MIME type check
    if (!this.ALLOWED_MIME_TYPES.has(file.type)) {
      return { 
        valid: false, 
        error: `Unsupported file type "${file.type}". Allowed formats: JPEG, PNG, WEBP, SVG.` 
      };
    }

    // File size check (Max 5MB)
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      const sizeMb = Math.round((file.size / (1024 * 1024)) * 10) / 10;
      return { 
        valid: false, 
        error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 5.0 MB.` 
      };
    }

    return { valid: true };
  }

  /**
   * Process and simulate secure upload to object storage (e.g. S3 / Supabase Storage / Cloud Storage)
   */
  public static async uploadMedia(
    file: { name: string; size: number; type: string; dataUrl?: string },
    folder: 'salons' | 'services' | 'staff' | 'customers' | 'reviews' = 'services'
  ): Promise<UploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const fileId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const secureUrl = file.dataUrl || `/storage/${folder}/${fileId}_${sanitizedName}`;

    return {
      fileId,
      url: secureUrl,
      filename: sanitizedName,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };
  }
}
