import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService{
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getArtists(token, page) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'artists/' + page, {headers: headers})
            .pipe(map(res => res));
    }

    getArtist(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'artist/' + id, {headers: headers})
            .pipe(map(res => res));
    }

    addArtist(token, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'artist', params, {headers: headers})
            .pipe(map(res => res));
    }

    editArtist(token, id: string, artist: Artist) {
        let params = JSON.stringify(artist);
        console.log('**', params);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'artist/' + id, params, {headers: headers})
            .pipe(map(res => res));
    }

    deleteArtist(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url + 'artist/' + id, {headers: headers})
            .pipe(map(res => res));
    }
}