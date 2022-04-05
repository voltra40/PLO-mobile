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
			} else {
				console.log("creating new macro list for today:", today);
				macroRef.doc(today).set({});
			}
		});
		getAllMacros();
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
		// console.log("total:", total);
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
			<View style={styles.macroListContainer} key={index}>
				<TouchableOpacity onPress={() => viewMore(item)}>
					<Text style={styles.dateText}>{Object.keys(item)}</Text>
				</TouchableOpacity>
				<View style={styles.row}>
					<Text>calories: {getTotal(Object.values(item)).calories}, </Text>
					<Text>protein: {getTotal(Object.values(item)).protein}g, </Text>
					<Text>carbs: {getTotal(Object.values(item)).carbs}g, </Text>
					<Text>fat: {getTotal(Object.values(item)).fat}g </Text>
				</View>
			</View>
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
		marginBottom: "20%",
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
		marginBottom: "5%",
	},
	macroListContainer: {
		alignSelf: "stretch",
		marginHorizontal: "5%",
	},
	dateText: {
		fontSize: 20,
	},
});
