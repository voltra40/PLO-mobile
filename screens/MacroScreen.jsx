import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	SafeAreaView,
	ScrollView,
	Keyboard,
} from "react-native";
import { auth, firebase } from "../firebase";

const MacroScreen = () => {
	const [macroList, setMacrotList] = useState([]);
	const [item, setItem] = useState("");

	const d = new Date();
	const today = new Date(Date.now()).toDateString();

	const user = auth.currentUser;
	const macroRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("macros")
		.doc(today);

	useEffect(() => {
		macroRef.onSnapshot((response) => {
			if (response.exists) {
				console.log("habit ref exist for today:", today);
				const macros = response.data();
				console.log(macros);
			} else {
				console.log("creating new macro list for today:", today);
				macroRef.set({});
			}
		});
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Macros</Text>
			<ScrollView style={styles.scrollView}></ScrollView>
		</SafeAreaView>
	);
};

export default MacroScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
	},
	scrollView: {
		flex: 1,
		alignSelf: "stretch",
	},
	title: {
		fontSize: 40,
		fontWeight: "bold",
		marginBottom: "20%",
	},
	bucketListItemContainer: {
		flexDirection: "row",
		marginBottom: "10%",
		alignSelf: "center",
		width: "80%",
	},
	bucketListItem: {
		flex: 1,
		marginRight: "5%",
	},
	bucketListItemText: {
		fontSize: 20,
	},
	deleteButton: {
		marginLeft: "auto",
		justifyContent: "center",
		padding: 5,
		borderRadius: 5,
		backgroundColor: "red",
	},
	inputContainer: {
		flexDirection: "row",
		marginBottom: "10%",
		width: "80%",
	},
	input: {
		flex: 1,
		padding: "5%",
		borderWidth: 1,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	inputButton: {
		marginLeft: "auto",
		padding: "5%",
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		backgroundColor: "black",
	},
	buttonText: {
		color: "white",
	},
});
