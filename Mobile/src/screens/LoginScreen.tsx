import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";

interface LoginScreenProps {
  onLogin: (payload: { email: string; password: string }) => void | Promise<void>;
  onRegister: () => void;
  onForgot: () => void;
}

export default function LoginScreen({ onLogin, onRegister, onForgot }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onLogin({ email, password });
    } catch (err: any) {
      // IndexScreen shows the toast
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Вход в систему</Text>
        <Text style={styles.subtitle}>
          Войдите, чтобы забронировать{"\n"}рабочее место
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/login-illustration.png')} 
          style={styles.illustration} 
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
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
            placeholder="••••••••"
            placeholderTextColor="#a1a1aa"
            secureTextEntry={!showPwd}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={styles.iconRight}>
            {showPwd ? <EyeOff color="#a1a1aa" size={20} /> : <Eye color="#a1a1aa" size={20} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, submitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#0a0a0a" />
          ) : (
            <Text style={styles.buttonText}>Войти</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onForgot} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Забыли пароль?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Нет аккаунта? </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.registerText}>Регистрация</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    lineHeight: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  illustration: {
    width: 220,
    height: 220,
  },
  form: {
    gap: 12,
    marginTop: 8,
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
  iconRight: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  input: {
    height: 48,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 44,
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
  forgotBtn: {
    alignSelf: 'center',
    marginTop: 4,
    padding: 8,
  },
  forgotText: {
    fontSize: 12,
    color: '#fafafa',
  },
  footer: {
    marginTop: 24,
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
