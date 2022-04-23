import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { auth, firebase } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const MacroScreen = () => {
	const [loading, setLoading] = useState(true);
	const [macros, setMacros] = useState([]);

	const navigation = useNavigation();
	const today = new Date(Date.now()).toDateString();

	const user = auth.currentUser;
	const macroRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("macros");

	useEffect(() => {
		// lists or creates doc for today's macros
		macroRef.doc(today).onSnapshot((response) => {
			if (response.exists) {
				console.log("macro ref exist for today:", today);
				getAllMacros();
			} else {
				console.log("creating new macro list for today:", today);
				macroRef.doc(today).set({});
				getAllMacros();
			}
		});
	}, []);

	const getAllMacros = () => {
		let macroObj = [];
		macroRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				macroObj.push({ [doc.id]: doc.data() });
			});

			// sorts list of macros by date in descending order
			setMacros(
				macroObj
					.sort((a, b) => new Date(Object.keys(a)) - new Date(Object.keys(b)))
					.reverse()
			);
			setLoading(false);
		});
	};

	const getTotal = (macroDay) => {
		const total = {
			calories: 0,
			carbs: 0,
			protein: 0,
			fat: 0,
		};

		// destructure object
		for (let meals of macroDay) {
			Object.values(meals).forEach((meal) => {
				total.calories += Number(meal.calories);
				total.carbs += Number(meal.carbs);
				total.protein += Number(meal.protein);
				total.fat += Number(meal.fat);
			});
		}
		return total;
	};

	// opens page for specific day
	const viewMore = (macros) => {
		console.log(macros);
		navigation.replace("Meals", { macros });
	};

	// component lists day and total macro nutrients
	function MacroRow() {
		return macros.map((item, index) => (
			<TouchableOpacity
				onPress={() => viewMore(item)}
				style={styles.macroListContainer}
				key={index}
			>
				<View style={styles.row}>
					<View style={styles.dateContainer}>
						<Text style={styles.dateText}>{Object.keys(item)}</Text>
					</View>
				</View>
				<View style={styles.macroContainer}>
					<Text style={styles.detailsText}>
						calories: {getTotal(Object.values(item)).calories}
					</Text>
					<Text style={styles.detailsText}>
						fat: {getTotal(Object.values(item)).fat}g
					</Text>
					<Text style={styles.detailsText}>
						carbs: {getTotal(Object.values(item)).carbs}g
					</Text>
					<Text style={styles.detailsText}>
						protein: {getTotal(Object.values(item)).protein}g
					</Text>
				</View>
			</TouchableOpacity>
		));
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Macros</Text>
			{loading ? (
				<Text> loading </Text>
			) : (
				<ScrollView style={styles.scrollView}>{<MacroRow />}</ScrollView>
			)}
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
		marginBottom: "10%",
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
	macroListContainer: {
		alignSelf: "stretch",
		marginHorizontal: "5%",
		borderWidth: 2,
		borderRadius: 5,
		marginBottom: "5%",
	},
	macroContainer: {
		marginVertical: "3%",
		marginLeft: "2%",
	},
	dateContainer: {
		borderBottomWidth: 5,
		marginLeft: "2%",
	},
	dateText: {
		fontSize: 25,
	},
	detailsText: {
		fontSize: 15,
	},
});
