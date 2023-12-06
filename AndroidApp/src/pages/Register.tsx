import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Dimensions, StatusBar, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { MasterColor } from '../components/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { GenService } from '../services/gen/GenServices';
import DatePicker from 'react-native-date-picker'

import moment from 'moment';
import { ApiServices } from '../services/api/ApiServices';

const { width, height } = Dimensions.get('window')

export default function Register(props: any) {
    const [Name, setName] = useState('');
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Agama, setAgama] = useState('');
    const [Alamat, setAlamat] = useState('');
    const [password, setpassword] = useState('');
    const [Norek, setNorek] = useState('');

    const [Loading, setLoading] = useState(false)
    const [LoadingForgot, setLoadingForgot] = useState(false)
    const [hidePass, sethidePass] = useState(true)
    const [Eye, setEye] = useState('eye')
    const [date, setDate] = useState(new Date())
    const [TanggalLahir, setTanggalLahir] = useState('Tanggal Lahir')

    const [ListBank, setListBank] = useState([]);
    const [ListBS, setListBS] = useState([]);
    const [ListCus, setListCus] = useState([]);

    const [open, setOpen] = useState(false);
    const [IdBS, setIdBS] = React.useState('Pilih BSID');
    const [IdBank, setIdBank] = React.useState('Pilih Nama Bank');

    useEffect(() => {
        getDatas();
    }, [])

    const getDatas = () => {
       
    }


    const Submit = () => {
        if (Username === '') return GenService.alertErr('Kolom Username tidak boleh kosong')
        if (Name === '') return GenService.alertErr('Kolom nama tidak boleh kosong')
        if (password === '') return GenService.alertErr('Kolom Password tidak boleh kosong')

        let body_data = {
            name : Name,
            username: Username,
            password: password
        }

        setLoading(true)
        console.log(body_data);
        ApiServices.post(body_data,'/register').then((res_c)=>{
            if(res_c){
               setLoading(false);
                GenService.alertSuccess('Register Berhasil silahkan login dengan akun terdaftar !')
                props.navigation.goBack();
            }
        })
       
    }


    return (
        <LinearGradient  colors={MasterColor.BlueLinear()} style={{ flex: 1 }}>
            <ScrollView>
            <View style={styleSheet.MainContainer} >
                <StatusBar translucent barStyle='dark-content' />
                <TouchableOpacity style={styleSheet.back} onPress={() => props.navigation.goBack()}>
                    <Icon name='chevron-back' size={40} color='purple' />
                </TouchableOpacity>
                <View style={styleSheet.subContainer}>
                    <View style={styleSheet.childView}>
                        <View style={{ width: width, paddingHorizontal: 25}}>
                            
                                <View style={{ alignItems: 'center',marginBottom:50 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: MasterColor.Primary() }}>Register </Text>
                                </View>

                                <View style={styleSheet.input1}>
                                    <Icon name='person-outline' size={24} style={styleSheet.icon} />
                                    <TextInput  onChangeText={(v) => setName(v)} style={styleSheet.inputText} placeholder='Nama Lengkap' />
                                </View>

                                <View  style={styleSheet.sparator}/>

                                <View  style={styleSheet.input1}>
                                    <Icon name='person-outline' size={24} style={styleSheet.icon} />
                                    <TextInput  onChangeText={(v) => setUsername(v)} style={styleSheet.inputText} placeholder='Username' />
                                </View>

                                <View  style={styleSheet.input2}>
                                    <Icon name='lock-closed-outline' size={24} style={styleSheet.icon2} />
                                    <TextInput secureTextEntry={hidePass} onChangeText={(v) => setpassword(v)} style={styleSheet.inputText2} placeholder='Password' />
                                </View>
                        </View>
                    </View>

                </View>

                <TouchableOpacity style={styleSheet.btnLogin} onPress={() => Submit()}>
                    {!Loading && <Text style={styleSheet.textLogin}>Submit</Text>}
                    {Loading && <ActivityIndicator size='large' color='white' />}
                </TouchableOpacity>
            </View>
            </ScrollView>

        </LinearGradient>

    );
}

const styleSheet = StyleSheet.create({
    sparator:{
        height:1,
        backgroundColor:'gray',
        width:width/1.2,
        marginVertical:5
    },
    inputSiteNew: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginVertical: 10
    },
    back: {
        position: 'absolute',
        left: 15,
        top: 30,
        zIndex: 10
    },
    inputTtl: {
        marginTop: 10,
        height: 45,
        backgroundColor: '#F7F8F8',
        borderRadius: 15,
        flexDirection: 'row',
        paddingHorizontal: 0,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    btnLogin: {
        height: 50,
        top: -30,
        width: width / 2,
        backgroundColor: MasterColor.Primary(),
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
        // top: 30,
        height: 50,
        backgroundColor: '#F7F8F8',
        borderRadius: 15,
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: MasterColor.Secondary(),
        borderWidth: 2,
        marginVertical: 7,
        color:'black'
    },
    input2: {
        // top: 10,
        marginTop: 10,
        height: 50,
        // width : '100%',
        backgroundColor: '#F7F8F8',
        borderRadius: 15,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingRight: 30,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: MasterColor.Secondary(),
        borderWidth: 2,
        marginVertical: 7,
        color:'black'

    },
    inputText: {
        color: 'black',
        width: '100%',
    },
    inputText2: {
        color: 'gray',
        width: '98%',
    },
    MainContainer: {
        flex: 2,
        alignItems: 'center',
    },

    subContainer: {
        height: height/1.1,
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 200,
        borderBottomEndRadius: 200,
        overflow: 'hidden',

    },

    childView: {
        flex: 1,
        transform: [{ scaleX: 0.5 }],
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 40
    },

    text: {
        fontSize: 28,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },

});