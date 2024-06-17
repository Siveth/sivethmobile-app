import React, { useEffect } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';

import LoginScreen from '../../components/navigation/LoginScreen'; // Asumiendo la ruta correcta
import ComprasScreen from '../../components/navigation/Compras';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App: React.FC = () => {
  useEffect(() => {
    const obtenerPermisosNotificaciones = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          alert('Please grant notification permissions');
        }
      }
    };

    obtenerPermisosNotificaciones().catch(err => {
      console.log(err);
    });
  }, []);

  return (
    
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Compras" component={ComprasScreen} />
        {/* Agrega otras pantallas aquí */}
      </Stack.Navigator>
    
  );
};

export default App;
