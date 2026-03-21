import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ConverterPageComponent } from './pages/converter-page/converter-page.component';
import { DownloadPageComponent } from './pages/download-page/download-page.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

const routes: Routes = [
    {
        path: '',
        component: ConverterPageComponent
    },
    {
        path: 'download',
        component: DownloadPageComponent
    }
];

@NgModule({
    declarations: [
        ConverterPageComponent,
        DownloadPageComponent,
        FileUploadComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: []
})
export class ConverterModule { }