import { NavigationContainer } from '@react-navigation/native'
import {RootStack} from '@nav/stack/RootStack'

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  )
}
