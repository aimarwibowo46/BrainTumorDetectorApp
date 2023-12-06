import {
    Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTT from 'sp-react-native-mqtt';

export const MqttService = {
    getAll,
}
  
 function getAll() {

  return  MQTT.createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: '1234'
    }).catch(function (err) {
        console.log(err);
    });

}

