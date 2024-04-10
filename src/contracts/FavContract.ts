import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type FavContractConfig = {
  number: number;
  address: Address;
  owner_address: Address;
};

export function favContractConfigToCell(config: FavContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.owner_address)
    .endCell();
}

export class FavContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

    static createFromAddress(address: Address) {
        return new FavContract(address);
    }

    static createFromConfig(config: FavContractConfig, code: Cell, workchain = 0) {
        const data = favContractConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);

        return new FavContract(address, init);
    }

    async sendIncrement(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        increment_by: number
    ) {
        const msg_body = beginCell().storeUint(1, 32).storeUint(increment_by, 32).endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }   

    async sendDeposit(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
    ) {
        const msg_body = beginCell()
            .storeUint(2, 32)
            .endCell();
    
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendWithdrawalRequest(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        amount: bigint,
    ) {
        const msg_body = beginCell()
            .storeUint(3, 32)
            .storeCoins(amount)
            .endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_storage_data", []);
        return {
            number: stack.readNumber(),
            recent_sender: stack.readAddress(),
            owner_address: stack.readAddress(),
        };
    }
  
    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get("balance", []);
        return {
            balance: stack.readNumber(),
        };
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).endCell(),
        });
    }
}