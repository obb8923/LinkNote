import './global.css';
import '@i18n/index';
import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import { AppNavigation } from '@nav/index';
import { useInitStore } from '@stores/initStore';

export default function App() {
  const initialize = useInitStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PortalProvider>
          <View style={{flex:1}}>
            <StatusBar barStyle="dark-content" translucent={true}/>
            <AppNavigation />
          </View>
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}