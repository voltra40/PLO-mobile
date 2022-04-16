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
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const HabitLandingPage = () => {
	const navigation = useNavigation();

	const viewMore = () => {
		navigation.replace("Habits");
	};

	const today = new Date();
	let currentMonth = new Date().getMonth();
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const [currMonth, setCurrMonth] = useState(currentMonth);
	const [habits, setHabits] = useState([]);
	const [habitData, setHabitData] = useState([]);
	const [loading, setLoading] = useState(true);

	const user = auth.currentUser;
	const habitRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("habits")
		.doc(months[currMonth]);

	useEffect(() => {
		loadHabits();
	}, []);

	const loadHabits = () => {
		habitRef.onSnapshot((response) => {
			if (response.exists) {
				const habits = response.data();
				let _habits = [];
				// check completion
				for (let habit in habits) {
					if (!habits[habit][new Date().getDate() - 1]) {
						_habits.push(habit);
					}
				}
				setHabits(_habits);
				setHabitData(response.data());
				setLoading(false);
			} else {
				console.log("habit ref does not exist");
			}
		});
	};

	const getCompletion = (habit) => {
		let count = 0;
		for (let days of habitData[habit]) {
			if (days) count++;
		}
		return count.toString() + "/" + today.getDate().toString();
	};

	function Habits() {
		return habits.sort().map((habit, index) => (
			<View key={index} style={styles.individualHabitContainer}>
				<View style={styles.habitTextContainer}>
					<Text style={styles.habitText}>{habit}</Text>
				</View>
				<View style={styles.completion}>
					<Text style={styles.habitCompletionText}>{getCompletion(habit)}</Text>
				</View>
				<TouchableOpacity
					onPress={() => complete(habit)}
					style={styles.completionIcon}
				>
					<Ionicons name="checkbox-outline" size={32} color="black" />
				</TouchableOpacity>
			</View>
		));
	}

	const complete = (habit) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		const newData = habitData[habit];
		newData[today.getDate() - 1] = !newData[today.getDate() - 1];

		habitRef
			.update({ [habit]: newData })
			.then(() => {
				console.log("updated", habit);
			})
			.catch((err) => alert(err));
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Habits</Text>
			{loading ? (
				<View>
					<Text>loading</Text>
				</View>
			) : (
				<View style={styles.container}>
					<Text style={styles.subHeading}>{today.toDateString()}</Text>
					<View style={styles.habitContainer}>
						<Habits />
					</View>
					<TouchableOpacity onPress={viewMore} style={styles.bottomButton}>
						<Text style={styles.buttonText}>View Calendar</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
};

export default HabitLandingPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
	},
	title: {
		fontSize: 40,
		fontWeight: "bold",
		marginBottom: "10%",
	},
	subHeading: {
		fontSize: 30,
	},
	habitContainer: {
		flex: 0.8,
		alignSelf: "stretch",
		justifyContent: "center",
	},
	habitTextContainer: {
		marginBottom: "2%",
		width: "80%",
	},
	individualHabitContainer: {
		alignSelf: "stretch",
		alignItems: "center",
		flexDirection: "row",
		marginBottom: "2%",
	},
	completion: {
		position: "absolute",
		right: 32 + 8,
	},
	completionIcon: {
		position: "absolute",
		right: 0,
	},
	bottomButton: {
		padding: "5%",
		borderRadius: 5,
		backgroundColor: "black",
		position: "absolute",
		bottom: "5%",
		justifyContent: "center",
		alignItems: "center",
	},
	habitText: {
		fontSize: 25,
	},
	habitCompletionText: {
		fontSize: 20,
		fontWeight: "300",
	},
	buttonText: {
		color: "white",
	},
});
