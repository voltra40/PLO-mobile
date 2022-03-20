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

const Stats = () => {
	const navigation = useNavigation();

	const back = () => {
		navigation.navigate("Root", { screen: "TabFour" });
	};

	const [transactions, setTransactions] = useState([]);
	const [averagePrice, setAveragePrice] = useState(0);
	const [totalInvested, setTotalInvested] = useState(0);
	const [totalEthereum, setTotalEthereum] = useState(0);
	const [profitOrLoss, setProfitOrLoss] = useState(0);

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

	useEffect(() => {
		getStats();
	}, [transactions]);

	const getStats = async () => {
		let tempTotalInvested = 0.0;
		let tempAveragePrice = 0.0;
		let tempTotalEthereum = 0.0;

		for (let i = 0; i < transactions.length; i++) {
			tempTotalInvested += parseFloat(transactions[i].usd_amount);
			tempAveragePrice +=
				parseFloat(transactions[i].price) * parseFloat(transactions[i].amount);
			tempTotalEthereum += parseFloat(transactions[i].amount);
		}

		setTotalInvested(
			tempTotalInvested.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
		);
		setAveragePrice(
			(tempAveragePrice / tempTotalEthereum).toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
		);
		setTotalEthereum(
			tempTotalEthereum.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			})
		);
		console.log(
			`total ethereum: ${totalEthereum}, total invested: $${totalInvested}, average price: $${averagePrice}`
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.statsContainer}>
				<View style={styles.row}>
					<View style={styles.statCategoryContainer}>
						<Text style={styles.statCategoryText}>Total Invested</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statText}>${totalInvested}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.statCategoryContainer}>
						<Text style={styles.statCategoryText}>Total Ethereum</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statText}>{totalEthereum}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.statCategoryContainer}>
						<Text style={styles.statCategoryText}>Average Price</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statText}>${averagePrice}</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity onPress={back} style={styles.backButton}>
				<Ionicons name="chevron-back-outline" size={32} color="white" />
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Stats;

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
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
	statsContainer: {
		alignSelf: "stretch",
	},
	statCategoryContainer: {
		alignSelf: "stretch",
	},
	statCategoryText: {
		fontWeight: "bold",
		fontSize: 20,
	},
	stat: {
		marginLeft: "auto",
	},
	statText: {
		fontSize: 20,
	},
});
