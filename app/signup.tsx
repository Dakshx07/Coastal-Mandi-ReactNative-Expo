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

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // Removed focusedInput state
    const { signup } = useUser();

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            alert('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const { error } = await signup(email, password, name);

        setIsLoading(false);
        if (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            alert(error.message);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            alert('Account created! Please check your email.');
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Solid Background (Teal/Cyan Theme) */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#083344' }]} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.header}>
                            <View style={styles.iconCircle}>
                                <LinearGradient
                                    colors={['#22d3ee', '#0891b2']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <Ionicons name="person-add" size={38} color="white" />
                            </View>
                            <Text style={styles.title}>Join Coastal Mandi</Text>
                            <Text style={styles.subtitle}>Create your account to get started</Text>
                        </View>

                        <View style={styles.form}>
                            {/* Name Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color="white"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Email Input */}
                            <View style={[styles.inputWrapper, { marginTop: 12 }]}>
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

                            <TouchableOpacity
                                onPress={handleSignUp}
                                activeOpacity={0.85}
                                disabled={isLoading}
                            >
                                <View style={styles.submitBtn}>
                                    <LinearGradient
                                        colors={['#22d3ee', '#06b6d4']}
                                        style={StyleSheet.absoluteFill}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.submitBtnText}>Create Account</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" />
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                                <Text style={styles.footerLink}>Sign In</Text>
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
        backgroundColor: '#083344',
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
        marginBottom: 36,
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
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
    },
    submitBtn: {
        flexDirection: 'row',
        height: 58,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 24,
        overflow: 'hidden',
        shadowColor: '#0891b2',
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
        marginTop: 30,
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
