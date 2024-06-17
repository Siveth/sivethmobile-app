import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://back-end-siveth-g8vc.vercel.app/api/loginM', {
        email: correo,
        password: contrasenia
      });

      // Manejar la respuesta del servidor
      console.log(response.data.message); // Esto puede variar dependiendo de la respuesta de tu servidor

      // Si el inicio de sesión es exitoso (código de respuesta 200), redirige a la pantalla de compras
      if (response.status === 200) {
        navigation.navigate('Compras', { email: correo });
      }

      // Puedes realizar acciones adicionales aquí, como mostrar un mensaje de éxito o navegar a la siguiente pantalla si es necesario.
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al intentar iniciar sesión:', error.message);
      Alert.alert('Error', 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginForm}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={(text) => setCorreo(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          value={contrasenia}
          onChangeText={(text) => setContrasenia(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿No tienes una cuenta? <Text style={styles.link}>Regístrate</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#177CC6',
  },
  loginForm: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 5,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    width: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#007bff',
  },
});

export default LoginScreen;
