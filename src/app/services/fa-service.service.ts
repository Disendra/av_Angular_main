import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class FaServiceService {
  // url = 'https://av-node.onrender.com'
//  # url = 'https://av-nodejs.onrender.com';
  url = 'http://localhost:3000';
    // url = 'http://192.168.233.166:3000'
  macVendor = 'https://macvendorlookup.com/api/v2'


  constructor (private http: HttpClient) {}

  login (emailId: string, password: string) {
    return this.http.post(`${this.url}/login`, { emailId, password })
  }

  createUser (emailId: string, password: string, role: any) {
    return this.http.post(`${this.url}/insertData`, { emailId, password, role })
  }

getUserDetails() {
  return this.http.get(`${this.url}/getLoginData`);
}


getFeedData() {
  return this.http.get(`${this.url}/getFeedData`);
}

getMacData(sysAdress:any) {
  return this.http.get(`${this.macVendor}/${sysAdress}`)
}

insertFeedData(sender:any, title:any, description:any,link:any ) {
  return this.http.post(`${this.url}/insertFeed`, { sender, title, description,link })
}

getRoles() {
  return this.http.get(`${this.url}/countByRoles`);
}

downloadExcel(url: string, fileName: string): void {
  this.http.get(url, { responseType: 'blob' })
    .subscribe((data: Blob) => {
      const downloadLink = document.createElement('a');
      const fileURL = window.URL.createObjectURL(data);
      downloadLink.href = fileURL;
      downloadLink.setAttribute('download', fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
}


downloadFeedback(tableName :any, startDate: Date, endDate: Date,rating: any): void {
  const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
  const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');
  const url = `${this.url}/downloadFeedBack?tableName=${ tableName }&startDate=${formattedStartDate}&endDate=${formattedEndDate}&rating=${rating}`;
  this.downloadExcel(url, 'userData.xlsx');
}


downloadLoginInfoExcel(): void {
  this.downloadExcel(`${this.url}/downloadLoginInfo`, 'userData.xlsx');
}

downloadTodayLoginInfoExcel(): void {
  this.downloadExcel(`${this.url}/downloadTodayLogin`, 'userData.xlsx');
}

// downloadFeedBackExcel(): void {
//   this.downloadExcel(`${this.url}/downloadFeedback`, 'userData.xlsx');
// }

}