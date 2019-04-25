import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.services';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,

    ){
        this.titulo = 'Añadir album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', '', '');
    }

    ngOnInit() {
        console.log('album-add.component.ts cargado');
    }

    onSubmit() {
        
        this._route.params.forEach((params: Params) => {
            console.log(params)
            let artistId = params['artista'];
            this.album.artist = artistId;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    if (!response['album']) {
                        this.alertMessage = 'error en eñ servidor';
                    } else {
                        this.artist = response['album'];
                        this.alertMessage = 'Album creado correctamente';

                        this._router.navigate(['/editar-album', response['album']['_id']]);

                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = error.error;
                        this.alertMessage = body.message;
                        console.log('Error: ', error);
                    }
                }
            );
            console.log(this.album);
        });
        
    }

}