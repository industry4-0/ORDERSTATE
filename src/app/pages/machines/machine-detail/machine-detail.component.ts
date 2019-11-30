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
  remainingQuantity: number;
  remainingDaysLeft: number;
  inventory: number;
  expectedDelivery: any;
  usualExpectedDelivery: Date;
  suggesterOrderTime: Date;
  testData: any;
  // skip authentication for the POC
  token: any;
  existingOrderId: any;
  existingOrder: any;
  newOrderResult: any;
  newOrderResultId: any;
  inventoryDaysLeft: number;
  calculatedDaysLeft: number;
  expectedDaysLeft: number;
  newOrderDaysLeft: number;
  newOrderDescription: any;
  newOrderQuantity: number;
  safeDaysLeft: number;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer) {
    this.initialise();
  }

  ngOnInit() {
  }

  initialise() {
    this.rawMaterial = 'Plastic';
    this.token = '2f3a7198-6c36-4d44-8288-9cd52c32d0f8';
    this.existingOrderId = '5dcb599a7569880004aee087';
    this.safeDaysLeft = 150;
    this.remainingQuantity = -1;
    this.inventory = -1;
    this.expectedDelivery = null;
    this.usualExpectedDelivery = null;
    this.suggesterOrderTime = null;
    this.testData = null;
    this.newOrderResult = null;
    this.newOrderResultId = null;
    this.inventoryDaysLeft = 0;
    this.remainingDaysLeft = 0;
    this.expectedDaysLeft = 0;
    this.newOrderDaysLeft = 0;
    this.calculatedDaysLeft = 0;
    this.newOrderDescription = null;
    this.newOrderQuantity = this.safeDaysLeft;
  }

  // Skip create decoupled service for all the below methods, for POC fast implementation.

  //  Connection to Inventory Machine System API
  //  Mocking the return value assignment
  getRemainingQuantity() {
    this.remainingQuantity = 100;
    this.remainingDaysLeft = 13;
    this.calculate();
  }

  calculate() {
    this.calculatedDaysLeft = this.inventoryDaysLeft +
                              this.remainingDaysLeft +
                              this.expectedDaysLeft +
                              this.newOrderDaysLeft;
    this.newOrderQuantity = this.safeDaysLeft - this.calculatedDaysLeft;
    this.newOrderDescription =  'Nylon ' + this.newOrderQuantity + 'm';
  }

  calculateDaysFromQuantity(quantity: number) {
    const parameter = 1 / 4 ;
    const speed = 100;
    return quantity / (parameter * speed * 24);
  }

  getInventory() {
    //  Connection to Inventory System API
    this.inventory = 300;
    this.inventoryDaysLeft = 10;
    this.calculate();
  }

  //  Connection to Orderstate API
  getOrder() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.token,
      }),
    };

    const localUrl = 'https://orderstate-test.herokuapp.com/api/orders' + '/' + this.existingOrderId;

    this.http.get(localUrl, httpOptions).subscribe(data => {
      // normally checking the relevant milestone
      this.expectedDelivery = (data as any).mileStones[2].expectedAt;
      this.existingOrder = data;
      this.expectedDaysLeft = 32;
      this.calculate();
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

    newOrder.description = this.newOrderDescription;
    const localUrl = 'https://orderstate-test.herokuapp.com/api/orders';

    this.http.post(localUrl, newOrder, httpOptions).subscribe(data => {
      this.newOrderResult = data;
      this.newOrderResultId = this.newOrderResult.id;
      this.newOrderDaysLeft = 50;
      this.calculate();
    });
  }


  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  substring(string: string) {
    return string.substring(0, 8);
  }
}

