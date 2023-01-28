import Web3 from 'web3';
import * as fs from 'node:fs/promises';
export default class Handler {
    bot;
    web3;
    constructor(bot, rpcUrl) {
        this.bot = bot;
        this.web3 = new Web3(rpcUrl);
    }
    registerMsg(msg) {
        let { from: { id } } = msg;
        this.bot.sendMessage(id, `Придумайт логин и пароль в формате "имя@login@password", без ковычек`)
    }
    async passwordLoginMsg(msg) {
        let { text, chat: { id } } = msg
        text = text.split('@')
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = JSON.parse(userData);
        converted[text[0]] = {
            login: text[1],
            password: text[2],
            ID: String(id),
            wallets: [],
            recievers: []
        }
        converted = JSON.stringify(converted, null, 2)
        await fs.writeFile('./usersAndWallets.json', converted);
        this.bot.sendMessage(id, `Вы успешно зарегистрированы`)
    }
    loginMsg(msg) {
        this.bot.sendMessage(msg.chat.id, `Напишите свой логин и пароль в формате и без кавычек "имя:login:password"`)
    }
    async checkMsg(msg) {
        let { text, chat: { id } } = msg;
        text = text.split(':')
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = JSON.parse(userData);
        let flag = false
        for (let key in converted) {
            if (converted[key].login == text[1] && converted[key].password == text[2]) {
                converted[key].ID = String(id)
                converted = JSON.stringify(converted, null, 2)
                await fs.writeFile('./usersAndWallets.json', converted);
                flag = true
                break;
            }
        }
        if (flag) {
            this.bot.sendMessage(id, `${text[0]} Вы успешно авторизовны`)
        }
    }
    async createMsg(msg) {
        let { chat: { id } } = msg
        const newAccount = await this.web3.eth.accounts.create();
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = await JSON.parse(userData);

        for (let key in converted) {
            if (converted[key].ID == String(id)) {
                let account = { adress: newAccount.address, pk: newAccount.privateKey }
                let len = await converted[key].wallets.length
                converted[key].wallets[len] = account
                this.bot.sendMessage(id, `Кошелек создан ${newAccount.address,
                    newAccount.privateKey}`)
                converted = JSON.stringify(converted, null, 2)
                await fs.writeFile('./usersAndWallets.json', converted);
            }
        }
    }
    async getWalletsMsg(msg) {
        let { chat: { id } } = msg
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = await JSON.parse(userData);
        for (let key in converted) {
            if (converted[key].ID == String(id)) {
                await this.bot.sendMessage(id, 'Your wallets adress')
                for(let i = 0; i < converted[key].wallets.length; i ++){
                   await this.bot.sendMessage(id, (i + 1) + " " + converted[key].wallets[i].adress)
                }
            }
        }
    }
    async getPrivateKeyMsg(msg){
        let { chat: { id } } = msg
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = await JSON.parse(userData);
        for (let key in converted) {
            if (converted[key].ID == String(id)) {
                await this.bot.sendMessage(id, 'Your wallets privat keys')
                for(let i = 0; i < converted[key].wallets.length; i ++){
                    await this.bot.sendMessage(id, (i + 1) + " " + converted[key].wallets[i].pk)
                }
            }
        }
    }
    addRecieverMsg(msg){
        this.bot.sendMessage(msg.from.id, 'Введите данные контакта в формате имя_address')
    }
    async addRecieverCheckMsg(msg){
        
        let { chat: { id },text } = msg
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = await JSON.parse(userData);
        text = text.split('_');
        for(let key in converted) {
            if (converted[key].ID == String(id)) {
                
                let len = converted[key].recievers.length;
                converted[key].recievers[len] = {name: text[0], adress : text[1]}
                converted = JSON.stringify(converted, null, 2)
                await fs.writeFile('./usersAndWallets.json', converted);
                break;
            }
        }
    }
    async getRecieversMsg(msg) {
        let { chat: { id } } = msg
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = await JSON.parse(userData);
        for (let key in converted) {
            if (converted[key].ID == String(id)) {
                await this.bot.sendMessage(id, 'Your recievers')
                for(let i = 0; i < converted[key].recievers.length; i ++){
                   await this.bot.sendMessage(id, (i + 1) + " " + converted[key].recievers[i].name + " " + converted[key].recievers[i].adress)
                }
            }
        }
    }
    getBalanceMsg(msg) {
        let { from: { id } } = msg;
        this.bot.sendMessage(id, `Введите адресс получателя в формате 'Balance?0x12312312312312', без ковычек!`)
    }
    async CheckBalanceMsg(msg) {
        let { from: { id }, text } = msg;
        let userData = await fs.readFile('./usersAndWallets.json', { encoding: 'utf8' });
        let converted = await JSON.parse(userData);
        text = text.split('?')
        text = text[1]
        let flag = false
        for (let key in converted) {
            if (converted[key].ID == String(id)) {
                console.log('done')
                flag = true
                break
            }
        }
        if(flag){
            const balance = await this.web3.eth.getBalance(text);
            await this.bot.sendMessage(id, balance)
        }
        else{
            console.log('not work')
        }
        
    }
}