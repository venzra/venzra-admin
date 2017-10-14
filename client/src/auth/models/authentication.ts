export class Activation {
    _id: string;
    password: string;
    token: string;
}

export class Authentication {
    identity: string;
    password: string;
}

export class Recovery {
    identity: string;
}
