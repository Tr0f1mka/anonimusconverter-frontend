import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TemplatesPageComponent } from './pages/templates-page/templates-page.component';

const routes: Routes = [
    {
        path: '',
        component: TemplatesPageComponent
    }
];

@NgModule({
    declarations: [
        TemplatesPageComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class TemplatesModule { }