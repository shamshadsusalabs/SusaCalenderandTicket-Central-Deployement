import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandUps } from '../_models/standups.model';

@Injectable({
  providedIn: 'root'
})
export class StandupsService {

  constructor(private http: HttpClient) { }

  getStandups(){
    return this.http.get<StandUps[]>("https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/standups/getall");
  }

  getid(data : any){
    return this.http.post("https://susalogyapi.herokuapp.com/api/products/getuser/SusaTask/"+data, {});
  }

  getdetails(data : any){
    return this.http.get("https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/user/details/"+data);
  }

  addTaskinStandups(data){
    return this.http.post("https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/standups/addtasks", data);
  }

  updateTaskinStandups(data){
    return this.http.post("https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/standups/updateisCompleted", data);
  }

  updatePopupdate(data, id){
    console.log(data, id);
    return this.http.post(`https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/standups/update?id=${id}`, data);
  }

  addStandups(data){
    return this.http.post("https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/standups/add", data);
  }
}
