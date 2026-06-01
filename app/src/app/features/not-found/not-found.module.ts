import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NotFoundComponent } from './pages/not-found-page/not-found-page.component';


const routes: Routes = [
    {
        path: '',
        component: NotFoundComponent
    }
];

@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class NotFoundModule { }