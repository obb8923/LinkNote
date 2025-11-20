import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingScreen } from "@features/Setting/screens/SettingScreen";
const Stack = createNativeStackNavigator<SettingStackParamList>();
export type SettingStackParamList = {
  Setting: undefined;
};

export const SettingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};