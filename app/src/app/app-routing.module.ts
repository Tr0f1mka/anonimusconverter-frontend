import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./features/converter/converter.module').then(m => m.ConverterModule)
            },
            {
                path: 'templates',
                loadChildren: () => import('./features/templates/templates.module').then(m => m.TemplatesModule)
            },
            {
                path: 'auth',
                loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }