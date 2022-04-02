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
import { useNavigation } from "@react-navigation/native";

const MacroScreen = () => {
	const [loading, setLoading] = useState(true);
	const [macroDays, setMacroDays] = useState([]);
	const [macroList, setMacroList] = useState([]);
	const [macro, setMacro] = useState();
	const [meal, setMeal] = useState("");
	const [mealData, setMealData] = useState({});

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
				const macros = response.data();
				console.log(macros);
			} else {
				console.log("creating new macro list for today:", today);
				macroRef.set({});
			}
		});
		getAllMacros();
	}, []);

	const getAllMacros = () => {
		let tempDays = [];
		let tempList = [];
		macroRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data());
				tempDays.push(doc.id);
				tempList.push(doc.data());
			});
			setMacroDays(tempDays);
			setMacroList(tempList);
			// console.log("macro day:", macroList);
			setLoading(false);
		});
	};

	const getTotal = (meals) => {
		console.log("real item", meals);
		const total = {
			calories: 0,
			carbs: 0,
			protein: 0,
			fat: 0,
		};
		for (let meal in meals) {
			total.calories += Number(meals[meal].calories);
			total.carbs += Number(meals[meal].carbs);
			total.protein += Number(meals[meal].protein);
			total.fat += Number(meals[meal].fat);
		}
		console.log("total:", total);
		return total;
	};

	function MacroRow() {
		return macroList.map((item, index) => (
			<View style={styles.macroListContainer} key={index}>
				<TouchableOpacity onPress={() => viewMore(macroDays[index])}>
					<Text style={styles.dateText}>{macroDays[index]}</Text>
				</TouchableOpacity>
				<View style={styles.row}>
					<Text>calories: {getTotal(item).calories}, </Text>
					<Text>protein: {getTotal(item).protein}g, </Text>
					<Text>carbs: {getTotal(item).carbs}g, </Text>
					<Text>fat: {getTotal(item).fat}g </Text>
				</View>
			</View>
		));
	}

	const viewMore = (day) => {
		navigation.replace("Meals", { day });
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Macros</Text>
			{loading ? (
				<Text> loading </Text>
			) : (
				<ScrollView style={styles.scrollView}>
					<MacroRow />
				</ScrollView>
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
