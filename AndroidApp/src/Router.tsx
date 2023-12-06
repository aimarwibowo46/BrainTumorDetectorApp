import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Icon from 'react-native-vector-icons/Feather'
import IconM from 'react-native-vector-icons/MaterialIcons'
// import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { AnimatedTabBarNavigator, DotSize, TabElementDisplayOptions } from 'react-native-animated-nav-tab-bar'
import { MasterColor } from './components/Colors';
import { Alert, TouchableOpacity } from 'react-native';
import { GenService } from './services/gen/GenServices';
import Register from './pages/Register';


const TabButton = AnimatedTabBarNavigator()
const Stack = createStackNavigator();

const TabBarIcon = (props: any) => {
    return (
        <Icon
            name={props.name}
            size={props.size ? props.size : 24}
            color={props.tintColor}
        />
    )
}

export default function Router() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'Welcome'}>
                <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
