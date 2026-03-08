import { Routes } from "@angular/router";
import { MainPage } from "./pages/main/main";
import { DownloadPage } from "./pages/download/download";
import { TemplatePage } from "./pages/template/template";

export const routes: Routes = [
    {
        path: "",
        component: MainPage,
        title: "Главная страница"
    },

    {
        path: "template",
        component: TemplatePage,
        title: "Выбор шаблонов"
    },

    {
        path: "download",
        component: DownloadPage,
        title: "Скачать файл"
    },

    {
        path: "**",
        redirectTo: "",
        pathMatch: "full"
    }
]