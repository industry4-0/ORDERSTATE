import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbThemeService } from '@nebular/theme';

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

  pieOptions: any;
  themeSubscription: any;
  colors: any;
  newOrderSuggestedQuantity: number;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private theme: NbThemeService,
  ) {
    this.rawMaterial = 'Nylon';
    // skipping OAuth2 authentication Flow, for POC purposes
    this.token = '24fde833-f33e-46c4-bf60-343f7c5cbc50';
    this.expectedOrderId = '5de2d2146910fc0004f61e60';
    this.initialise();
    this.initializePie();
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
    this.newOrderQuantity = null;
    this.newOrderSuggestedQuantity = 12000;

    this.newOrderSupplier = null;

    this.machineDaysLeft = 0;
    this.calculatedDaysLeft = 0;
  }

  initializePie() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.pieOptions = {
        backgroundColor: echarts.bg,
        color: [
          this.colors.warningLight,
          this.colors.infoLight,
          this.colors.dangerLight,
          this.colors.successLight,
          this.colors.primaryLight,
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: false,
        series: [
          {
            name: 'Days',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: [
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
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

    this.pieOptions.series[0].data = [
      {
        name: 'Machine', value: this.machineDaysLeft,
        itemStyle: { color: this.colors.infoLight },
      },
      {
        name: 'Inventory', value: this.inventoryDaysLeft,
        itemStyle: { color: this.colors.warningLight },
      },
      {
        name: 'Expected Order', value: this.expectedOrderDaysLeft,
        itemStyle: { color: this.colors.dangerLight },
      },
      {
        name: 'New Order', value: this.newOrderDaysLeft,
        itemStyle: { color: this.colors.success },
      },
    ];

    // if (this.inventoryDaysLeft > 0 && this.pieOptions.series[0].data.filter(e => e.Name === 'Inventory').length === 0) {
    //   this.pieOptions.series[0].data.push({
    //     name: 'Inventory', value: this.inventoryDaysLeft,
    //     itemStyle: {color: this.colors.warningLight},
    //   });
    // }
    //
    // if (this.machineDaysLeft > 0 && !this.pieOptions.series[0].data.includes('Machine')) {
    //   this.pieOptions.series[0].data.push({
    //     name: 'Machine', value: this.machineDaysLeft,
    //     itemStyle: {color: this.colors.warningDark},
    //   });
    // }
    //
    // if (this.expectedOrderDaysLeft > 0 && !this.pieOptions.series[0].data.includes('Expected Order')) {
    //   this.pieOptions.series[0].data.push({
    //     name: 'Expected Order', value: this.expectedOrderDaysLeft,
    //     itemStyle: {color: this.colors.dangerLight},
    //   });
    // }
    //
    // if (this.newOrderDaysLeft > 0 && !this.pieOptions.series[0].data.includes('New Order')) {
    //   this.pieOptions.series[0].data.push({
    //     name: 'New Order', value: this.newOrderDaysLeft,
    //     itemStyle: {color: this.colors.success},
    //   });
    // }
    this.pieOptions = { ...this.pieOptions };

    const d = new Date();
    d.setDate(d.getDate() + this.calculatedDaysLeft - 1 - this.supplierAverageLeadTime);
    this.newOrderSuggestedTime = d;


    this.newOrderDescription = 'Nylon ' + this.newOrderQuantity + 'm';
  }

  calculateDaysFromQuantity(quantity: number) {
    const parameter = 1 / 4;
    const speed = 100;
    return Math.round(quantity / (parameter * speed * 24));
  }

  getInventory() {
    //  Connection to Inventory System API
    this.inventoryQuantityLeft = 8400;
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

    // const newOrder = JSON.parse('{"type":"PURCHASE","description":"Nylon 200m","orderAssignments":{},"participants":[{"role":"SUPPLIER","company":{"id":"company-silkFactory","name":"Silk Factory"}},{"orderId":"NylonOrder3","role":"CUSTOMER","company":{"id":"company-retailerComp","name":"Retailer Comp"}}],"me":{"orderId":"NylonOrder2","role":"CUSTOMER","company":{"id":"company-retailerComp","name":"Retailer Comp"}},"isPublic":true,"publicUrl":"","mileStones":[{"name":"Order accepted","milestoneAssignments":{},"error":false},{"name":"Sample dispatched","milestoneAssignments":{},"error":false},{"name":"Shipment collected by forwarder","milestoneAssignments":{},"error":false},{"name":"Shipment received","milestoneAssignments":{},"error":false}]}');
    const newOrder = this.populateNewOrder();
    newOrder.description = this.newOrderDescription;
    const localUrl = 'https://orderstate-test.herokuapp.com/api/orders';

    this.http.post(localUrl, newOrder, httpOptions).subscribe(data => {
      this.newOrder = data;
      this.newOrderSupplier = this.newOrder.participants[0].company.name;
      this.newOrderId = this.newOrder.id;
      this.newOrderQuantity = 12000;
      this.calculate();
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  substring(string: string) {
    return string.substring(0, 8);
  }

  populateNewOrder() {
    return JSON.parse('{\n' +
      '   "type":"PURCHASE",\n' +
      '   "description":"Quantity 12.000mt",\n' +
      '   "orderAssignments":{\n' +
      '   },\n' +
      '   "participants":[\n' +
      '      {\n' +
      '         "orderId":"Sample Nylon Order 2",\n' +
      '         "role":"SUPPLIER",\n' +
      '         "company":{\n' +
      '            "id":"company-silkFactory",\n' +
      '            "name":"Silk Factory"\n' +
      '         }\n' +
      '      },\n' +
      '      {\n' +
      '         "orderId":"Sample Nylon Order 2",\n' +
      '         "role":"CUSTOMER",\n' +
      '         "company":{\n' +
      '            "id":"company-retailerComp",\n' +
      '            "name":"Retailer Comp"\n' +
      '         }\n' +
      '      }\n' +
      '   ],\n' +
      '   "me":{\n' +
      '      "orderId":"Sample Nylon Order 2",\n' +
      '      "role":"CUSTOMER",\n' +
      '      "company":{\n' +
      '         "id":"company-retailerComp",\n' +
      '         "name":"Retailer Comp"\n' +
      '      }\n' +
      '   },\n' +
      '   "publicUrl":"",\n' +
      '   "mileStones":[\n' +
      '      {\n' +
      '         "name":"Order accepted",\n' +
      '         "finished":true,\n' +
      '         "started":true,\n' +
      '         "expectedAt":"2019-11-30T22:00:00.000Z",\n' +
      '         "milestoneAssignments":{\n' +
      '         },\n' +
      '         "error":false\n' +
      '      },\n' +
      '      {\n' +
      '         "name":"Sample dispatched",\n' +
      '         "finished":false,\n' +
      '         "started":true,\n' +
      '         "expectedAt":"2019-12-17T22:00:00.000Z",\n' +
      '         "milestoneAssignments":{\n' +
      '         },\n' +
      '         "error":false\n' +
      '      },\n' +
      '      {\n' +
      '         "name":"Shipment collected by forwarder",\n' +
      '         "expectedAt":"2019-12-24T22:00:00.000Z",\n' +
      '         "location":{\n' +
      '            "name":"Shanghai, China",\n' +
      '            "address":{\n' +
      '               "street":" ",\n' +
      '               "city":"Shanghai",\n' +
      '               "region":"Shanghai",\n' +
      '               "country":"China",\n' +
      '               "postalCode":""\n' +
      '            },\n' +
      '            "point":{\n' +
      '               "latitude":"31.230416",\n' +
      '               "longitude":"121.473701"\n' +
      '            }\n' +
      '         },\n' +
      '         "milestoneAssignments":{\n' +
      '         },\n' +
      '         "error":false\n' +
      '      },\n' +
      '      {\n' +
      '         "name":"Shipment received",\n' +
      '         "expectedAt":"2019-12-23T22:00:00.000Z",\n' +
      '         "location":{\n' +
      '            "name":"Pireas 185 38, Greece",\n' +
      '            "address":{\n' +
      '               "street":" ",\n' +
      '               "city":"Pireas",\n' +
      '               "region":"Pireas",\n' +
      '               "country":"Greece",\n' +
      '               "postalCode":"185 38"\n' +
      '            },\n' +
      '            "point":{\n' +
      '               "latitude":"37.9351377",\n' +
      '               "longitude":"23.62467300000003"\n' +
      '            }\n' +
      '         },\n' +
      '         "milestoneAssignments":{\n' +
      '         },\n' +
      '         "error":false\n' +
      '      }\n' +
      '   ]\n' +
      '}');
  }
}

