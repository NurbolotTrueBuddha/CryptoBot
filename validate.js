export default class Validate {
    handler;

    constructor(handler) {
        this.handler = handler;
    }
    async validateMsg(msg) {
        if(this.isRegisterCmd(msg)) this.handler.registerMsg(msg);
        else if(this.isLoginCmd(msg)) this.handler.loginMsg(msg);
        else if(this.checkCmd(msg)) await this.handler.checkMsg(msg);
        else if(this.createWalletCmd(msg)) await this.handler.createMsg(msg)
        else if(this.getWalletsCmd(msg)) await this.handler.getWalletsMsg(msg);
        else if(this.getPrivateKeyCmd(msg)) await this.handler.getPrivateKeyMsg(msg);
        else if(this.loginPasswordCmd(msg)) await this.handler.passwordLoginMsg(msg)
        
        else console.log('not correct command')
    }
    isRegisterCmd(msg){
        let { text } = msg;
        if(text === '/register') {
            return true;
        }
        else {
            return false;
        }
    
    }
    loginPasswordCmd(msg){
        let { text } = msg;
        if(text.includes('@')){
            return true
        }
        else{
            return false
        }
    }
    isLoginCmd(msg){
        let { text } = msg;
        if(text === '/login') {
            return true;
        }
        else {
            return false;
        }
    }
    checkCmd(msg){
        let { text } = msg;
        if(text.includes(':')){
            return true
        }
        else{
            return false
        }
    }
    createWalletCmd(msg){
        let { text } = msg;
        if(text === '/createWallet') {
            return true;
        }
        else {
            return false;
        }
    }
    getWalletsCmd(msg){
        let { text } = msg;
        if(text === '/getWallet') {
            return true;
        }
        else {
            return false;
        }
    }
    getPrivateKeyCmd(msg){
        let { text } = msg;
        if(text === '/getPrivateKey') {
            return true;
        }
        else {
            return false;
        }
    }
    

}