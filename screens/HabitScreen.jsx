import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { auth, firebase } from "../firebase";
import { Ionicons } from "@expo/vector-icons";

const HabitScreen = () => {
	// double array does not store habit type like "meditation"
	const [habits, setHabits] = useState([]);
	// seperate array of habit types
	const [habitType, setHabitType] = useState([]);
	// for creating a new habit
	const [habitName, setHabitName] = useState("");

	const dates = [];
	for (let i = 1; i <= 31; i++) dates.push(i);

	const user = auth.currentUser;
	const habitRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("habits")
		.doc("my habits");

	useEffect(() => {
		habitRef.onSnapshot((response) => {
			const habits = response.data();
			setHabitType(Object.keys(habits));
			setHabits(habits);
		});
	}, []);

	const createHabit = () => {
		const data = [];
		for (let i = 0; i < 31; i++) data.push(false);

		habitRef
			.update({ [habitName]: data })
			.then(() => {
				setHabitName("");
				console.log("added new habit: ", habitName);
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	const check = (item, sIndex) => {
		// copy data
		const newData = habits[item];
		// change true to false; false to true
		newData[sIndex] = !newData[sIndex];

		habitRef
			.update({ [item]: newData })
			.then(() => {
				console.log("updated", item, "habit on day", sIndex + 1);
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	function HabitTypeRows() {
		const sortHabitTypes = habitType.sort();
		return sortHabitTypes.map((habit, index) => (
			<View style={styles.habitType} key={index}>
				<Text style={styles.habitTypeText}> {habit}</Text>
			</View>
		));
	}

	function Rows() {
		const sortedHabits = Object.keys(habits)
			.sort()
			.reduce((obj, key) => {
				obj[key] = habits[key];
				return obj;
			}, {});
		return Object.keys(sortedHabits).map((item, index) => (
			<View style={styles.row} key={index}>
				{habits[item].map((value, sIndex) => (
					<View style={styles.checkBox} key={sIndex}>
						<TouchableOpacity onPress={() => check(item, sIndex)}>
							{value ? (
								<Ionicons name="checkmark" size={32} color="black" />
							) : (
								<Ionicons name="checkmark" size={32} color="white" />
							)}
						</TouchableOpacity>
					</View>
				))}
			</View>
		));
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Habits</Text>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="add a habit"
					value={habitName}
					onChangeText={(text) => setHabitName(text)}
					style={styles.input}
				/>
				<TouchableOpacity onPress={createHabit} style={styles.inputButton}>
					<Text style={styles.buttonText}>Add</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.containerColumn}>
				<View style={styles.habitTypeContainer}>
					<HabitTypeRows />
				</View>
				<ScrollView style={styles.scrollView} horizontal={true}>
					<View style={styles.grid}>
						<View style={styles.row}>
							{dates.map((date, index) => (
								<View style={styles.dateBox} key={index}>
									<Text style={styles.dateText}> {date} </Text>
								</View>
							))}
						</View>
						<Rows />
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HabitScreen;

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
	containerColumn: {
		flexDirection: "row",
	},
	habitTypeContainer: {
		marginTop: 49,
	},
	scrollView: {},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
	habitType: {
		alignSelf: "flex-start",
		marginRight: 5,
		marginBottom: 8,
	},
	grid: {},
	checkBox: {
		borderWidth: 1,
		borderRadius: 5,
		margin: 5,
	},
	dateBox: {
		width: 34,
		height: 34,
		borderWidth: 1,
		margin: 5,
		borderRadius: 5,
		justifyContent: "center",
		backgroundColor: "black",
	},
	dateText: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
	},
	habitTypeText: {
		fontSize: 32,
	},
	inputContainer: {
		flexDirection: "row",
		marginBottom: "10%",
		width: "80%",
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
	text: {
		fontSize: 20,
	},
});
