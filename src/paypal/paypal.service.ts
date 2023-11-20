import { Injectable } from '@nestjs/common';

const paypal = require('paypal-rest-sdk');
const { promisify } = require('util');
const dotenv = require('dotenv');
exports.create = promisify(paypal.payment.create);
exports.execute = promisify(paypal.payment.execute);
dotenv.config();

// Paypal configuration
paypal.configure({
    'mode': process.env.PAYPAL_MODE, // sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET,
});

@Injectable()
export class PaypalService {
    createPayment = async (obj) => {
        try {
            const create_payment_json = {
                'intent': 'sale',
                'payer': {
                    'payment_method': 'paypal'
                },
                'redirect_urls': {
                    'return_url': 'http://localhost:3000/paypal/capturePayment',
                    'cancel_url': 'http://cancel.url',
                },
                'transactions': [{
                    'item_list': {
                        'items': [{
                            'name': 'item',
                            'sku': 'item',
                            'price': obj.price,
                            'currency': obj.currency.toUpperCase(),
                            'quantity': obj.quantity
                        }]
                    },
                    'amount': {
                        'currency': obj.currency.toUpperCase(),
                        'total': obj.price * obj.quantity,
                    },
                    'description': 'This is the payment description.'
                }]
            };

            return new Promise(async function (resolve, reject) {
                paypal.payment.create(create_payment_json, async function (error, payment) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(payment);
                    }
                })
            });
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }


    executePayment = async (obj) => {
        try {
            const execute_payment_obj = {
                'payer_id': obj.payerId,
                'transactions': [{
                    'amount': {
                        'currency': obj.currency.toUpperCase(),
                        'total': obj.total
                    }
                }]
            };

            return new Promise(async function (resolve, reject) {
                paypal.payment.execute(obj.paymentId, execute_payment_obj, async function (error, payment) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(payment, 'pay');
                        resolve(payment);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            return false
        }
    }


    getListOfCurrencies = async () => {
        try {
            const CURRENCY_LIST = [
                {
                    symbol:"AUD",
                    decimal:"2"
                },
                {
                    symbol: "BRL",
                    decimal: "2"
                },
                {
                    symbol:"CAD",
                    decimal:"2"
                },
                {
                    symbol: "CZK",
                    decimal: "2"
                },
                {
                    symbol:"DKK",
                    decimal:"2"
                },
                {
                    symbol: "EUR",
                    decimal: "2"
                },
                {
                    symbol:"HKD",
                    decimal:"2"
                },
                {
                    symbol: "HUF",
                    decimal: "0"
                },
                {
                    symbol: "ILS",
                    decimal: "2"
                },
                {
                    symbol:"JPY",
                    decimal:"0"
                },
                {
                    symbol: "MYR",
                    decimal: "2"
                },
                {
                    symbol:"MXN",
                    decimal:"2"
                },
                {
                    symbol: "TWD",
                    decimal: "0"
                },
                {
                    symbol:"NZD",
                    decimal:"2"
                },
                {
                    symbol: "NOK",
                    decimal: "2"
                },
                {
                    symbol:"PHP",
                    decimal:"2"
                },
                {
                    symbol: "PLN",
                    decimal: "2"
                },
                {
                    symbol:"GBP",
                    decimal:"2"
                },
                {
                    symbol: "RUB",
                    decimal: "2"
                },
                {
                    symbol:"SGD",
                    decimal:"2"
                },
                {
                    symbol: "SEK",
                    decimal: "2"
                },
                {
                    symbol:"CHF",
                    decimal:"2"
                },
                {
                    symbol: "THB",
                    decimal: "2"
                },
                {
                    symbol:"USD",
                    decimal:"2"
                }
            ]
            return [200,CURRENCY_LIST]
        } catch (e) {
            console.log(e)
            return false
        }
    } 
}
