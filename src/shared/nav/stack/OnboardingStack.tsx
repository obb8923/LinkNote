import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingScreen } from "@features/Onboarding/Screens/OnboardingScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export type OnboardingStackParamList = {
 Onboarding:undefined,

};

export const OnboardingStack = () => {
    return (
        <Stack.Navigator 
        screenOptions={{headerShown:false}}
        initialRouteName="Onboarding">

            <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        </Stack.Navigator>  
    )
}
