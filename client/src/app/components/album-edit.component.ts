import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.services';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService]
})

export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public isEdit;
    public filesToUpload: Array<File>

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _albumService: AlbumService,

    ){
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', '', '');
        this.isEdit = true;
    }

    ngOnInit() {
        console.log('album-edit.component.ts cargado');

        // Conseguir el album
        this.getAlbum()
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response['album']) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response['album'];
                    }
                }, 
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = error.error;
                        console.log('Error: ', error);
                    }
                }
            )
         });
    }

    onSubmit() {
        
        this._route.params.forEach((params: Params) => {
            console.log(params)
            let id = params['id'];

            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    if (!response['album']) {
                        this.alertMessage = 'error en el servidor';
                    } else {
                        this.alertMessage = 'Album actualizado correctamente';
                        if (!this.filesToUpload) {
                            //Redirigir
                            console.log(response['album']['artist']['_id'])
                        } else {
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artista', response['album']['artist']]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                        }
                        // Subir el fichero de imagen
                        this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                (result) => {
                                    this._router.navigate(['/artista', this.album.artist]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
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

    
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}