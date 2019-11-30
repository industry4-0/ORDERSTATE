import {Component, OnInit} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'ngx-machine-detail',
  styleUrls: ['./machine-detail.component.scss'],
  templateUrl: './machine-detail.component.html',
})
export class MachineDetailComponent implements OnInit {

  rawMaterial: any;
  remainingQuantity: any;
  inventory: number;
  expectedDelivery: any;
  usualExpectedDelivery: Date;
  suggesterOrderTime: Date;
  testData: any;
  // skip authtentication for the POC
  token: any;
  orderId: any;
  newOrderResult: any;
  newOrderResultId: any;


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer) {
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // Skip create service file for all the below methods, for POC fast implementation.

  ngOnInit() {
    this.rawMaterial = 'Plastic';
    this.token = '96715494-fcb2-4bcb-aba6-a1b9c2b5d5fa';
    this.orderId = '5dcb599a7569880004aee087';

    // this.expectedDelivery = new Date('November 31 1980 12:30');
  }

  getRemainingQuantity() {
    //  Connection to Inventory Machine System API
    this.remainingQuantity = 100;
  }

  getInventory() {
    //  Connection to Inventory System API
    this.inventory = 300;
  }

  getOrder() {

    //  Connection to Orderstate API
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.token,
      }),
    };

    const localUrl = 'https://orderstate-test.herokuapp.com/api/orders' + '/' + this.orderId;

    this.http.get(localUrl, httpOptions).subscribe(data => {
      this.expectedDelivery = (data as any).mileStones[2].expectedAt;
    });
  }

  createOrder() {

    //  Create Order to Orderstate API
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.token,
      }),
    };

    const newOrder = JSON.parse('{"type":"PURCHASE","description":"Nylon 200m","orderAssignments":{},"participants":[{"role":"SUPPLIER","company":{"id":"company-silkFactory","name":"Silk Factory"}},{"orderId":"NylonOrder3","role":"CUSTOMER","company":{"id":"company-retailerComp","name":"Retailer Comp"}}],"me":{"orderId":"NylonOrder2","role":"CUSTOMER","company":{"id":"company-retailerComp","name":"Retailer Comp"}},"isPublic":true,"publicUrl":"","mileStones":[{"name":"Order accepted","milestoneAssignments":{},"error":false},{"name":"Sample dispatched","milestoneAssignments":{},"error":false},{"name":"Shipment collected by forwarder","milestoneAssignments":{},"error":false},{"name":"Shipment received","milestoneAssignments":{},"error":false}]}');

    const localUrl = 'https://orderstate-test.herokuapp.com/api/orders';

    this.http.post(localUrl, newOrder, httpOptions).subscribe(data => {
      this.newOrderResult = data;
      this.newOrderResultId = this.newOrderResult.id;
    });
  }
}

