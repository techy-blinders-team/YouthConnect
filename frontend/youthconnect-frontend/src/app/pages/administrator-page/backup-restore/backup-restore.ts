import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-backup-restore',
  imports: [],
  templateUrl: './backup-restore.html',
  styleUrl: './backup-restore.scss',
})
export class BackupRestore {
  private http = inject(HttpClient);

  @ViewChild('restoreFileInput') restoreFileInput?: ElementRef<HTMLInputElement>;

  showRestoreModal = false;
  isBackingUp = false;
  isRestoring = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  downloadBackup(): void {
    if (this.isBackingUp || this.isRestoring) {
      return;
    }

    this.isBackingUp = true;
    this.clearMessages();

    this.http
      .get('/api/administrator/backup', { observe: 'response', responseType: 'blob' })
      .subscribe({
        next: (response) => {
          const filename = this.extractFilename(response) || 'youthconnect_backup.sql';
          this.triggerDownload(response.body, filename);
          this.successMessage = 'Backup downloaded successfully.';
          this.isBackingUp = false;
        },
        error: (error: HttpErrorResponse) => {
          this.extractErrorMessage(error, 'Unable to download backup right now.')
            .then((message) => {
              this.errorMessage = message;
              this.isBackingUp = false;
            });
        }
      });
  }

  openRestoreModal(): void {
    if (this.isBackingUp || this.isRestoring) {
      return;
    }

    this.clearMessages();
    this.showRestoreModal = true;
  }

  cancelRestoreModal(): void {
    if (this.isRestoring) {
      return;
    }

    this.showRestoreModal = false;
  }

  confirmRestore(): void {
    if (this.isRestoring) {
      return;
    }

    this.showRestoreModal = false;
    this.restoreFileInput?.nativeElement.click();
  }

  onRestoreFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0];

    if (!selectedFile) {
      return;
    }

    this.isRestoring = true;
    this.clearMessages();

    const formData = new FormData();
    formData.append('file', selectedFile);

    this.http.post('/api/administrator/backup/restore', formData, { responseType: 'text' }).subscribe({
      next: (message) => {
        this.successMessage = message || 'Database restored successfully.';
        this.isRestoring = false;
        input.value = '';
      },
      error: (error: HttpErrorResponse) => {
        this.extractErrorMessage(error, 'Unable to restore database right now.')
          .then((message) => {
            this.errorMessage = message;
            this.isRestoring = false;
            input.value = '';
          });
      }
    });
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  private triggerDownload(blob: Blob | null, filename: string): void {
    if (!blob) {
      throw new Error('Backup response is empty.');
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }

  private extractFilename(response: HttpResponse<Blob>): string | null {
    const disposition = response.headers.get('content-disposition');
    if (!disposition) {
      return null;
    }

    const utf8FilenameMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8FilenameMatch?.[1]) {
      return decodeURIComponent(utf8FilenameMatch[1]);
    }

    const simpleFilenameMatch = disposition.match(/filename=\"?([^\";]+)\"?/i);
    if (simpleFilenameMatch?.[1]) {
      return simpleFilenameMatch[1];
    }

    return null;
  }

  private async extractErrorMessage(error: HttpErrorResponse, fallback: string): Promise<string> {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody instanceof Blob) {
      try {
        const blobText = await responseBody.text();
        if (blobText.trim() !== '') {
          return blobText;
        }
      } catch {
        return fallback;
      }
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return fallback;
  }

}
