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

  // Constants
  token: any;
  rawMaterial: any;

  supplierAverageLeadTime: any;

  // skipping model definitions, for POC purposes

  // Machine Data
  machineQuantityLeft: number;
  machineDaysLeft: number;

  // Inventory Data
  inventoryQuantityLeft: number;
  inventoryDaysLeft: number;

  // Expected Order Data
  expectedOrder: any;
  expectedOrderSupplier: any;
  expectedOrderId: any;
  expectedOrderDeliveryDate: any;
  expectedOrderQuantityLeft: number;
  expectedOrderDaysLeft: number;

  // New Order Data
  newOrder: any;
  newOrderSupplier: any;
  newOrderId: any;
  newOrderDaysLeft: number;
  newOrderDescription: any;
  newOrderQuantity: number;


  // Input
  safeDaysLeft: number;

  // Calculated Data
  calculatedDaysLeft: number;
  newOrderSuggestedTime: Date;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer) {
      this.rawMaterial = 'Nylon';
      // skipping OAuth2 authentication Flow, for POC purposes
      this.token = '';
      this.expectedOrderId = '5de2d2146910fc0004f61e60';
      this.initialise();
  }

  ngOnInit() {
  }

  initialise() {
    this.safeDaysLeft = 150;
    this.supplierAverageLeadTime = 34;

    this.machineQuantityLeft = -1;

    this.inventoryQuantityLeft = -1;
    this.inventoryDaysLeft = 0;

    this.expectedOrderDeliveryDate = null;
    this.expectedOrderQuantityLeft = -1;
    this.expectedOrderDaysLeft = 0;

    this.newOrderSuggestedTime = null;
    this.newOrder = null;
    this.newOrderId = null;
    this.newOrderDaysLeft = 0;
    this.newOrderDescription = null;
    this.newOrderQuantity = 12000;

    this.newOrderSupplier = null;

    this.machineDaysLeft = 0;
    this.calculatedDaysLeft = 0;
  }

  // Skip create decoupled service for all the below methods, for POC fast implementation.

  //  Connection to Inventory Machine System API
  //  Mocking the return value assignment
  getRemainingQuantity() {
    this.machineQuantityLeft = 600;
    this.calculate();
  }

  calculate() {
    this.machineDaysLeft = this.calculateDaysFromQuantity(this.machineQuantityLeft);
    this.inventoryDaysLeft = this.calculateDaysFromQuantity(this.inventoryQuantityLeft);
    this.expectedOrderDaysLeft = this.calculateDaysFromQuantity(this.expectedOrderQuantityLeft);
    this.newOrderDaysLeft = this.calculateDaysFromQuantity(this.newOrderQuantity);

    this.calculatedDaysLeft = this.inventoryDaysLeft +
                              this.machineDaysLeft +
                              this.expectedOrderDaysLeft +
                              this.newOrderDaysLeft;
    const d = new Date();
    d.setDate(d.getDate() + this.calculatedDaysLeft - 1 - this.supplierAverageLeadTime);
    this.newOrderSuggestedTime = d;


    this.newOrderDescription =  'Nylon ' + this.newOrderQuantity + 'm';
  }

  calculateDaysFromQuantity(quantity: number) {
    const parameter = 1 / 4 ;
    const speed = 100;
    return Math.round(quantity / (parameter * speed * 24));
  }

  getInventory() {
    //  Connection to Inventory System API
    this.inventoryQuantityLeft = 9000;
    this.calculate();
  }

  //  Connection to Orderstate API
  getExpectedOrder() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.token,
      }),
    };

    const localUrl = 'https://orderstate-test.herokuapp.com/api/orders' + '/' + this.expectedOrderId;

    this.http.get(localUrl, httpOptions).subscribe(data => {
      // normally checking the relevant milestone
      const milestoneDeliveryIndex = (data as any).mileStones.length - 1;
      this.expectedOrderDeliveryDate = (data as any).mileStones[milestoneDeliveryIndex].expectedAt;
      this.expectedOrder = data;
      this.expectedOrderSupplier = this.expectedOrder.participants[0].company.name;
      this.expectedOrderQuantityLeft = 12000;  // TODO: get from description
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
      this.newOrder = data;
      this.newOrderSupplier = this.newOrder.participants[0].company.name;
      this.newOrderId = this.newOrder.id;
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

