import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Signup screen
const SignUpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="E-mail Address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true} />
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.replace('HomeScreen')}
      >
        <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  input: { width: '90%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', backgroundColor: '#fff' },
  signUpButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: { marginTop: 20, color: '#007AFF', fontSize: 14 },
});

export default SignUpScreen;