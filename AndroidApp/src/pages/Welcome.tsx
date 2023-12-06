import React, { useEffect, useState } from 'react'
import { Alert, ActivityIndicator, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import { GenService } from '../services/gen/GenServices';
import { MasterColor } from '../components/Colors';
// import PushNotification from "react-native-push-notification";
import { ApiServices } from '../services/api/ApiServices';

const { width, height } = Dimensions.get('screen')



const welcome = (props: any) => {
    const [UserData, setUserData] = useState('')
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        GenService.getStorage('userdata').then((resp) => {
            setisLoading(true)
            setUserData(resp);
            console.log('userData', resp);
            setTimeout(() => {
                if(resp != undefined){
                    props.navigation.replace('Dashboard')
                }
                setisLoading(false)
            }, 1000);

        })
    }, [])

    return (
        <LinearGradient colors={MasterColor.BlueLinear()} style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor='transparent' />
            <View style={styles.container}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 3, alignItems: 'center' }}>
                    <Image source={require('../assets/imgs/logo_ori.png')} style={[styles.logo, { resizeMode: 'contain' }]} />
                    <Text style={[styles.loginAs, { textAlign: 'center' }]}>CONVOLUTIONAL NEURAL NETWORK</Text>
                </View>
                {isLoading && <ActivityIndicator style={{ flex: 1 }} size={50} color='white'></ActivityIndicator>}
                {!isLoading &&
                    <View  style={{ flex: 2 }}>
                        <View >
                            <TouchableOpacity onPress={() => props.navigation.replace('Dashboard') }>
                                <View style={[styles.btn, { backgroundColor: MasterColor.Green() }]}>
                                    <Text style={styles.textBtn}>Start</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        </LinearGradient>
    )
}
1
export default welcome

const styles = StyleSheet.create({
    loginAs: {
        alignSelf: 'center',
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20
    },
    container: {
        marginTop: 30,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btn: {
        height: 50,
        width: width / 1.4,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 10,
        marginVertical: 10
    },
    textBtn: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        flex: 1.5
    },
    logo: {
        width: width / 2.5,
        height: height / 2 / 2,
    },
    top1: {
        backgroundColor: MasterColor.purple(),
        height: width / 1.2,
        width: width / 1.2,
        borderRadius: width / 2,
        top: -width / 1.8
    },
    top2: {
        backgroundColor: 'white',
        height: width / 1.4,
        width: width / 1.4,
        borderRadius: width / 2,
        top: -width / 0.90,
        left: -100
    },
})
