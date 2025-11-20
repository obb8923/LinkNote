import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingStack } from "@nav/stack/OnboardingStack";
import { AppTab } from "@nav/tab/AppTab";
const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootStackParamList = {
  OnboardingStack:undefined,
  AppTab:undefined,
}

export const RootStack = () => {
  return (
    <Stack.Navigator 
    screenOptions={{headerShown:false}}
    initialRouteName="AppTab">
            {/* <Stack.Screen name="OnboardingStack" component={OnboardingStack}/> */}
            <Stack.Screen name="AppTab" component={AppTab}/>
           </Stack.Navigator>
  );
};