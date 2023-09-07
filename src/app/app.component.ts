import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BraintreeService } from './core/services/braintree/braintree.service';

declare const braintree: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient, private braintreeService: BraintreeService) {}

  payableAmount: any = 4;

  ngOnInit() {
    this.initalizeBrainTree();
  }

  async getClientTokenForPaypal() {
    return await this.http.get('http://localhost:3000/brainTreeClientToken').toPromise();
  }

  initalizeBrainTree() {
    const that = this;
    this.getClientTokenForPaypal().then((res: any) => {
      let checkout: any;
      braintree.setup(res.clientToken, 'custom', {
        paypal: {
        container: 'paypal-container',
      },
        onReady: function (integration: any) {
          checkout = integration;
        },
        onCancelled: (obj: any) => {
          console.log('Cancelled', obj);
          checkout.teardown(() => { checkout = null });
        },
        onPaymentMethodReceived: (obj: any) => {
            checkout.teardown(() => {
            checkout = null;
            that.handleBraintreePayment(obj.nonce);
          });
        }
      });
    });
  }

  async handleBraintreePayment(nonce: any) {
    this.braintreeService.makePaymentRequest(this.payableAmount, nonce).then((transaction: any) => {
    console.log('Transaction', transaction);
    })
  }

  async makePaymentRequest(amount: any, nonce: any) {
    const paymentDetails = {
      paymentAmount: amount,
      nonceFromTheClient: nonce
    }
    return await   this.http.post('http://localhost:3000/checkoutWithPayment', paymentDetails).toPromise();
  }

}
