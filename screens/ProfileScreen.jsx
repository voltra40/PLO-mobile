import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, firebase } from "../firebase";
import { useNavigation } from "@react-navigation/native";

// const ProfileScreen = () => {
// 	const navigation = useNavigation();

// 	const handleSignOut = () => {
// 		auth
// 			.signOut()
// 			.then(() => {
// 				navigation.replace("Login");
// 			})
// 			.catch((error) => alert(error.message));
// 	};

// 	return (
// 		<View style={styles.container}>
// 			<Text> Name: </Text>
// 			<Text> Signed in as: {auth.currentUser?.email} </Text>
// 			<View style={styles.buttonContainer}>
// 				<TouchableOpacity style={styles.button} onPress={handleSignOut}>
// 					<Text style={styles.buttonText}>Sign Out</Text>
// 				</TouchableOpacity>
// 			</View>
// 		</View>
// 	);
// };

// export default ProfileScreen;

// const navigation = useNavigation();

// const handleSignOut = () => {
// 	auth
// 		.signOut()
// 		.then(() => {
// 			navigation.replace("Login");
// 		})
// 		.catch((error) => alert(error.message));
// };

export default class ProfileScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
		};
	}

	async componentDidMount() {
		await this.getUser();
	}

	// handleSignOut() {
	// 	// const navigation = useNavigation();
	// 	auth
	// 		.signOut()
	// 		.then(() => {
	// 			useNavigation().replace("Login");
	// 		})
	// 		.catch((error) => alert(error.message));
	// 	console.log("signing out 123");
	// }

	async getUser() {
		const user = auth.currentUser;
		const userRef = firebase.firestore().collection("users").doc(user.uid);

		userRef
			.get()
			.then((response) => {
				// check document exist
				if (response.exists) {
					// alert(response.data().fullName);
					this.setState({
						name: response.data().fullName,
						email: response.data().email,
					});
				} else {
					alert("Document does not exist.");
					console.log("Document does not exist.");
				}
			})
			.catch((error) => {
				alert(error);
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text> Name: {this.state.name} </Text>
				<Text> Signed in as: {this.state.email} </Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={this.handleSignOut}>
						<Text style={styles.buttonText}>Sign Out</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

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
	button: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "black",
	},
	buttonText: {
		color: "white",
	},
});
