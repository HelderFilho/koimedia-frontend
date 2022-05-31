import axios from "axios";
import Store from './Store'
export const execute = (method, url, body) => {
    console.log('metho', method, url, body)
    let logged_user = Store.USER
    if (!body){
        body = {}
    }
    body.user = logged_user

    return new Promise((resolve, reject) => {
        let config = {
            method : method,
        //    body: JSON.stringify(body)
        }   
        fetch(url, config)
        .then(response => response.json())
        .then(data => {
            console.log('daaaaaaaaaaaa', data)
            let dataToSend = {
                data : data[0],
                
            }
            resolve(dataToSend)
        })
    })
}