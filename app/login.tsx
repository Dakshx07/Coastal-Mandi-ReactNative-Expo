import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useUser } from '@/contexts/UserContext';


export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useUser();

    const handleLogin = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Extract name from email (before @)
        const name = email.split('@')[0] || 'Coastal User';
        login(name, email); // Store user data
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#0c1929', '#1e3a5f', '#0ea5e9']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >


                    {/* Icon & Title */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 100, type: 'timing', duration: 500 }}
                        style={styles.header}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name="boat" size={36} color="#0ea5e9" />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to Coastal Mandi</Text>
                    </MotiView>

                    {/* Form */}
                    <MotiView
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200, type: 'timing', duration: 500 }}
                        style={styles.form}
                    >
                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#7dd3fc" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor="#7dd3fc"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#7dd3fc" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#7dd3fc"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#7dd3fc"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleLogin}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.submitBtnText}>Sign In</Text>
                            <Ionicons name="arrow-forward" size={20} color="#0c1929" />
                        </TouchableOpacity>
                    </MotiView>

                    {/* Footer */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 400, type: 'timing', duration: 500 }}
                        style={styles.footer}
                    >
                        <TouchableOpacity onPress={() => router.replace('/signup')}>
                            <Text style={styles.footerText}>
                                Don't have an account?{' '}
                                <Text style={styles.footerLink}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c1929',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backBtn: {
        // ... (removed)
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(14, 165, 233, 0.3)',
    },
    title: {
        color: 'white',
        fontSize: 26,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#7dd3fc',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        color: '#7dd3fc',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    submitBtn: {
        flexDirection: 'row',
        backgroundColor: '#0ea5e9',
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    submitBtnText: {
        color: '#0c1929',
        fontSize: 17,
        fontFamily: 'Outfit_700Bold',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        color: '#7dd3fc',
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    footerLink: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
    },
});
