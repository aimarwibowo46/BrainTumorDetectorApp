import {
    envService
} from '../env/env';
import {
    GenService
} from '../gen/GenServices'
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

export const ApiServices = {
    GetData,
    postData,
    DelData,
    post,
    upload
}

const ApiUrl = envService.envUrl();

async function upload(param: any) {
    return await RNFetchBlob.fetch(
        'POST', ApiUrl + 'predict', {
        'Content-Type': 'multipart/form-data',
    },
        [{
            name: 'image',
            filename: param.images.fileName,
            type: param.images.type,
            data: RNFetchBlob.wrap(param.images.uri)
        }
        ],
    ).catch((error: any) => {
        GenService.alertErr('Network error please try again')
        console.error(error);
    });
}


function postData(body: any,endpoint : any) {
    let formData = new FormData;
    for (var key in body) {
        formData.append(key, body[key])
    }
    const requestOptions = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    // return axios.post(endpoint, {body})
    //     .then(function (response) {
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    return fetch(ApiUrl + endpoint, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json;
        })
        .catch((error) => {
            GenService.alertErr('Network error please try again')
            console.error(error);
        });
}


function GetData(endpoint:any) {
    const requestOptions = {
        method: 'GET',
    };
    return fetch(ApiUrl + endpoint, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json;
        })
        .catch((error) => {
            GenService.alertErr('Network error please try again')
            console.error(error);
        });
}

function DelData(endpoint:any) {
    const requestOptions = {
        method: 'DELETE',
    };
    return fetch(ApiUrl + endpoint, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json;
        })
        .catch((error) => {
            GenService.alertErr('Network error please try again')
            console.error(error);
        });
}

function post(body:any,endpoint: any) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': '',
        },
    };

    return fetch(ApiUrl + endpoint, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json;
        })
        .catch((error) => {
            GenService.alertErr('Network error please try again')
            console.error(error);
        });
}



