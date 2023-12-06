import { View, StyleSheet, Text, SafeAreaView, 
    Dimensions, StatusBar, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView,
    ActivityIndicator, Image, Pressable, Alert } from 'react-native';
import React, { useState,useEffect,useRef } from 'react'
import { MasterColor } from '../components/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { GenService } from '../services/gen/GenServices';
import { ApiServices } from '../services/api/ApiServices';
import { MqttService } from '../services/mqtt/mqttService';
import moment from 'moment';
import { BlurView } from "@react-native-community/blur";
import DatePicker from 'react-native-date-picker'
import RBSheet from "react-native-raw-bottom-sheet";
const { width } = Dimensions.get('screen')

export default function HistoryFilter(props: any) {
    const [date, setDate] = useState(new Date())
    const [dateTo, setDateTo] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [LoadingEdit, setLoadingEdit] = useState(false)
    const [DataList, setDataList] = useState([])
    const [Selected, setSelected] = useState({})
    const [Loading, setLoading] = useState(false)
    const [EditName, setEditName] = useState('')
    const [LoadingDelete, setLoadingDelete] = useState(false)
    const refRBSheet :any = useRef();

    useEffect(() => {
        getData()
    }, [])

    const del = (id:any) => {
        Alert.alert('Delete History', 'Anda yakin ingin delete history ini ?', [
            {
                text: 'Tidak',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Ya', onPress: () => {
                    let body = {
                        id : id
                    }
                    setLoadingDelete(true)
                    ApiServices.post(body, '/delete-history').then((resp)=>{
                        if(resp){
                            setLoadingDelete(false);
                            getData()
                        }
                    })
                }
            },
        ]);
    }

    const getData = () => {
        setLoading(true);
        ApiServices.GetData('/list-history').then((resp)=>{
            if(resp){
                setLoading(false);
                let datas = resp.data;
                setDataList(datas)
            }
        })
    }

    const editSubmit = () => {
        let sel : any = Selected
        let body = {
            history : EditName,
            id: sel.id,
            tgl: sel.tgl,
            jam: sel.jam,
            timer : sel.timer,
            waktu_pengeringan: sel.waktu_pengeringan,
            temperature_awal : sel.temperature_awal,
            temperature_akhir: sel.temperature_akhir,
            suhu_awal: sel.suhu_awal,
            suhu_akhir: sel.suhu_akhir
        }
        console.log(`body`, body);
        setLoadingEdit(true)
        ApiServices.post(body,'/update-history').then((resp)=>{
            if(resp){
                setLoadingEdit(false)
                refRBSheet.current.close()
                getData()
            }
        })
        
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
                        <Text style={{ color:'black',fontWeight:'bold',fontSize:18,textAlign :'center',marginBottom:15}}>History Set Pengering</Text>

                        <View style={{flexDirection:'row',marginBottom:width/2.5}}>
                            <View style={{ flexDirection:'row',marginTop:5 }}>
                                <Text style={{ color:'black',marginRight:5 }}> {moment(date).format('DD-MM-YY')}</Text>
                                <TouchableOpacity onPress={()=>setOpen(true)}>
                                    <Icon name='calendar' size={17} color={'black'}/>
                                </TouchableOpacity>
                                
                                <DatePicker
                                    modal
                                    mode='date'
                                    open={open}
                                    date={date}
                                    onConfirm={(date) => {
                                        setOpen(false)
                                        setDate(date)
                                    }}
                                    onCancel={() => {
                                        setOpen(false)
                                    }}
                                />
                            </View>

                            <View style={{ flexDirection:'row',marginLeft:10,marginTop:5 }}>
                                <Text style={{ color:'black',marginRight:5 }}>To : {moment(date).format('DD-MM-YY')}</Text>
                                <TouchableOpacity onPress={() => setOpenTo(true)}>
                                    <Icon name='calendar' size={17} color={'black'}/>
                                </TouchableOpacity>
                                
                                <DatePicker
                                    modal
                                    mode='date'
                                    open={openTo}
                                    date={date}
                                    onConfirm={(date) => {
                                        setOpenTo(false)
                                        setDateTo(date)
                                    }}
                                    onCancel={() => {
                                        setOpenTo(false)
                                    }}
                                />
                            </View>

                            <TouchableOpacity onPress={()=>getData()} style={styles.btnSearch}>
                                <Text style={{ color:'white',fontWeight:'bold' }}>Search</Text>
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

                    <ScrollView style={{ marginHorizontal:15 }}>
                        {!Loading && DataList.length == 0 && 
                            <View style={{ alignItems:'center',justifyContent:'center',marginTop:width/3}}>
                                <Text style={{ color:'black' }}>Belum ada history</Text>
                            </View>
                        }
                        {Loading ? 
                        <View style={{ alignSelf:'center',marginTop:width/3,alignItems:'center',justifyContent:'center' }}>
                            <ActivityIndicator size={45} color={'black'}/>
                            <Text style={{ color:'black' }}>Loading..</Text>
                        </View>
                        
                        :
                        <>
                        {DataList.map((v:any,k:any)=>(
                            <View style={{ zIndex:10 }}>
                                <View style={{ height: 1, backgroundColor: 'black', width: width / 1.2, marginVertical: 5 }} />
                                <View style={styles.row}>
                                    <View style={{ flexDirection:'row' }}>
                                        <TouchableOpacity style={{ marginTop: 7 }} onPress={() => {
                                            setSelected(v)
                                            refRBSheet.current.open()
                                            }}>
                                            <Icon name='create-outline' size={20} color={'green'}/>
                                        </TouchableOpacity>
                                        <Text style={[styles.textHeader, { width: '60%', marginTop: 7 }]}>{v.history}</Text>
                                    </View>
                                    

                                    <TouchableOpacity onPress={()=>del(v.id)} style={{ flexDirection:'row' }}>
                                        <Icon name='trash' size={16} color={'red'}/>
                                        <Text style={{ color:'red' }}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Tanggal</Text>
                                    <Text style={[styles.textRow]}>{v.tgl}</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Jam</Text>
                                    <Text style={[styles.textRow]}>{v.jam}</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Timer</Text>
                                    <Text style={[styles.textRow]}>{v.timer}</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Waktu pengeringan</Text>
                                    <Text style={[styles.textRow]}>{v.waktu_pengeringan}</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Kadara Air Awal</Text>
                                    <Text style={[styles.textRow]}>{v.temperature_awal}%</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Kadara Air Akhir</Text>
                                    <Text style={[styles.textRow]}>{v.temperature_akhir}%</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Suhu Awal</Text>
                                    <Text style={[styles.textRow]}>{v.suhu_awal}°C</Text>
                                </View> 
                                <View style={styles.row}>
                                    <Text style={[styles.textRow]}>Kadara Air Akhir</Text>
                                    <Text style={[styles.textRow]}>{v.suhu_akhir}°C</Text>
                                </View> 

                            </View>
                           
                        ))}
                        </>}
                    </ScrollView>
                </View>
            </SafeAreaView>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={width /1.5}
                customStyles={{
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                    }}
                >
                <View style={{ padding: 20 }}>
                    <Text style={{ color:'black',textAlign:'center',fontWeight:'bold' }}>Edit Nama History</Text>

                    <View>
                        <TextInput onChangeText={(v)=>setEditName(v)} placeholder='Nama History' style={styles.input1}/>
                    </View>
                    {LoadingEdit ? 
                        <View>
                            <ActivityIndicator size={40} color={'black'}/>
                        </View>:
                    
                    <View style={{ marginTop:50,flexDirection:'row',justifyContent:'space-around' }}>
                        <TouchableOpacity onPress={()=>refRBSheet.current.close()} style={[styles.btnLogin,{backgroundColor:'gray'}]}>
                            <Text style={[styles.textLogin]}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>editSubmit()} style={styles.btnLogin}>
                            <Text style={styles.textLogin}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>}

                </View>
            </RBSheet>
           
        </View>
    )
}

const styles = StyleSheet.create({
    btnSearch:{
        alignItems:'center',
        height:30,
        backgroundColor:MasterColor.Primary(),
        justifyContent:'center',
        borderRadius : 15,
        width: 70,
        marginLeft:10
    },
    textRow:{
        color:'black'
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical:4
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
        width: width / 2.5,
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