import * as _ from 'lodash';
import contract = require('truffle-contract');
import {Web3Wrapper} from '../web3_wrapper';
import {ZeroExError, Artifact, ContractInstance} from '../types';
import {utils} from '../utils/utils';

export class ContractWrapper {
    protected _web3Wrapper: Web3Wrapper;
    private _gasPrice: BigNumber.BigNumber;
    constructor(web3Wrapper: Web3Wrapper, gasPrice: BigNumber.BigNumber) {
        this._web3Wrapper = web3Wrapper;
        this._gasPrice = gasPrice;
    }
    protected async _instantiateContractIfExistsAsync(artifact: Artifact, address?: string): Promise<ContractInstance> {
        const c = await contract(artifact);
        c.defaults({
            gasPrice: this._gasPrice,
        });
        const providerObj = this._web3Wrapper.getCurrentProvider();
        c.setProvider(providerObj);

        const networkIdIfExists = await this._web3Wrapper.getNetworkIdIfExistsAsync();
        const artifactNetworkConfigs = _.isUndefined(networkIdIfExists) ?
                                       undefined :
                                       artifact.networks[networkIdIfExists];
        let contractAddress;
        if (!_.isUndefined(address)) {
            contractAddress = address;
        } else if (!_.isUndefined(artifactNetworkConfigs)) {
            contractAddress = artifactNetworkConfigs.address.toLowerCase();
        }

        if (!_.isUndefined(contractAddress)) {
            const doesContractExist = await this._web3Wrapper.doesContractExistAtAddressAsync(contractAddress);
            if (!doesContractExist) {
                throw new Error(ZeroExError.ContractDoesNotExist);
            }
        }

        try {
            const contractInstance = _.isUndefined(address) ? await c.deployed() : await c.at(address);
            return contractInstance;
        } catch (err) {
            const errMsg = `${err}`;
            if (_.includes(errMsg, 'not been deployed to detected network')) {
                throw new Error(ZeroExError.ContractDoesNotExist);
            } else {
                utils.consoleLog(`Notice: Error encountered: ${err} ${err.stack}`);
                throw new Error(ZeroExError.UnhandledError);
            }
        }
    }
}
