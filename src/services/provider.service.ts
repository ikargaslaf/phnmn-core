import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {ethers} from 'ethers';
import {createAlchemyWeb3} from '@alch/alchemy-web3';
require('dotenv').config();

@injectable({scope: BindingScope.TRANSIENT})
export class ProviderService {
  provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
    | undefined;

  signer: ethers.Wallet;

  constructor() {
    this.provider =
      process.env.PROVIDER != undefined
        ? new ethers.providers.Web3Provider(
            createAlchemyWeb3(process.env.PROVIDER).currentProvider as any,
          )
        : new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');

    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    this.start();
  }
  async start() {
    await this.provider?.ready.then(network => {
      return network;
    });
  }
}
