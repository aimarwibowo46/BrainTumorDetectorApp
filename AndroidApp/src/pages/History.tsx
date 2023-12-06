import { View, StyleSheet, Text, SafeAreaView, 
    Dimensions, StatusBar, TextInput, KeyboardAvoidingView, TouchableOpacity, 
    ActivityIndicator, Image, Pressable } from 'react-native';
import React, { useState,useEffect,useRef } from 'react'
import { MasterColor } from '../components/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { GenService } from '../services/gen/GenServices';
import { ApiServices } from '../services/api/ApiServices';
import Circle from '../components/Circle';
import Circle2 from '../components/Circle2';
import { MqttService } from '../services/mqtt/mqttService';
import moment from 'moment';
import { BlurView } from "@react-native-community/blur";
const { width } = Dimensions.get('screen')

export default function History(props: any) {
    const [Data, setData] = useState([{}])
    const [ShowData, setShowData] = useState(false)
    const [isRunning, setIsRunning] = useState(false);

    GenService.getStorage('is_on').then((ison)=>{
        console.log(`is_on`, ison);
        if(ison == 1){
            setIsRunning(true)
        }
    })

    useEffect(() => {
        
        let interval: any;
        if (isRunning) {
            console.log(`start`, isRunning);
            
            interval = setInterval(() => {
                refreh()
            }, 10000);
        } else {
           console.log('STOP INTERVAL');
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isRunning])

   
    const refreh = async () => {
        GenService.getStorage('is_on').then((ison) => {
            console.log(`ison`, ison);
            if (ison == 1) {
                setIsRunning(true)
                GenService.getStorage('suhu').then((suhu)=>{
                    GenService.getStorage('kelembaban').then((kel)=>{
                        let datenow = new Date;
                        let datas = Data;
                        datas.push({
                            date: moment(datenow).format('YYYY-MM-DD hh:mm:ss'),
                            suhu: suhu,
                            air: kel
                        })
                         setShowData(false)
                                console.log(`datas`, datas);
                                setTimeout(() => {
                                    setData(datas)
                                    setShowData(true)
                                }, 0);
                    })
                })
            } else {
                setIsRunning(false)
            }
        })
     
    
       
       
        
        // setData([...Data,
        // {
        //     date: moment(datenow).format('YYYY-MM-DD hh:mm:ss'),
        //     suhu: '34',
        //     air: '39'
        // }]);
    }

    const clear = () => {
        setData([])
        setIsRunning(false)
    }





    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.MainContainer} >
                <StatusBar translucent barStyle='dark-content' backgroundColor={'transparent'}/>
                <View style={styles.subContainer}>
                    <View style={styles.childView}>
                        {/* <View style={{flex:1 }}>
                            <View style={styles.top1}></View>
                            <View style={styles.top2}></View>
                        </View> */}
                        {/* <Image  source={require('../assets/imgs/logo2.png')} style={{ width: width / 2.9, height: width / 3.9, resizeMode: 'contain' }} /> */}
                        <Text style={{ color:'black',fontWeight:'bold',fontSize:18,textAlign :'center'}}>History Monitoring</Text>
                        <View style={{ marginBottom: width / 2,flexDirection:'row',justifyContent:'space-evenly',width:width,marginTop:10 }}>
                            <TouchableOpacity onPress={() => refreh()} style={styles.btnRefresh}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Refresh</Text>
                            </TouchableOpacity>
                   
                            <TouchableOpacity onPress={() => clear()} style={styles.btnRefresh}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                
                <View style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    width:width/1.1,
                    height:width*1.5,
                    marginTop:width/3,
                    borderRadius:15,
                    paddingTop:10,
                    position:'absolute',
                     }}>

                    <BlurView
                        style={styles.absolute}
                        blurType="light"
                        blurAmount={20}
                        reducedTransparencyFallbackColor="white"
                    />

                    <View style={{ marginHorizontal:15 }}>
                        <View style={styles.header}>
                            <Text style={[styles.textHeader,{width:'45%'}]}>Timestamp</Text>
                            <Text style={styles.textHeader}>Suhu</Text>
                            <Text style={styles.textHeader}>Kelembaban</Text>
                        </View>
                        <View style={{height:1,backgroundColor:'black',width:width/1.2,marginVertical:5}}/>
                        {ShowData && 
                            <>
                            {Data.map((v,k)=>(
                                <View style={styles.row} key={k}>
                                    <Text style={[styles.textRow, { width: '45%' }]}>{v.date}</Text>
                                    <Text style={[styles.textRow, { width: '20%' }]}>{v.suhu}°C</Text>
                                    <Text style={styles.textRow}>{v.air}%</Text>
                                </View>
                            ))}
                        </>}
                       
                    </View>


                        
                </View>
              

            </SafeAreaView>
           
        </View>
    )
}

const styles = StyleSheet.create({
    btnRefresh:{
        height:30,
        backgroundColor:MasterColor.Primary(),
        width:100,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:5
    },
    textRow:{
        color:'black'
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical:5
    },
    textHeader:{
        color:'black',
        fontSize:16,
        fontWeight:'bold'
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    cardTimer:{
        height:45,
        width:width/1.2,
        backgroundColor:MasterColor.Primary(),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    colLabel:{
        height:50,
        width:140,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        elevation:5,
        marginTop:10,
        borderRadius:10
    },
    btnCtrl:{
        height:60,
        width: 60,
        alignItems:'center',
        backgroundColor:'black',
        elevation:5,
        borderRadius:100,
        justifyContent:'center'
    },
    cardList:{
        backgroundColor: MasterColor.Primary(),
        marginHorizontal:10,
        marginVertical:5,
        padding:10,
        borderRadius:15,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    eyeBtn:{
        marginRight: 20
    },
    container:{
        backgroundColor: MasterColor.Primary(),
        flex:1
    },
    register: {
        marginBottom: 20,
        marginTop: -20,
        height: 45,
        width: width / 1.5,
        backgroundColor: MasterColor.red(),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        elevation: 5
    },
    btnLogin: {
        height: 50,
        top: -30,
        width: width / 1.5,
        backgroundColor: MasterColor.purple(),
        elevation: 4,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textLogin: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    icon: {
        marginHorizontal: 10
    },
    icon2: {
        marginHorizontal: 10
    },
    input1: {
        top: 30,
        height: 50,
        backgroundColor: '#F7F8F8',
        borderRadius: 15,
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input2: {
        top: 40,
        height: 50,
        width : width/1.2,
        backgroundColor: '#F7F8F8',
        borderRadius: 15,
        flexDirection: 'row',
        // paddingHorizontal: 30,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputText: {
        color: 'gray',
        width: '100%',
        
    },
    inputText2: {
        color: 'gray',
        width: '75%',
        marginLeft: -5

    },
    MainContainer: {
        flex: 1,
        alignItems: 'center',
    },

    subContainer: {
        height: width/1.2,
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 200,
        borderBottomEndRadius: 200,
        overflow: 'hidden',

    },

    childView: {
        flex: 1,
        transform: [{ scaleX: 0.5 }],
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40
    },

    text: {
        fontSize: 28,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    top1: {
        backgroundColor: MasterColor.Primary(),
        height: width / 1.2,
        width: width / 1.2,
        borderRadius: width / 2,
        top: -width / 2
    },
    top2: {
        backgroundColor: MasterColor.Green(),
        height: width / 1.4,
        width: width / 1.4,
        borderRadius: width / 2,
        top: -width / 0.90,
        left: -100
    },
})