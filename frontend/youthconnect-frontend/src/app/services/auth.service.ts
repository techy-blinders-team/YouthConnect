import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly TOKEN_KEY = 'auth_token';
    private readonly ROLE_KEY = 'auth_role';
    private readonly NAME_KEY = 'auth_name';
}