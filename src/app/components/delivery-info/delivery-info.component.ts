import { Component, EventEmitter, Output } from '@angular/core';
import { Delivery } from '../../store/models/delivery';
import { FormControl } from '@angular/forms';
import CheckoutService from '../../store/service/checkout/checkout.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css'],
})
export class DeliveryInfoComponent {
  @Output() deliveryEvent = new EventEmitter<Delivery>();
  datePicker = new FormControl(new Date());
  delivery!: Delivery;
  dates: number[] = [];
  doNotDisturb = false;
  noContact = false;
  dateFormat = 'yyyy-MM-dd';

  constructor(
    private checkoutService: CheckoutService,
    private datePipe: DatePipe
  ) {}

  onChangeDelivery() {
    this.delivery = new Delivery(new Date(), this.doNotDisturb, this.noContact);
    this.deliveryEvent.emit(this.delivery);
  }

  pickDataEvent() {
    this.checkoutService
      .getTimeSlots(
        <string>this.datePipe.transform(this.datePicker.value, this.dateFormat)
      )
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.dates[i] = new Date(data[i]).getHours();
        }
      });
  }
}
