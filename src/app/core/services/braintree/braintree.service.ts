import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BraintreeService {

  constructor(private http: HttpClient) { }

  async makePaymentRequest(amount: any, nonce: any) {
    const paymentDetails = {
      paymentAmount: amount,
      nonceFromTheClient: nonce,
    };
    return await this.http.post('http://localhost:3000/checkoutWithPayment', paymentDetails).toPromise();
  }
}
