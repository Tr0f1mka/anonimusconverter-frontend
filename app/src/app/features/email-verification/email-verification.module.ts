import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { EmailVerificationComponent } from "./page/email-verification.component";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {
        path: 'email',
        component: EmailVerificationComponent
    }
];

@NgModule({
    declarations: [
        EmailVerificationComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class EmailVerificationModule { }