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
	SafeAreaView,
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
					name: "",
				};
				const userRef = firebase.firestore().collection("users");
				userRef.doc(user.uid).set(data);
				console.log("Registered with: " + user.email);

				// create bucket list
				const bucketListRef = firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.collection("bucket list")
					.doc("my bucket list");
				const bucketList = {
					items: [],
				};
				bucketListRef.set(bucketList);

				// create habits
				const habitsRef = firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.collection("habits")
					.doc("my habits");
				const habits = {
					"Make my bed": [],
				};
				habitsRef.set(habits);
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
			<Text style={styles.title}>PLO</Text>
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
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 40,
		fontWeight: "bold",
	},
	inputContainer: {
		marginTop: "10%",
	},
	input: {
		backgroundColor: "white",
		borderRadius: 5,
		margin: 5,
		padding: "5%",
	},
	buttonContainer: {
		marginTop: "10%",
		alignItems: "center",
	},
	button: {
		margin: 5,
		padding: "5%",
		borderRadius: 5,
		backgroundColor: "black",
	},
	buttonText: {
		color: "white",
	},
});
