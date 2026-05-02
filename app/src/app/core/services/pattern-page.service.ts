import { Injectable } from "@angular/core";
import { BasePatternService } from "./pattern.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class PatternPageService extends BasePatternService {
    public patternsPerPage: number = 18;

    constructor(
        http: HttpClient,
        auth_service: AuthService
    ) {
        super(http, auth_service);
    }
}

@Injectable({
    providedIn: 'root'
})
export class PatternSelectorService extends BasePatternService {
    public patternsPerPage: number = 5;

    constructor(
        http: HttpClient,
        auth_service: AuthService
    ) {
        super(http, auth_service);
    }
}