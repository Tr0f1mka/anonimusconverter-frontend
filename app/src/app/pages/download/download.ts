import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download.html',
  styleUrls: ['./download.css']
})
export class DownloadPage {
  downloadUrl = 'https://example.com/file.zip';
  
  startDownload() {
    console.log('Скачивание началось');
  }
}