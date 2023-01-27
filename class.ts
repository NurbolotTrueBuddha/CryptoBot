// как сохранить то что сделал
// как использовать декораторы
// как использовать конструктор
// register
// login
// create wallet
// get wallets
// add wallet
// add reciever wallet
// get receiever wallet
// send bnb
// get status of transaction
// get all my transaction
// receiving event
// who sended me bnb <10:12:22 - 10:1:23>


import Web3 from 'web3';
import fs from 'fs'

interface Wallet {
    address: string;
    pk: string;
}

interface User {
    mail: string;
    password: string;
}

class Main {

    private accounts: Array<Wallet> = [];
    private web3: Web3;
    Users: Array<User> = [];

    constructor(rpcUrl: string) {
        this.web3 = new Web3(rpcUrl);
    }

    registrationUser(user: User) {
        this.Users.push(user);
        fs.appendFileSync('hello.txt', user.mail + ' ' + user.password + '()')
        return user
    }
    login(user: User){
        let check = fs.readFileSync('hello.txt', 'utf8')
        let checkArray = check.split(' ');
        if (checkArray[0] == user.mail && checkArray[1] == user.password){
            console.log('wellcome');
        }
        else{
            console.log('not correct')
        }
    }

    
    addWallet(wallet: Wallet) {
        this.accounts.push(wallet);
        return wallet
    }
    async send(sender: Wallet, reciever: Wallet, amount: string) {

        let txData = {
            from: sender.address,
            to: reciever.address,
            value: amount,
            gas: 100000
        }

        let txSigned = await this.web3.eth.accounts.signTransaction(txData, sender.pk);

        try {
            let txResult = await this.web3.eth.sendSignedTransaction(txSigned.rawTransaction as string)
            return txResult
            // console.log('txHx ->', txResult);
        } catch (error) {
            console.log('error ->', error)
        }
    }

    async getBalance(wallet: Wallet) {
        const balance = await this.web3.eth.getBalance(wallet.address);
        return balance;
    }


    createAcc(): Wallet {
        let acc = this.web3.eth.accounts.create();

        this.accounts.push({ address: acc.address, pk: acc.privateKey });

        return { address: acc.address, pk: acc.privateKey };
    }
}

let rpcUrl = 'https://old-alpha-silence.bsc-testnet.discover.quiknode.pro/254b2d7e40b37a164f2dd8898e81c3ab2775d7a3/';
let test = new Main(rpcUrl);

let zeroAcc = test.addWallet({ address: '0x584Ac764a6338962414909D11198119A46F915d9', pk: '0xd76783dcd05b2ff9a6b18ec510c7eaa168958f0c7d312b39a6f328f9071706ea' }) //192 строка бнб
let firstAcc = test.createAcc();
let secondAcc = test.createAcc();

test.send(zeroAcc, firstAcc, '300000').then((txResult)=> {
    console.log(txResult)
    return txResult
}).then((data) => {
    const balance = test.getBalance(firstAcc)
    return balance;
}).then(dataa => {
    console.log(dataa)
});
// let c = test.registrationUser({mail: 'mail.ru', password: '122245'})
// let d = test.registrationUser({mail: 'mail.ru', password: '123247'})
// console.log(test.Users)
// test.login({mail: 'mail.ru', password: '122245'})