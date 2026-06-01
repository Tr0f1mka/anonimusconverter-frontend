import { Injectable } from "@angular/core";
import { BasePatternService } from "./pattern.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { LanguageService } from "./language.service";

@Injectable({
    providedIn: 'root'
})
export class PatternPageService extends BasePatternService {
    public patternsPerPage: number = 18;

    constructor(
        http: HttpClient,
        auth_service: AuthService,
        language_service: LanguageService
    ) {
        super(http, auth_service, language_service);
    }
}