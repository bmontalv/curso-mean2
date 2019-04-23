import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

// .pipe(map(res => res.json()));
@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    signUp(userToLogin, gethash = null): Observable<any> {
        if (gethash != null) {
            userToLogin.gethash = gethash;
        }
        let params = JSON.stringify(userToLogin);
        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url + 'login', params, {headers: headers})
            .pipe(map(res => res));
    }

    register(userToRegister) {
        let params = JSON.stringify(userToRegister);
        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url + 'register', params, {headers: headers})
            .pipe(map(res => res));
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');

        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
}