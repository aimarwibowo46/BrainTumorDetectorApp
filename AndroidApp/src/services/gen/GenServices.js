import {
    Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


export const GenService = {
    alertErr,
    alertSuccess,
    saveStorage,
    getStorage,
    clearStorage,
    alert
}

 async function saveStorage(param,val) {
     await AsyncStorage.setItem(param, val);
 }

 async function getStorage(param) {
     const v = await AsyncStorage.getItem(param);
     let data = JSON.parse(v)
     return data
 }

 async function clearStorage(){
     try {
         await AsyncStorage.clear()
     } catch (e) {
         // clear error
     }
     console.log('Done. Clear')
 }


function alert(title,msg) {
    Alert.alert(
        title,
        msg,
        [{
            text: "OK",
            onPress: () => console.log("OK Pressed")
        }]
    );
}
function alertErr(v) {
    Alert.alert(
        "Maaf!",
        v,
        [{
            text: "OK",
            onPress: () => console.log("OK Pressed")
        }]
    );
}

function alertSuccess(v) {
    Alert.alert(
        "Berhasil !",
        v,
        [{
            text: "OK",
            onPress: () => console.log("OK Pressed")
        }]
    );
}