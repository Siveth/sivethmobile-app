import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const ComprasScreen = () => {
  const [compras, setCompras] = useState([]);
  const route = useRoute();
  const { email } = route.params;

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const response = await axios.get('https://back-end-siveth-g8vc.vercel.app/api/ComprasEmail', {
          params: { email: email }
        });
        setCompras(response.data);
      } catch (error) {
        console.error('Error al obtener las compras:', error.message);
      }
    };

    // Obtener datos inicialmente
    obtenerCompras();

    // Establecer intervalo para actualizar datos cada 10 segundos
    const intervalId = setInterval(obtenerCompras, 10000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [email]);

  const activarNotificaciones = async () => {
    compras.forEach(compra => {
      const eventDate = new Date(compra.fecha);
      // Ajustar la fecha para que sea un día antes
      eventDate.setDate(eventDate.getDate() - 1);
      const now = new Date();
      const timeDifference = eventDate - now;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  
      if (daysDifference <= 0) { // Si el evento ya pasó, no programar notificación
        return;
      }
  
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de Evento',
          body: `El evento de ${compra.tipo_servicio} está cerca. Fecha: ${eventDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}`,
        },
        trigger: {
          seconds: 60, // Cada 2 minutos
          repeats: true,
        },
      });
    });
    Alert.alert('Notificaciones activadas');
  };
  

  const cancelarNotificaciones = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Notificaciones canceladas');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.tipoServicio}>Tipo de Servicio: {item.tipo_servicio}</Text>
      <Text style={styles.correoUsuario}>Correo del Usuario: {item.correo_usuario}</Text>
      <Text style={styles.total}>Total: ${item.total}</Text>
      <Text style={styles.fecha}>Fecha: {new Date(item.fecha).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>
      <FlatList
        data={compras}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={activarNotificaciones}>
          <Text style={styles.buttonText}>Activar Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelarNotificaciones}>
          <Text style={styles.buttonText}>Cancelar Notificaciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#177CC6',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // Space for buttons
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  tipoServicio: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  correoUsuario: {
    fontSize: 16,
  },
  total: {
    fontSize: 16,
  },
  fecha: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  flatListContainer: {
    paddingBottom: 100, // Space for the buttons
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#177CC6',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ComprasScreen;
