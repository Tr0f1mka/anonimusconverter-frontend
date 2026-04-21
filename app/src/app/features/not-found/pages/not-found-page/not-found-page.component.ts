import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'not-found-patterns-page',
    templateUrl: 'not-found-page.component.html',
    styleUrl: 'not-found-page.component.css'
})
export class NotFoundComponent implements OnInit {

    constructor(
        private router: Router
    ) {}

    ngOnInit() {}

    ngOnDestroy(): void {}

    gotoMain() {
        this.router.navigate(['/']);
    }
}