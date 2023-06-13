import { Component, OnInit } from '@angular/core';
import { FileserviceService } from '../service/fileservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],

})
export class LoginPageComponent implements OnInit {
  hide!: boolean;
  password!: string;
  meassage!: string;
  duration: any;

  name: string | undefined;
  constructor(private router: Router, private _snackBar: MatSnackBar,    private flaskapiservice: FileserviceService,private spinner:NgxSpinnerService) {}
  ngOnInit(): void {
    this.hide = true;

    this.name = '';
    this.password = '';
  }
  openSnackBar(msg: string, time: any) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: time,
      panelClass: ['custom-snackbar']
    });
  }

  validate(): boolean {
    if (this.name == '') {
      this.meassage = 'Username cannot be empty!';
    
      this.duration = 4 * 1000;
      this.openSnackBar(this.meassage,  this.duration);
      return false;
    } else if (this.password == '') {
      this.meassage = 'Password cannot be empty !';
     
      this.duration = 4 * 1000;
      this.openSnackBar(this.meassage, this.duration);
      return false;
    } else {
      return true;
    }
  }
  reset() {
    this.name = '';
    this.password = '';
  }
  login() {
    if (this.validate()) {
      this.spinner.show();
      this.flaskapiservice.sigin(this.name,this.password)
      .subscribe((response)=>{
        // console.log(response);
        this.spinner.hide();
        if(response == "valid login")
        {
          this.router.navigate(['/dashboard']);
        }
        else if(response == "password is incorrect")
        {
         this.openSnackBar(response.toString(),3000)
        }
        else
        {
          
          this.openSnackBar(response.toString(),3000)
        }
},
(error: HttpErrorResponse) => {
          
  this.spinner.hide();
  this.meassage = 'We apologize, there is an internal error. Please try again later !';

  this.duration = 4 * 1000;
  this.openSnackBar(this.meassage, this.duration);
}
)
    }
    
  }
}
