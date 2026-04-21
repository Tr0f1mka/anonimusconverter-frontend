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
                path: 'converter',  // Добавляем явный путь
                loadChildren: () => import('./features/converter/converter.module').then(m => m.ConverterModule)
            },
            {
                path: 'patterns',
                loadChildren: () => import('./features/patterns/patterns.module').then(m => m.PatternsModule)
            },
            {
                path: 'auth',
                loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
            },
            {
                path: '**',
                loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }