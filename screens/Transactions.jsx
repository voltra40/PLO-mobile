import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, firebase } from "../firebase";

const Transactions = () => {
	const navigation = useNavigation();

	const back = () => {
		navigation.navigate("Root", { screen: "TabFour" });
	};

	const [transactions, setTransactions] = useState([]);

	const user = auth.currentUser;
	const transactionsRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("transactions");

	useEffect(() => {
		transactionsRef.onSnapshot((querySnapshot) => {
			let transactions = [];
			querySnapshot.forEach((doc) => {
				transactions.push(doc.data());
				console.log(doc.data());
			});
			// remove first elem
			transactions.shift();
			setTransactions(transactions);
		});
	}, []);

	function TransactionList() {
		const sortedTransactions = transactions.sort().reverse();

		return sortedTransactions.map((elem, index) => (
			<View style={styles.row} key={index}>
				<Text>
					{new Date(elem.timestamp * 1000).getMonth() +
						1 +
						"/" +
						new Date(elem.timestamp * 1000).getDate() +
						"/" +
						new Date(elem.timestamp * 1000).getFullYear()}
				</Text>
				<Text> ${elem.price} </Text>
				<Text> {elem.amount} </Text>
				<Text> ${elem.usd_amount} </Text>
			</View>
		));
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.tListContainer}>
					<TransactionList />
				</View>
			</ScrollView>
			<TouchableOpacity onPress={back} style={styles.backButton}>
				<Text style={styles.buttonText}>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Transactions;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backButton: {
		alignSelf: "flex-start",
		position: "absolute",
		bottom: "5%",
		backgroundColor: "black",
		padding: 5,
		borderRadius: 5,
		marginLeft: "5%",
	},
	buttonText: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
	},
	scrollView: {
		flex: 1,
		alignSelf: "stretch",
	},
	tListContainer: {
		alignSelf: "center",
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
});
