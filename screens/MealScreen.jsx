import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	ScrollView,
	Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, firebase } from "../firebase";
import { Ionicons } from "@expo/vector-icons";

const Meals = ({ route }) => {
	const [loading, setLoading] = useState(true);

	const [meal, setMeal] = useState("");
	const [calories, setCalories] = useState("");
	const [protein, setProtein] = useState("");
	const [carbs, setCarbs] = useState("");
	const [fat, setFat] = useState("");

	const [mealNames, setMealNames] = useState([]);
	const [mealData, setMealData] = useState([]);

	const navigation = useNavigation();

	const macros = route.params.macros;

	const day = Object.keys(macros)[0];

	const user = auth.currentUser;
	const macroRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("macros")
		.doc(day);

	const back = () => {
		navigation.navigate("Root", { screen: "Macros" });
	};

	useEffect(() => {
		console.log("day:", day);
		getMeals();
	}, []);

	const getMeals = () => {
		firebase
			.firestore()
			.collection("users")
			.doc(user.uid)
			.collection("macros")
			.doc(day)
			.onSnapshot((doc) => {
				setMealNames(Object.keys(doc.data()));
				setMealData(doc.data());
				setLoading(false);
			});
	};

	const addMeal = () => {
		if (meal !== "") {
			setLoading(true);
			macroRef
				.update({
					[meal]: {
						calories: calories,
						protein: protein,
						carbs: carbs,
						fat: fat,
					},
				})
				.then(() => {
					console.log("added new meal");
					setMeal("");
					setCalories("");
					setProtein("");
					setCarbs("");
					setFat("");
					Keyboard.dismiss();
					setLoading(false);
				})
				.catch((err) => console.log(err));
		}
	};

	function Meals() {
		return mealNames.sort().map((elem, index) => (
			<View style={styles.mealContainer} key={index}>
				<Text style={styles.mealText}>{elem}</Text>
				<View style={styles.row}>
					<Text>calories: {mealData[elem].calories}, </Text>
					<Text>protein: {mealData[elem].protein}g, </Text>
					<Text>carbs: {mealData[elem].carbs}g, </Text>
					<Text>fat: {mealData[elem].fat}g</Text>
				</View>
			</View>
		));
	}

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<View>
					<Text>loading</Text>
				</View>
			) : (
				<View style={styles.inputContainer}>
					<Text style={styles.title}>{day}</Text>
					<TextInput
						placeholder="meal"
						value={meal}
						onChangeText={(text) => setMeal(text)}
						style={styles.mealInput}
					/>
					<View style={styles.row}>
						<TextInput
							placeholder="calories"
							value={calories}
							onChangeText={(text) => setCalories(text)}
							style={styles.input}
						/>
						<TextInput
							placeholder="protein"
							value={protein}
							onChangeText={(text) => setProtein(text)}
							style={styles.input}
						/>
						<TextInput
							placeholder="carbs"
							value={carbs}
							onChangeText={(text) => setCarbs(text)}
							style={styles.input}
						/>
						<TextInput
							placeholder="fat"
							value={fat}
							onChangeText={(text) => setFat(text)}
							style={styles.input}
						/>
					</View>
					<TouchableOpacity onPress={addMeal} style={styles.inputButton}>
						<Text style={styles.buttonText}>Add</Text>
					</TouchableOpacity>
					<ScrollView style={styles.scrollView}>
						<Meals />
					</ScrollView>
				</View>
			)}
			<TouchableOpacity onPress={back} style={styles.backButton}>
				<Ionicons name="chevron-back-outline" size={32} color="white" />
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Meals;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		alignSelf: "center",
		fontSize: 40,
		fontWeight: "bold",
		marginBottom: "10%",
	},
	inputContainer: {
		flex: 1,
		alignSelf: "stretch",
		marginHorizontal: "5%",
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
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
		alignSelf: "stretch",
	},
	mealContainer: {
		marginBottom: "5%",
	},
	mealInput: {
		padding: "5%",
		borderWidth: 2,
		marginBottom: "5%",
		borderRadius: 5,
	},
	input: {
		padding: "2%",
		width: "21%",
		borderWidth: 1,
		marginBottom: "5%",
		marginRight: "1%",
		borderRadius: 5,
	},
	inputButton: {
		padding: "5%",
		borderRadius: 5,
		backgroundColor: "black",
		alignSelf: "center",
	},
	buttonText: {
		color: "white",
	},
	mealText: {
		fontSize: 20,
	},
});
