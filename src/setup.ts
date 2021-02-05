import { Address } from '@data/addresses/address';
import { KrakenAddress } from '@data/addresses/krakenaddress';
import { EthAddress } from '@data/addresses/ethaddress';
import { CoinbaseProAddress } from '@data/addresses/coinbaseproaddress';
import { CoinbaseAddress } from '@data/addresses/coinbaseaddress';
import { TdAmeritradeAddress } from '@data/addresses/tdameritradeaddress';

//  ADD YOUR WALLET ADDRESSES/EXCHANGES HERE
const addresses: Array<Address> = [
    new TdAmeritradeAddress (
      '[apikey]',
      '[redirectUrl]'
    ),
    new CoinbaseAddress (
      '[apiKey]',
      '[apiSecret]'
    ),
    new CoinbaseProAddress (
      '[apiKey]',
      '[apiSecret]',
      '[passPhrase]'
    ),
    new KrakenAddress(
      '[apiKey]',
      '[apiSecret]'
    ),
    new EthAddress(
      '[ethAddress]', 
      '[ethplorer.io API KEY]'
      ),
    new EthAddress(
      '[ethAddress]',
      '[ethplorer.io API KEY]'
    )
  ];

export { addresses };