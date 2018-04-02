import { Address } from '@venzra/models';

import { BankAccount } from './bank-account';
import { LegalEntity } from './legal-entity';

export interface Gateway {
    account: string;
    bank: Array<BankAccount>;
    address: Address;
    entity: LegalEntity;
    status: string;
    modified: Date;
}
