import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PeopleScreen } from "@features/People/screens/PeopleScreen";
import { PersionDetailScreen } from "@features/PersonDetail/screens/PersionDetailScreen";
import { AddPersonScreen } from "@features/AddPerson/screens/AddPersonScreen";
import { AddRelationScreen } from "@features/AddRelation/screens/AddRelationScreen";
import { PersonDetailEditScreen } from "@features/PersonDetail/screens/PersonDetailEditScreen";

export type PeopleStackParamList = {
 People:undefined,
 PersionDetail:{ personId: string },
 AddPerson:undefined,
 AddRelation:{ sourcePersonId?: string } | undefined,
 PersonDetailEdit:{ personId: string },
};

const Stack = createNativeStackNavigator<PeopleStackParamList>();

export const PeopleStack = () => {
    return (
        <Stack.Navigator 
        screenOptions={{headerShown:false}}
        initialRouteName="People">

            <Stack.Screen name="People" component={PeopleScreen} />
            <Stack.Screen name="PersionDetail" component={PersionDetailScreen} />
            <Stack.Screen name="AddPerson" component={AddPersonScreen} />
            <Stack.Screen name="AddRelation" component={AddRelationScreen} />
            <Stack.Screen name="PersonDetailEdit" component={PersonDetailEditScreen} />
        </Stack.Navigator>  
    )
}
