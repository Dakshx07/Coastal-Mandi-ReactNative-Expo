import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/services/supabase';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (authError) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setError(authError.message);
                setLoading(false);
                return;
            }

            // Success - go directly to home
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/(tabs)');
        } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#0b0f19', '#111827']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header with Back */}
                        <View style={styles.headerRow}>
                            <TouchableOpacity
                                style={styles.backBtn}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Create Account</Text>
                            <View style={{ width: 40 }} />
                        </View>

                        {/* Logo Section */}
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 700 }}
                            style={styles.logoContainer}
                        >
                            <LinearGradient
                                colors={['#22c55e', '#15803d']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.logoBox}
                            >
                                <FontAwesome5 name="user-plus" size={28} color="white" />
                            </LinearGradient>
                        </MotiView>

                        {/* Title */}
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 800, delay: 100 }}
                            style={styles.titleContainer}
                        >
                            <Text style={styles.welcomeText}>Join Coastal Mandi</Text>
                            <Text style={styles.subText}>
                                Create your account to access real-time fish market rates and AI predictions.
                            </Text>
                        </MotiView>

                        {/* Form */}
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 900, delay: 200 }}
                            style={styles.formContainer}
                        >
                            {/* Error Message */}
                            {error && (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle" size={18} color="#ef4444" />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {/* Name Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#64748b"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        setError(null);
                                    }}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor="#64748b"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError(null);
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#64748b"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setError(null);
                                    }}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#64748b"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setError(null);
                                    }}
                                    secureTextEntry={!showPassword}
                                />
                            </View>

                            {/* Signup Button */}
                            <TouchableOpacity
                                onPress={handleSignup}
                                activeOpacity={0.8}
                                style={styles.buttonContainer}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#22c55e', '#15803d']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Create Account</Text>
                                            <Ionicons name="checkmark-circle" size={20} color="white" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.footerLink}
                                onPress={() => router.replace('/login')}
                            >
                                <Text style={styles.footerText}>
                                    Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0f19',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoBox: {
        width: 72,
        height: 72,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    welcomeText: {
        fontSize: 26,
        fontFamily: 'Outfit_700Bold',
        color: '#f8fafc',
        marginBottom: 8,
    },
    subText: {
        textAlign: 'center',
        color: '#94a3b8',
        fontFamily: 'Outfit_400Regular',
        fontSize: 15,
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    formContainer: {
        gap: 16,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#450a0a',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    errorText: {
        color: '#fca5a5',
        fontSize: 14,
        flex: 1,
        fontFamily: 'Outfit_500Medium',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#334155',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#f8fafc',
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
    },
    buttonContainer: {
        marginTop: 8,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    button: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Outfit_700Bold',
    },
    footerLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    linkHighlight: {
        color: '#22c55e',
        fontFamily: 'Outfit_700Bold',
    },
});
