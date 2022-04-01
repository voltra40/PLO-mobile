import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, firebase } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Stats = () => {
	const navigation = useNavigation();

	const back = () => {
		navigation.navigate("Root", { screen: "Crypto" });
	};

	const [transactions, setTransactions] = useState([]);
	const [averagePrice, setAveragePrice] = useState(0);
	const [totalInvested, setTotalInvested] = useState(0);
	const [totalEthereum, setTotalEthereum] = useState(0);
	const [profitOrLoss, setProfitOrLoss] = useState(0);
	const [refreshing, setRefreshing] = useState(false);

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
	}, [transactions, refreshing]);

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
		// set profit or loss; first get curr price of eth
		await axios
			.get(
				"https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
				{
					headers: {
						"X-CMC_PRO_API_KEY": "f963b29f-80ac-4790-903c-b9ba5e511ca4",
					},
					params: {
						symbol: "ETH",
					},
				}
			)
			.then((response) => {
				const curr = parseFloat(response.data.data.ETH.quote.USD.price);
				setProfitOrLoss(
					(curr * tempTotalEthereum - tempTotalInvested).toLocaleString(
						"en-US",
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}
					)
				);
			})
			.catch((err) => console.log(err));

		console.log(
			`total ethereum: ${totalEthereum} ETH, total invested: $${totalInvested}, average price: $${averagePrice}, profit or loss: $${profitOrLoss}`
		);
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		wait(500).then(() => setRefreshing(false));
	}, []);

	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
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
							<Text style={styles.statText}>{totalEthereum} ETH</Text>
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
					<View style={styles.row}>
						<View style={styles.statCategoryContainer}>
							<Text style={styles.statCategoryText}>Profit/Loss</Text>
						</View>
						<View style={profitOrLoss >= 0 ? styles.profit : styles.loss}>
							<Text style={styles.statText}>${profitOrLoss}</Text>
						</View>
					</View>
				</View>
			</ScrollView>
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
	profit: {
		backgroundColor: "green",
		marginLeft: "auto",
	},
	loss: {
		backgroundColor: "red",
		marginLeft: "auto",
	},
});
