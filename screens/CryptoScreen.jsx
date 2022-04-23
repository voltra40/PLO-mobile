import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Keyboard,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Pressable,
	RefreshControl,
} from "react-native";
import { auth, firebase } from "../firebase";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const wait = (timeout) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};

const CryptoScreen = () => {
	const [cryptoList, setCryptoList] = useState([]);
	const [crypto, setCrypto] = useState("");
	const [cryptoPrices, setCryptoPrices] = useState([]);
	const [percentChange, setPercentChange] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const navigation = useNavigation();

	const user = auth.currentUser;
	const cryptoRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("crypto")
		.doc("my crypto");

	useEffect(() => {
		cryptoRef.onSnapshot((response) => {
			setCryptoList(response.data().cryptos);
			console.log("current cryptos:", response.data().cryptos);
		});
	}, []);

	// updates prices on state change
	useEffect(() => {
		if (cryptoList.length > 0) {
			console.log("state change");
			prices();
		}
	}, [cryptoList, refreshing]);

	const addCrypto = () => {
		if (crypto === "") return;
		// check if valid
		cryptoRef
			.update({
				cryptos: firebase.firestore.FieldValue.arrayUnion(crypto),
			})
			.then(() => {
				console.log("added", crypto, "to cryptos");
				setCrypto("");
				Keyboard.dismiss();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteCrypto = (crypto) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		const copy = cryptoList;
		const index = copy.indexOf(crypto);
		copy.splice(index, 1);
		cryptoRef
			.update({ cryptos: copy })
			.then(() => console.log(crypto, "deleted"))
			.catch((error) => {
				alert(error.message);
			});
	};

	async function prices() {
		if (!cryptoList) return;
		const symbols = cryptoList.toString();
		console.log("symbols: ", symbols);
		let response = null;
		new Promise(async (resolve, reject) => {
			try {
				response = await axios.get(
					"https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
					{
						headers: {
							"X-CMC_PRO_API_KEY": "f963b29f-80ac-4790-903c-b9ba5e511ca4",
						},
						params: {
							symbol: symbols,
						},
					}
				);
			} catch (ex) {
				response = null;
				// error
				console.log(ex);
				reject(ex);
			}
			if (response) {
				// success
				const json = response.data.data;
				// console.log(json);
				resolve(json);
				let tempPrices = [];
				let tempPercentChange = [];
				for (let symbol in json) {
					tempPrices.push(
						json[symbol].quote.USD.price >= 1
							? json[symbol].quote.USD.price.toFixed(2).toLocaleString("en-US")
							: json[symbol].quote.USD.price.toFixed(4).toLocaleString("en-US")
					);
					tempPercentChange.push(
						json[symbol].quote.USD.percent_change_24h
							.toFixed(2)
							.toLocaleString("en-US")
					);
				}
				setCryptoPrices(tempPrices);
				setPercentChange(tempPercentChange);
				console.log(
					"crypto prices:",
					tempPrices,
					"percent change:",
					tempPercentChange
				);
			}
		});
	}

	function CryptoList() {
		if (!cryptoList) {
			return (
				<View>
					<Text>Loading...</Text>
				</View>
			);
		} else {
			const sortedCrypto = cryptoList.sort();

			return sortedCrypto.map((elem, index) => (
				<View style={styles.rowContainer} key={index}>
					<View style={styles.row}>
						<View style={styles.cryptoTextContainer}>
							<Pressable
								style={styles.cryptoTextSubContainer}
								onLongPress={() => deleteCrypto(elem)}
								key={index}
							>
								<Text style={styles.cryptoText}>{elem}</Text>
							</Pressable>
						</View>
						<View style={styles.cryptoPriceTextContainer}>
							<Text style={styles.cryptoPriceText}>${cryptoPrices[index]}</Text>
						</View>
						<View style={styles.cryptoPercentChangeContainer}>
							{percentChange[index] >= 0 ? (
								<Text style={styles.percentChangeTextPositive}>
									{percentChange[index]}%
								</Text>
							) : (
								<Text style={styles.percentChangeTextNegative}>
									{percentChange[index]}%
								</Text>
							)}
						</View>
					</View>
				</View>
			));
		}
	}

	const viewTransactions = () => {
		navigation.replace("Transactions");
	};

	const viewStats = () => {
		navigation.replace("Stats");
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		wait(500).then(() => setRefreshing(false));
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Crypto</Text>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="add a crypto"
					value={crypto}
					onChangeText={(text) => setCrypto(text)}
					style={styles.input}
				/>
				<TouchableOpacity onPress={addCrypto} style={styles.inputButton}>
					<Text style={styles.buttonText}>Add</Text>
				</TouchableOpacity>
			</View>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={styles.cryptoListContainer}>
					<CryptoList />
				</View>
			</ScrollView>
			<View style={styles.buttonsRow}>
				<TouchableOpacity onPress={viewStats} style={styles.bottomButton}>
					<Text style={styles.buttonText}>Stats</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={viewTransactions}
					style={styles.bottomButton}
				>
					<Text style={styles.buttonText}>Transactions</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default CryptoScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
	},
	title: {
		fontSize: 40,
		fontWeight: "bold",
		marginBottom: "20%",
	},
	scrollView: {
		flex: 1,
		alignSelf: "stretch",
	},
	rowContainer: {
		// borderTopWidth: 1,
		marginHorizontal: "5%",
		borderBottomWidth: 0.2,
		marginBottom: "5%",
	},
	row: {
		flexDirection: "row",
		flex: 1,
	},
	inputContainer: {
		flexDirection: "row",
		marginBottom: "7.5%",
		width: "80%",
	},
	buttonsRow: {
		justifyContent: "center",
		flexDirection: "row",
		alignSelf: "stretch",
	},
	bottomButton: {
		padding: "5%",
		borderRadius: 5,
		backgroundColor: "black",
		marginVertical: "2.5%",
		marginHorizontal: "5%",
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
	cryptoListContainer: {
		alignSelf: "stretch",
		// borderWidth: 1,
	},
	cryptoTextContainer: {
		// alignSelf: "flex-start",
		// borderWidth: 1,
		marginBottom: "5%",
		width: "40%",
	},
	cryptoTextSubContainer: {
		alignSelf: "flex-start",
		padding: 5,
		backgroundColor: "black",
		borderRadius: 5,
	},
	cryptoPriceTextContainer: {
		alignSelf: "stretch",
		alignItems: "center",
		// borderWidth: 1,
		padding: 5,
	},
	cryptoPercentChangeContainer: {
		position: "absolute",
		right: 0,
		alignItems: "center",
		padding: 5,
	},
	cryptoText: {
		color: "white",
		textAlign: "left",
		fontWeight: "bold",
		fontSize: 20,
	},
	cryptoPriceText: {
		fontSize: 20,
	},
	percentChangeTextPositive: {
		color: "green",
		fontSize: 20,
	},
	percentChangeTextNegative: {
		color: "red",
		fontSize: 20,
	},
});
