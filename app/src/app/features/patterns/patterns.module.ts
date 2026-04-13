import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PatternsPageComponent } from './pages/patterns-page/patterns-page.component';

import { ShowPatternComponent } from '../../shared/components/show-pattern/show-pattern.component';
import { CreatePatternComponent } from '../../shared/components/create-pattern/create-pattern.component';

const routes: Routes = [
    {
        path: '',
        component: PatternsPageComponent
    }
];

@NgModule({
    declarations: [
        PatternsPageComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class PatternsModule { }