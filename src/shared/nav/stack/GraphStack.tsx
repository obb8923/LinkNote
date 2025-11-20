import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GraphScreen } from "@features/Graph/screens/GraphScreen";
import { PersionDetailScreen } from "@features/PersonDetail/screens/PersionDetailScreen";
const Stack = createNativeStackNavigator<GraphStackParamList>();

export type GraphStackParamList = {
 Graph:undefined,
 PersionDetail:{ personId: string },
};

export const GraphStack = () => {
    return (
        <Stack.Navigator 
        screenOptions={{headerShown:false}}
        initialRouteName="Graph">

            <Stack.Screen name="Graph" component={GraphScreen} />
            <Stack.Screen name="PersionDetail" component={PersionDetailScreen} />
        </Stack.Navigator>  
    )
}
