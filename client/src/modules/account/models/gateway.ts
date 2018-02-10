import { Address } from './address';
import { BankAccount } from './bank-account';
import { LegalEntity } from './legal-entity';

export class Gateway {
    account: string;
    bank: Array<BankAccount>;
    address: Address;
    entity: LegalEntity;
    status: string;
    modified: Date;
}
