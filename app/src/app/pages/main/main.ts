import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-main",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./main.html",
    styleUrl: "./main.css"
})

export class MainPage {
    title = "Главная";
    counter = 0;

    increment() {
        this.counter++;
    }
}