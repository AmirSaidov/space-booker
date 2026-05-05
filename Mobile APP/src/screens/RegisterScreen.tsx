import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Mail, Lock, User, ChevronLeft } from "lucide-react-native";

interface RegisterScreenProps {
  onRegister: (payload: any) => void | Promise<void>;
  onLoginNav: () => void;
}

export default function RegisterScreen({ onRegister, onLoginNav }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    if (password !== confirmPassword) {
      throw new Error("Пароли не совпадают");
    }
    setSubmitting(true);
    try {
      await onRegister({ name, email, password });
    } catch (err: any) {
      // IndexScreen shows the toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onLoginNav}>
        <ChevronLeft color="#fafafa" size={20} />
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Регистрация</Text>
        <Text style={styles.subtitle}>
          Создайте аккаунт, чтобы начать бронировать места
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User color="#a1a1aa" size={20} style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Имя"
            placeholderTextColor="#a1a1aa"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail color="#a1a1aa" size={20} style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            placeholderTextColor="#a1a1aa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color="#a1a1aa" size={20} style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#a1a1aa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color="#a1a1aa" size={20} style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Повторите пароль"
            placeholderTextColor="#a1a1aa"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, submitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#0a0a0a" />
          ) : (
            <Text style={styles.buttonText}>Создать аккаунт</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Уже есть аккаунт? </Text>
        <TouchableOpacity onPress={onLoginNav}>
          <Text style={styles.registerText}>Войти</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: -8,
  },
  backText: {
    color: '#fafafa',
    fontSize: 16,
    marginLeft: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    height: 48,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 16,
    color: '#fafafa',
    fontSize: 14,
  },
  button: {
    height: 48,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  registerText: {
    fontSize: 14,
    color: '#fafafa',
    fontWeight: '600',
  },
});
