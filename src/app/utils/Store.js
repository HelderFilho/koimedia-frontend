import CryptoJS from 'crypto-js';
let user = sessionStorage.getItem('user') || localStorage.getItem('user')
let user_ = null

if (user){
var bytes  = CryptoJS.AES.decrypt(user, '%762t8duyg!20');
user_ = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
user_.role = user_.fk_id_role

}
export default {
    USER : user_
}