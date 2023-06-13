import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class FileserviceService {

  constructor(private httpClient: HttpClient) {}

  public postfile(file:any,periodicity:string,value:string)
  {method:'post';
    const formdata:FormData = new FormData();
    formdata.append('file',file);
    formdata.append('periodicity',periodicity)
    formdata.append('number',value)
    return this.httpClient.post('http://127.0.0.1:5000/upload',formdata);
}
public sigin(username:any,password:any)
  {
    const formdata:FormData = new FormData();
    formdata.append('username',username);
    formdata.append('password',password);

    return this.httpClient.post('http://127.0.0.1:5000/login',formdata);
}

}
