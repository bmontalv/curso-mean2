import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.services';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';



@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado;
    public albums: Album[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService

    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-detail.component.ts cargado');
        // Sacar album de la BD
        this.getAlbum();
    }

    getAlbum() {
        console.log('getAlbum()');
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response['album']) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response['album'];
/*
                        // sacar los albums del artista
                        this._albumService.getAlbums(this.token, response['artist']['_id']).subscribe(
                            result => {
                                if(!result['albums']) {
                                    this.alertMessage = 'Este artista no tiene albums';
                                } else {
                                    this.albums = result['albums'];
                                }
                            },
                            error => {
                                var errorMessage = <any>error;
            
                                if (errorMessage != null) {
                                    let body = error.error;
                                    //this.alertMessage = body.message;
                                    console.log('Error: ', error);
                                }
                            }
                        )
*/                    }
                    
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = error.error;
                        //this.alertMessage = body.message;
                        console.log('Error: ', error);
                    }
                }
            );
        });
    }

}