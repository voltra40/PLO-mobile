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
import { Ionicons } from "@expo/vector-icons";

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
			});
			// remove first elem
			transactions.shift();
			setTransactions(transactions);
		});
	}, []);

	const list = () => {
		for (let i = transactions.length - 1; i >= 1; i--) {
			// check if index i and i-1 < 5
			if (
				parseFloat(transactions[i].usd_amount) +
					parseFloat(transactions[i - 1].usd_amount) <=
				5.0
			) {
				// combine two entries
				transactions[i - 1].amount = (
					parseFloat(transactions[i].amount) +
					parseFloat(transactions[i - 1].amount)
				).toFixed(6);
				transactions[i - 1].usd_amount = (
					parseFloat(transactions[i].usd_amount) +
					parseFloat(transactions[i - 1].usd_amount)
				).toFixed(2);
				transactions.splice(i, 1);
			}
		}
		return transactions.sort().reverse();
	};

	function TransactionList() {
		return list().map((elem, index) => (
			<View style={styles.row} key={index}>
				<View style={styles.column}>
					<Text>
						{new Date(elem.timestamp * 1000).getMonth() +
							1 +
							"/" +
							new Date(elem.timestamp * 1000).getDate() +
							"/" +
							new Date(elem.timestamp * 1000).getFullYear()}
					</Text>
				</View>
				<View style={styles.column}>
					<Text> ${elem.price} </Text>
				</View>
				<View style={styles.column}>
					<Text> {elem.amount} </Text>
				</View>
				<View>
					<Text> ${elem.usd_amount} </Text>
				</View>
			</View>
		));
	}

	function HeaderRow() {
		return (
			<View style={{ marginLeft: "10%" }}>
				<View style={styles.row}>
					<View style={styles.column}>
						<Text style={styles.headerText}>Date</Text>
					</View>
					<View style={styles.column}>
						<Text style={styles.headerText}> Price</Text>
					</View>
					<View style={styles.column}>
						<Text style={styles.headerText}> Amount</Text>
					</View>
					<View style={styles.column}>
						<Text style={styles.headerText}> USD</Text>
					</View>
				</View>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<HeaderRow />
			<ScrollView style={styles.scrollView}>
				<View style={styles.tListContainer}>
					<TransactionList />
				</View>
			</ScrollView>
			<TouchableOpacity onPress={back} style={styles.backButton}>
				<Ionicons name="chevron-back-outline" size={32} color="white" />
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
		position: "absolute",
		bottom: "5%",
		backgroundColor: "black",
		padding: 2,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		left: 0,
	},
	scrollView: {
		flex: 1,
		alignSelf: "stretch",
	},
	tListContainer: {
		marginLeft: "10%",
		// alignSelf: "center",
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
	column: {
		alignSelf: "stretch",
		width: "25%",
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
