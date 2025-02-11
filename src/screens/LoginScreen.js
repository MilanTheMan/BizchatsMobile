import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Login screen
const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput style={styles.input} placeholder="Username/E-mail Address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.replace('HomeScreen')}
      >
        <Text style={styles.loginButtonText}>LOG IN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  input: { width: '90%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', backgroundColor: '#fff' },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signUpText: { marginTop: 20, color: '#007AFF', fontSize: 14 },
});

export default LoginScreen;