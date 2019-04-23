import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { User } from './models/user';
import { UserService } from './services/user.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'Music WebApp';

  public user: User;
  public userRegister: User;
  public identity; //Loged user data
  public token;
  public errorMessage;
  public alertRegister;

  constructor(
    private _userService: UserService
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', ''); //Init the user
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', ''); //Aux user

  }

  ngOnInit() {
   this.identity = this._userService.getIdentity();
   this.token = this._userService.getToken();
  }

  public onSubmit() {
    console.log(this.user);

    // Obtener datos del ususario identificado
    this._userService.signUp(this.user).subscribe(
      response => {
        console.log(response)
        let identity = response.user;
        this.identity =identity;

        if (!this.identity._id) {
          alert("El usuario no está correctamente identificado")
        } else {
          // Crear elemento en el localstorage para tener al usuario sesion
          localStorage.setItem('identity', JSON.stringify(identity));

          // Obtener el token para enviar en cada petición
          this._userService.signUp(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if (this.token.length <= 0) {
                alert("El token no es correcto")
              } else {
                // Crear elemento en el localstorage para tener token disponible
                localStorage.setItem('token', token);   
                this.user = new User('', '', '', '', '', 'ROLE_USER', ''); //Init the user
              }
            },
            error => {
              var errorMessage = <any>error;
      
              if (errorMessage != null) {
                let body = error.error;
                this.errorMessage = body.message;
                console.log('Error: ', error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          let body = error.error;
          this.errorMessage = body.message;
          console.log('Error: ', error);
        }
      }
    );
  }

  onSubmitRegister() {
    console.log('onSubmitRegister', this.userRegister);

    this._userService.register(this.userRegister).subscribe(
      response => {
        let user = response['user'];

        this.userRegister = user;

        if (!user._id) {
          this. alertRegister = "Error al registrarse";
        } else {
          this.alertRegister = "Registro correcto, identificate con " + this.userRegister.email;
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          let body = error.error;
          this.alertRegister = body.message;
          console.log('Error: ', error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear(); // remove all data

    this.identity = this.token = null;
  }
}
