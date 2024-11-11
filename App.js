import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Image, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { initDatabase, registerUser, loginUser } from './utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        address: '',
        profilePicture: '',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    useEffect(() => {
        initDatabase();
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const status = await AsyncStorage.getItem('isLoggedIn');
        if (status === 'true') {
            const storedUserInfo = await AsyncStorage.getItem('userInfo');
            if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
            setIsLoggedIn(true);
        }
    };

    const handleSubmit = async () => {
        const { username, password, firstName, lastName, email, contactNumber, address, profilePicture } = userInfo;

        if (!username || !password || (!isLogin && (!firstName || !lastName || !email || !contactNumber || !address))) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            if (isLogin) {
                const success = await loginUser(username, password);
                if (success) {
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                    setIsLoggedIn(true);
                    Alert.alert('Success', 'Logged in successfully');
                } else {
                    Alert.alert('Error', 'Invalid credentials');
                }
            } else {
                await registerUser(userInfo);
                Alert.alert('Success', 'Registration successful');
                setIsLogin(true);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUserInfo({
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            address: '',
            profilePicture: '',
        });
    };

    const handleEditProfile = () => setIsEditingProfile(!isEditingProfile);

    const handleSaveProfile = async () => {
        setIsEditingProfile(false);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        Alert.alert('Success', 'Profile updated');
    };

    if (isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loggedInContainer}>
                    {userInfo.profilePicture ? (
                        <Image source={{ uri: userInfo.profilePicture }} style={styles.avatar} />
                    ) : (
                        <Text>No Profile Picture</Text>
                    )}
                    {isEditingProfile ? (
                        <View>
                            <TextInput style={styles.input} placeholder="First Name" value={userInfo.firstName} onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })} />
                            <TextInput style={styles.input} placeholder="Last Name" value={userInfo.lastName} onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })} />
                            <TextInput style={styles.input} placeholder="Email" value={userInfo.email} onChangeText={(text) => setUserInfo({ ...userInfo, email: text })} />
                            <TextInput style={styles.input} placeholder="Contact Number" value={userInfo.contactNumber} onChangeText={(text) => setUserInfo({ ...userInfo, contactNumber: text })} />
                            <TextInput style={styles.input} placeholder="Address" value={userInfo.address} onChangeText={(text) => setUserInfo({ ...userInfo, address: text })} />
                            <TextInput style={styles.input} placeholder="Profile Picture URL" value={userInfo.profilePicture} onChangeText={(text) => setUserInfo({ ...userInfo, profilePicture: text })} />
                            <Button title="Save Profile" onPress={handleSaveProfile} />
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.infoText}>First Name: {userInfo.firstName}</Text>
                            <Text style={styles.infoText}>Last Name: {userInfo.lastName}</Text>
                            <Text style={styles.infoText}>Email: {userInfo.email}</Text>
                            <Text style={styles.infoText}>Contact Number: {userInfo.contactNumber}</Text>
                            <Text style={styles.infoText}>Address: {userInfo.address}</Text>
                            <Button title="Edit Profile" onPress={handleEditProfile} />
                        </View>
                    )}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>

                    <TextInput style={styles.input} placeholder="Username" value={userInfo.username} onChangeText={(text) => setUserInfo({ ...userInfo, username: text })} />
                    <TextInput style={styles.input} placeholder="Password" value={userInfo.password} onChangeText={(text) => setUserInfo({ ...userInfo, password: text })} secureTextEntry />

                    {!isLogin && (
                        <>
                            <TextInput style={styles.input} placeholder="First Name" value={userInfo.firstName} onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })} />
                            <TextInput style={styles.input} placeholder="Last Name" value={userInfo.lastName} onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })} />
                            <TextInput style={styles.input} placeholder="Email" value={userInfo.email} onChangeText={(text) => setUserInfo({ ...userInfo, email: text })} />
                            <TextInput style={styles.input} placeholder="Contact Number" value={userInfo.contactNumber} onChangeText={(text) => setUserInfo({ ...userInfo, contactNumber: text })} />
                            <TextInput style={styles.input} placeholder="Address" value={userInfo.address} onChangeText={(text) => setUserInfo({ ...userInfo, address: text })} />
                            <TextInput style={styles.input} placeholder="Profile Picture URL" value={userInfo.profilePicture} onChangeText={(text) => setUserInfo({ ...userInfo, profilePicture: text })} />
                        </>
                    )}

                    <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.switchText}>{isLogin ? 'New user? Create an account' : 'Already have an account? Sign in'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    formContainer: { width: '80%', padding: 20 },
    input: { marginBottom: 15, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },
    mainButton: { padding: 15, backgroundColor: '#1E90FF', borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16 },
    switchButton: { marginTop: 20 },
    switchText: { color: '#1E90FF', fontSize: 14 },
    loggedInContainer: { alignItems: 'center' },
    infoText: { fontSize: 16, marginVertical: 5 },
    logoutButton: { marginTop: 20, backgroundColor: '#FF6347', padding: 10, borderRadius: 5 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});
