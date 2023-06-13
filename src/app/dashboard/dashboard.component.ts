import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileserviceService } from '../service/fileservice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FileserviceService],
})
export class DashboardComponent {
  public file: File | null = null;
  number: any;
  periodicity: any;
  duration: number = 0;
  meassage!: string;
  value = '';

  constructor(
    private flaskapiservice: FileserviceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private http:HttpClient,
    
  ) {}

  ngOnInit(): void {
    this.file = null;
    this.number = 0;
    this.periodicity = '';
    
  }
  openSnackBar(msg: string, time: any) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: time,
      panelClass: ['custom-snackbar'],
    });
  }

  validate(): boolean {
    if (this.file == null) {
      this.meassage = 'upload a file!';

      this.duration = 4 * 1000;
      this.openSnackBar(this.meassage, this.duration);
      return false;
    } else if (this.periodicity == '') {
      this.meassage = 'Periodicity cannot be empty !';

      this.duration = 4 * 1000;
      this.openSnackBar(this.meassage, this.duration);
      return false;
    } else if (this.number == '') {
      this.meassage = 'Number cannot be empty !';

      this.duration = 4 * 1000;
      this.openSnackBar(this.meassage, this.duration);
      return false;
    } else {
      return true;
    }
  }
  getFile(event: any) {
    this.file = event.target.files[0];
  }
  getprediction() {
    if (this.validate()) {
      this.spinner.show();
      this.flaskapiservice
        .postfile(this.file, this.periodicity, this.number)
        .subscribe((response) => {
     
   
        localStorage.setItem('resultData', JSON.stringify(response));
   
      
          this.router.navigate(['/result']);
          this.spinner.hide();
        },
        
        (error: HttpErrorResponse) => {
          
          this.spinner.hide();
          this.meassage = 'We apologize, there is an internal error. Please try again later !';

          this.duration = 4 * 1000;
          this.openSnackBar(this.meassage, this.duration);
        }
    );
    }
  }
}
