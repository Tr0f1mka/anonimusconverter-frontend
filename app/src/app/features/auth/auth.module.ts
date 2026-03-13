import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
const routes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent
    }
];

@NgModule({
    declarations: [
        LoginPageComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AuthModule { }