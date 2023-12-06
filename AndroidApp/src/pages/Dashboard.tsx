import { View, StyleSheet, Text, SafeAreaView, 
    Dimensions, StatusBar, TextInput, KeyboardAvoidingView, TouchableOpacity, 
    ActivityIndicator, Image, Pressable, Alert, PermissionsAndroid } from 'react-native';
import React, { useState,useEffect,useRef } from 'react'
import { MasterColor } from '../components/Colors';
import { GenService } from '../services/gen/GenServices';
import { ApiServices } from '../services/api/ApiServices';
const { width } = Dimensions.get('screen')
import ImagePicker, {
    launchCamera,
    launchImageLibrary,
} from 'react-native-image-picker';

export default function Dashboard(props: any) {

    const intervalRef : any = useRef(null);
    const [ImageData, setImageData] = useState('')
    const [ImageDataUpload, setImageDataUpload] = useState({})
    const [Resp, setResp] = useState({ predict :''})
    const [isLoadingImage, setisLoadingImage] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [IsData, setIsData] = useState(false)


    useEffect(() => {

    }, [])

    const takeFoto = () => {
        Alert.alert(
            "Take Image",
            "Please choose image source ",
            [
                {
                    text: "CAMERA",
                    onPress: () => chooseImage('camera'),

                },
                {
                    text: "GALLERY", onPress: () => {
                        chooseImage('gallery')
                    }
                }
            ]
        );
    }

    const chooseImage = async (method: any) => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission given");
                if (method === 'camera') {
                    Camera()
                } else {
                    fromGallery()
                }
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }

    }

    const Camera = () => {
        setisLoadingImage(true)
        let options = {
            maxHeight: 550,
            maxWidth: 440,
            // quality: Quality,
            includeBase64: false,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchCamera(options, (response: any) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                Alert.alert(response.customButton);
            } else {
                console.log(`response.assets[0]`, response.assets[0].uri);
                setImageData(response.assets[0].uri)
                setImageDataUpload(response.assets[0])
                setisLoadingImage(false)
            }
        });
    }

    const fromGallery = () => {
        setisLoadingImage(true)
        let options = {
            maxHeight: 550,
            maxWidth: 440,
            // quality: Quality,
            includeBase64: false,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response: any) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                // alert(response.customButton);
                Alert.alert(response.customButton);
            } else {
                console.log('res galery', response);
                if (response) {
                    setImageData(response.assets[0].uri)
                    setImageDataUpload(response.assets[0])
                    setisLoadingImage(false)
                }
            }
        });

    }

    const submit = () => {
        setLoading(true)
        let body = {
            images : ImageDataUpload
        }

        ApiServices.upload(body).then((res)=>{
            let response = JSON.parse(res.data)
            console.log(`res`, response);
            if(response){
                setLoading(false);
                if(response.status == 'success'){
                    let resp_data = response.data
                    if (resp_data.predict == 'No Tumor'){

                    }else{

                    }
                    setResp(response.data)
                    setIsData(true)
                }else{
                    GenService.alertErr(response.message)
                }
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
                        <Text style={{ color:'black',fontWeight:'bold',fontSize:18,textAlign :'center'}}>Brain Tumor Detector</Text>
                        <View style={{ flexDirection:'row',justifyContent:'space-evenly',width:width,marginTop:20 }}>
                            <View style={{ alignItems:'center' }}>
                
                                    <Image source={require('../assets/imgs/home_image.png')} style={{ width: width, height: width/2, resizeMode: 'contain' }} />

                                
                            </View>
                    
                        </View>
                       

                    </View>

                </View>
                
                <View style={{ backgroundColor:'#f6f6f6',width:width/1.1,height:width/1.1,marginTop:20,borderRadius:15,paddingTop:10 }}>
                    {IsData ?
                        <View>
                        <View style={{ 
                            margin: 10,
                                backgroundColor:'#EFF0E9',
                            borderRadius:15,
                            padding:10,
                            height:width/2,
                            borderWidth:2,
                            borderColor: MasterColor.blue()
                         }}>
                            <Text style={{ color:'black',fontWeight:'bold',fontSize:20 }}>Result</Text>
                            <View style={{ alignItems:'center' }}>
                                {Resp.predict == 'No Tumor' ? <Image source={require('../assets/imgs/info.png')} style={{ height: 70, width: 70 }} /> :
                                    <Image source={require('../assets/imgs/warning.png')} style={{ height: 70, width: 70 }} />}
                                <Text style={{ fontSize: 27, fontWeight: 'bold', color: Resp.predict == 'No Tumor'?'green':'orange' }}>{Resp.predict} </Text>
                            </View>
                        </View>
                            <TouchableOpacity style={[styles.btn,{alignSelf:'center',width:width/1.2,borderRadius:15}]} 
                            onPress={() => {
                                setIsData(false)
                                setImageData('')
                                }}>
                                {Loading ? <ActivityIndicator size={35} color={'white'} /> :
                                    <Text style={styles.textLogin}>Re-Take</Text>}
                            </TouchableOpacity>
                        </View>
                        :
                    
                    <View style={{ alignSelf: 'center', marginTop: 20 }}>
                        {ImageData!=''?
                            <View>
                                <Image source={{ uri: ImageData }} style={{ width:width/1.5,height:width/1.5 }} />
                                <TouchableOpacity style={[styles.btn]} onPress={() => submit()}>
                                    {Loading?<ActivityIndicator size={35} color={'white'}/>:
                                    <Text style={styles.textLogin}>SUBMIT</Text>}
                                </TouchableOpacity>
                            </View>:
                            <TouchableOpacity style={styles.btnLogin} onPress={() => takeFoto()}>
                                <Image source={require('../assets/imgs/upload.png')} style={{
                                    width: width / 3,
                                    height: width / 3,
                                    resizeMode: 'contain',
                                    marginBottom: 10,
                                }} />
                                <Text style={styles.textLogin}>TAKE BRAIN IMAGE</Text>
                            </TouchableOpacity>
                        }
                    </View>}
                 
                    
               
                </View>
              

            </SafeAreaView>
           
           
        </View>
    )
}

const styles = StyleSheet.create({
    btnLogout:{
        position:'absolute',
        zIndex:1,
        bottom:-20,
        right:20
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
        backgroundColor: MasterColor.blue(),
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
        padding:30,
        width: width / 1.5,
        backgroundColor: MasterColor.purple(),
        elevation: 4,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        height:45,
        width: width / 1.5,
        backgroundColor: MasterColor.purple(),
        elevation: 4,
        marginTop:5,
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
        flex: 5,
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