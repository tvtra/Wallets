import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('createPayment')
  async paypalPayment(@Body() obj: Object) {
    console.log(obj);
    try {
      const result: any = await this.paypalService.createPayment(obj);
      console.log(result);
      if (result) {
        for (let i = 0; i < result.links.length; i++) {
          if (result.links[i].rel === 'approval_url') {
            return {
              responseCode: 200,
              result: result.links[i].href,
            };
          }
        }
      }
    } catch (error) {
      return error;
    }
  }

  @Get('capturePayment')
  async capturePayment(@Query() obj: Object) {
    console.log(obj);
  }

  @Post('executePayment')
  async executePaypalPayment(@Body() obj: Object) {
    try {
      const res = await this.paypalService.executePayment(obj) 
      return res
    } catch (error) {
      console.log('error in payment', error.message)
      return error
    }
  }
}
