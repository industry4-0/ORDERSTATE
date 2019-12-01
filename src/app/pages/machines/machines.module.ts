import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { MachinesRoutingModule } from './machines-routing.module';
import { MachinesComponent } from './machines.component';
import { MachineDetailComponent } from './machine-detail/machine-detail.component';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    MachinesRoutingModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
    NgxEchartsModule,
  ],
  declarations: [
    MachinesComponent,
    MachineDetailComponent,
  ],
})
export class MachinesModule { }
