import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth, firebase } from "../firebase";

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
		};
	}

	async componentDidMount() {
		await this.getUser();
	}

	async getUser() {
		const user = auth.currentUser;
		const userRef = firebase.firestore().collection("users").doc(user.uid);

		userRef
			.get()
			.then((response) => {
				// check document exist
				if (response.exists) {
					// alert(response.data().fullName);
					this.setState({ name: response.data().fullName });
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
				<Text> Welcome {this.state.name} </Text>
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
});
