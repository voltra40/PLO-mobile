// import { NavigationRouteContext } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	GestureResponderEvent,
} from "react-native";
import { auth, firebase } from "../firebase";

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigation = useNavigation();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				navigation.replace("Home");
			}
		});

		return unsubscribe;
	}, []);

	const handleSignUp = () => {
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((response) => {
				const user = response.user;
				const data = {
					id: user.uid,
					email,
					fullName: "temp name",
				};
				const userRef = firebase.firestore().collection("users");
				userRef.doc(user.uid).set(data);
				console.log("Registered with: " + user.email);
			})
			.catch((error) => alert(error.message));
	};

	const handleLogin = () => {
		auth
			.signInWithEmailAndPassword(email, password)
			.then((response) => {
				console.log("Logged in with: " + response.user.email);
			})
			.catch((error) => alert(error.message));
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					style={styles.input}
					secureTextEntry
				/>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={handleLogin} style={styles.button}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleSignUp} style={styles.button}>
					<Text style={styles.buttonText}>Register</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	inputContainer: {
		width: "80%",
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
		margin: 5,
	},
	buttonContainer: {
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		marginTop: 10,
		padding: 10,
		borderRadius: 5,
		backgroundColor: "black",
	},
	buttonText: {
		color: "white",
	},
});
