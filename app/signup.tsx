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

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#0b0f19', '#111827', '#0f172a']}
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
                    {/* Header */}
                    <MotiView
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ type: 'timing', duration: 400 }}
                    >
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
                        </TouchableOpacity>
                    </MotiView>

                    {/* Title */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 100, type: 'timing', duration: 500 }}
                        style={styles.header}
                    >
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join the coastal community</Text>
                    </MotiView>

                    {/* Form */}
                    <MotiView
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200, type: 'timing', duration: 500 }}
                        style={styles.form}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#475569"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#475569"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password"
                                    placeholderTextColor="#475569"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#64748b"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleSignUp}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#0ea5e9', '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitBtnGradient}
                            >
                                <Text style={styles.submitBtnText}>Create Account</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>

                    {/* Footer */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 400, type: 'timing', duration: 500 }}
                        style={styles.footer}
                    >
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                                <Text style={styles.footerLink}>Sign In</Text>
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
        backgroundColor: '#0b0f19',
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
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#64748b',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#334155',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    submitBtn: {
        marginTop: 12,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    submitBtnGradient: {
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    footerLink: {
        color: '#3b82f6',
        fontFamily: 'Outfit_700Bold',
    },
});
