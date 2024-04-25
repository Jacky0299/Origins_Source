import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Login, Signup, Welcome, Home, Splash, DisclaimerScreen } from "../screens";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  
  return isLoading ? <Splash setIsLoading = {setIsLoading}/> :(
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName='Disclaimer'
      >
        <Stack.Screen
          name="Disclaimer"
          component={DisclaimerScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        {/* <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false
          }}
        /> */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}