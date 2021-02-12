import { Address } from '@data/addresses/address';
import { KrakenAddress } from '@data/addresses/krakenaddress';
import { EthAddress } from '@data/addresses/ethaddress';
import { TdAmeritradeAddress } from '@data/addresses/tdameritradeaddress';
import { CryptoExchange } from '@data/addresses/cryptoexchange';
import fs from 'fs';
import { BtcAddress } from '@data/addresses/btcaddress';
import { StockAddress } from '@data/addresses/stockaddress';

const ccxt = require ('ccxt');

//  ADD YOUR WALLET ADDRESSES/EXCHANGES HERE

function getAddresses(filename: string) {
  const addresses: Array<Address> = new Array<Address>();

  let rawdata = fs.readFileSync(filename,'utf-8');
  let data = JSON.parse(rawdata);

  //  Load addresses from JSON
  for(let i = 0; i < data.addresses.length; ++i) {
    const address = data.addresses[i];

    const addressType = address.type.toLowerCase();

    switch(addressType) {
      case 'kraken':
        addresses.push(new KrakenAddress(address.options.apiKey, address.options.secret, address.name));
        break;
      case 'eth':
        addresses.push(new EthAddress(address.options.address, address.options.apiKey));
        break;
      case 'btc':
        addresses.push(new BtcAddress(address.options.address));
        break;
      case 'stock':
        addresses.push(new StockAddress(address.options.ticker, address.options.balance));
        break;
      default:
        const exchangeClass = ccxt[addressType];
        const exchange = new exchangeClass(address.options);
        addresses.push(new CryptoExchange(exchange, address.name));
        break;
    }
  }

  return addresses;
}

export { getAddresses };
