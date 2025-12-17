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
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useUser } from '@/contexts/UserContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // Removed focusedInput state to prevent re-renders on focus
    const { login } = useUser();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const { error } = await login(email, password);

        setIsLoading(false);
        if (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            alert(error.message);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient
                colors={['#0f172a', '#1e40af', '#3b82f6']}
                locations={[0, 0.7, 1]}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="always" // CHANGED: always persist taps
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.header}>
                            <View style={styles.iconCircle}>
                                <LinearGradient
                                    colors={['#60a5fa', '#3b82f6']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <Ionicons name="boat" size={40} color="white" />
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue to Coastal Mandi</Text>
                        </View>

                        <View style={styles.form}>
                            {/* Email Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="white"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color="white"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={'rgba(255,255,255,0.8)'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleLogin}
                                activeOpacity={0.85}
                                disabled={isLoading}
                            >
                                <View style={styles.submitBtn}>
                                    <LinearGradient
                                        colors={['#60a5fa', '#2563eb']}
                                        style={StyleSheet.absoluteFill}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.submitBtnText}>Sign In</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" />
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => router.replace('/signup')}>
                            <Text style={styles.footerText}>
                                Don't have an account?{' '}
                                <Text style={styles.footerLink}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 40,
        minHeight: height,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
    },
    form: {
        gap: 0,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)', // Static border
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: 14,
        marginBottom: 24,
    },
    forgotText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
    },
    submitBtn: {
        flexDirection: 'row',
        height: 58,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        overflow: 'hidden',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
        zIndex: 1,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    footerLink: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
    },
});
