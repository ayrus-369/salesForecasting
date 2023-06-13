import { Component } from '@angular/core';
import { FileserviceService } from '../service/fileservice.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  
  rmse:any;
  mse:any;
  mae:any;
  mape:any;
  value:any;
  result:boolean=false;
  imageUrl: string = 'assets/img/forecastresult_2.png';
  lastModified: any;
  constructor(private fileservice:FileserviceService,private http: HttpClient) { }

  
  ngOnInit(): void{

this.value=localStorage.getItem('resultData')
  this.value=JSON.parse(this.value)

    this.rmse=this.value['rmse'];
    this.mse=this.value['mse'];
    this.mape=this.value['mape'];
    this.mae=this.value['mae'];
  
  }
  downloadFile() {
    const fileUrl = 'assets/result/forecast.csv';
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((res: any) => {
      const fileBlob = new Blob([res], { type: 'application/octet-stream' });
      saveAs(fileBlob, 'forecast.csv');
    });
  }


imageLoaded() {
  // Check if the image has been modified
  fetch(this.imageUrl, { method: 'HEAD' })
    .then(res => {
      const lastModifiedHeader = res.headers.get('last-modified');
      if (this.lastModified !== lastModifiedHeader) {
        // Image has been modified, update the image URL and the last modified date
        this.lastModified = lastModifiedHeader;
        this.imageUrl = `${this.imageUrl}?t=${new Date().getTime()}`;
      }
    });
}

 
  
}
