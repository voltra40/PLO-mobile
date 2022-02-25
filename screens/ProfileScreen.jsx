import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	TextInput,
} from "react-native";
import { auth, firebase } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
	// hooks for states
	const [username, setUsername] = useState("");
	const [editing, setEditing] = useState(false);

	// firebase firestore collection
	const user = auth.currentUser;
	const userRef = firebase.firestore().collection("users").doc(user.uid);

	// this is componentDidMount
	useEffect(() => {
		// get user info
		userRef
			.get()
			.then((response) => {
				// check document exist
				if (response.exists) {
					setUsername(response.data().name);
					console.log("User's name: " + response.data().name);
				} else {
					console.log("Document does not exist.");
				}
			})
			.catch((error) => {
				alert(error);
			});
	}, []);

	// edit name
	const editName = () => {
		console.log("passing username: " + username);
		userRef
			.update({
				name: username,
			})
			.then(() => {
				console.log("username updated to: " + username);
			})
			.catch((error) => {
				alert(error);
			});
	};

	// sign out
	const navigation = useNavigation();

	const handleSignOut = () => {
		auth
			.signOut()
			.then(() => {
				navigation.replace("Login");
				console.log("signing out");
			})
			.catch((error) => alert(error.message));
	};

	const deleteAccount = () => {
		user
			.delete()
			.then(() => {
				navigation.replace("Login");
				console.log("user deleted");
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	return (
		<View style={styles.container}>
			{editing ? (
				<View style={styles.buttonContainer}>
					<TextInput
						value={username}
						onChangeText={(text) => setUsername(text)}
						style={styles.input}
					/>
					<TouchableOpacity
						onPress={() => {
							editName();
							setEditing(false);
						}}
						style={styles.button}
					>
						<Text style={styles.buttonText}>Save</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.buttonContainer}>
					<Text> Name: {username} </Text>
					<TouchableOpacity
						onPress={() => setEditing(true)}
						style={styles.button}
					>
						<Text style={styles.buttonText}>Edit</Text>
					</TouchableOpacity>
				</View>
			)}

			<View style={styles.buttonContainer}>
				<Text> Signed in as: {auth.currentUser?.email} </Text>
				<TouchableOpacity style={styles.button} onPress={handleSignOut}>
					<Text style={styles.buttonText}>Sign Out</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
					<Text style={styles.buttonText}>Delete Account</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonContainer: {
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	deleteButton: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "red",
	},
	button: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "black",
	},
	buttonText: {
		color: "white",
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
		margin: 5,
	},
});
