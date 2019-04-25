import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.services';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';


@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prePage;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.nextPage = 1;
        this.prePage = 1;
    }

    ngOnInit() {
        console.log('artist-list.component.ts cargado');
        
        // this._route.params.forEach((params: Params) => {
        //     let page = +params['page'];
        //     if (!page) {
        //         page = 1;
        //     } else {
        //         this.nextPage = page + 1;
        //         this.prePage = page - 1;
        //     }

        //     if (this.prePage == 0) {
        //         this.prePage = 1;
        //     }
        // });
        // Conseguir listado de artistas
        this.getArtists();
    }

    getArtists() {
        this._route.params.subscribe((params: Params) => {
            console.log('**',params);
            let page = +params['page'];
            if (!page) {
                page = 1;
            } else {
                this.nextPage = page + 1;
                this.prePage = page - 1;
            }

            if (this.prePage == 0) {
                this.prePage = 1;
            }

            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    console.log(response)
                   if (!response['artists']) {
                    this._router.navigate(['/']);
                   } else {
                       this.artists = response['artists'];
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
        });
    }

    onDeleteConfirm(id) {
        console.log('AQUI', id)
        this.confirmado = id;
    }

    onCancelArtist() {
        this.confirmado = null;
    }

    onDeleteArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                if (!response['artist']) {
                    alert('Error en el servidor');
                } else {
                    this.getArtists();
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
        );
    }

}