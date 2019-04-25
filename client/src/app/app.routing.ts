import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user components
import { UserEditComponent } from './components/user-edit.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

import { SongAddComponent } from './components/song-add.component';


const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artistas/:page', component: ArtistListComponent},
    {path: 'crear-artista', component: ArtistAddComponent},
    {path: 'crear-album/:artista', component: AlbumAddComponent},
    {path: 'crear-cancion/:album', component: SongAddComponent},

    {path: 'editar-artista/:id', component: ArtistEditComponent},
    {path: 'editar-album/:id', component: AlbumEditComponent},

    {path: 'album/:id', component: AlbumDetailComponent},
    {path: 'artista/:id', component: ArtistDetailComponent},

    {path: 'mis-datos', component: UserEditComponent},
    {path: '**', component: HomeComponent}, //incorrect path
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);