import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	SafeAreaView,
	ScrollView,
	Pressable,
	Keyboard,
} from "react-native";
import { auth, firebase } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const HabitScreen = () => {
	// double array does not store habit type like "meditation"
	const [habits, setHabits] = useState({});
	// seperate array of habit types
	const [habitType, setHabitType] = useState([]);
	// for creating a new habit
	const [habitName, setHabitName] = useState("");
	// for adding habits
	const [adding, setAdding] = useState(false);

	// JS date function
	const d = new Date();

	// get current month
	let currentMonth = d.getMonth();
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

	// for traversing months
	const [currMonth, setCurrMonth] = useState(currentMonth);
	console.log("currMonth:", months[currMonth]);

	// get days in month
	const daysInCurrentMonth = new Date(
		d.getFullYear(),
		currMonth + 1,
		0
	).getDate();

	// populate dates for habit calendar
	const dates = [];
	for (let i = 1; i <= daysInCurrentMonth; i++) dates.push(i);

	const user = auth.currentUser;
	const habitRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("habits")
		//.doc("my habits");
		.doc(months[currMonth]);

	// handle loading component
	useEffect(() => {
		// check if exist (creates new month if month has passed)
		habitRef.onSnapshot((response) => {
			if (response.exists) {
				console.log("habit ref exist for month:", months[currentMonth]);
				const habits = response.data();
				setHabitType(Object.keys(habits));
				setHabits(habits);
				// console.log(habits);
			} else {
				console.log(
					"creating new habit reference for month:",
					months[currentMonth]
				);
				habitRef.set({});
			}
		});
	}, [currMonth]);

	const createHabit = () => {
		if (habitName === "") return;
		const data = [];
		for (let i = 0; i < daysInCurrentMonth; i++) data.push(false);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		habitRef
			.update({ [habitName]: data })
			.then(() => {
				Keyboard.dismiss();
				setHabitName("");
				console.log("added new habit: ", habitName);
			})
			.catch((error) => {
				alert(error.message);
			});
		setAdding(false);
	};

	const check = (item, sIndex) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

	const deleteHabit = (habit) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		habitRef
			.update({ [habit]: firebase.firestore.FieldValue.delete() })
			.then(() => console.log(habit, "deleted"))
			.catch((error) => {
				alert(error.message);
			});
	};

	function HabitTypeRows() {
		const sortHabitTypes = habitType.sort();
		return sortHabitTypes.map((habit, index) => (
			<Pressable
				onLongPress={() => deleteHabit(habit)}
				style={styles.habitType}
				key={index}
			>
				<Text style={styles.habitTypeText}> {habit}</Text>
			</Pressable>
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

	const decrementMonth = () => {
		currMonth > 0
			? setCurrMonth(currMonth - 1)
			: Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
	};
	const incrementMonth = () => {
		currMonth < 11
			? setCurrMonth(currMonth + 1)
			: Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* <Text style={styles.title}>Habits</Text> */}
			{adding ? (
				<View
					style={{ flex: 1, alignSelf: "stretch", justifyContent: "center" }}
				>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder="add a habit"
							value={habitName}
							onChangeText={(text) => setHabitName(text)}
							style={styles.input}
						/>
						<TouchableOpacity style={styles.inputButton} onPress={createHabit}>
							<Text style={styles.buttonText}>Add</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={styles.addHabitButton}
						onPress={() => setAdding(false)}
					>
						<Ionicons name="close-outline" size={50} color="black" />
					</TouchableOpacity>
				</View>
			) : (
				<View style={{ flex: 1, alignSelf: "stretch", marginTop: "10%" }}>
					<View style={styles.leftAndRightRow}>
						<TouchableOpacity style={styles.back} onPress={decrementMonth}>
							<Ionicons name="arrow-back-outline" size={20} color="white" />
						</TouchableOpacity>
						<View style={styles.month}>
							<Text style={styles.monthText}> {months[currMonth]} </Text>
						</View>
						<TouchableOpacity style={styles.forward} onPress={incrementMonth}>
							<Ionicons name="arrow-forward-outline" size={20} color="white" />
						</TouchableOpacity>
					</View>
					<View style={styles.containerColumn}>
						<View style={styles.habitTypeContainer}>
							<HabitTypeRows />
						</View>
						<ScrollView style={styles.scrollView} horizontal={true}>
							<View style={styles.grid}>
								<View style={styles.row}>
									{JSON.stringify(habits) !== "{}" &&
										dates.map((date, index) => (
											<View style={styles.dateBox} key={index}>
												<Text style={styles.dateText}> {date} </Text>
											</View>
										))}
								</View>
								<Rows />
							</View>
						</ScrollView>
					</View>
					<TouchableOpacity
						style={styles.addHabitButton}
						onPress={() => setAdding(true)}
					>
						<Ionicons name="add-outline" size={50} color="black" />
					</TouchableOpacity>
				</View>
			)}
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
		marginVertical: "10%",
		//marginBottom: "20%",
	},
	containerColumn: {
		flexDirection: "row",
	},
	habitTypeContainer: {
		marginTop: 49,
	},
	scrollView: {
		//marginRight: "2%",
	},
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
	leftAndRightRow: {
		justifyContent: "space-evenly",
		flexDirection: "row",
		marginBottom: "5%",
	},
	back: {
		backgroundColor: "black",
		padding: 5,
		borderRadius: 5,
		justifyContent: "center",
		//marginRight: "40%",
	},
	forward: {
		backgroundColor: "black",
		padding: 5,
		borderRadius: 5,
		justifyContent: "center",
		//marginLeft: "40%",
	},
	inputContainer: {
		flexDirection: "row",
		marginLeft: "20%",
		width: "60%",
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
	addHabitButton: {
		position: "absolute",
		// backgroundColor: "black",
		// flexDirection: "row",
		// justifyContent: "center",
		// alignItems: "center",
		// marginStart: "50%",
		// width: "15%",
		// height: "15%",
		// borderRadius: ,
		bottom: "1%",
		right: "1%",
	},
	month: {
		alignSelf: "stretch",
		width: "80%",
	},
	monthText: {
		fontWeight: "bold",
		fontSize: 30,
		textAlign: "center",
	},
	buttonText: {
		color: "white",
	},
	text: {
		fontSize: 20,
	},
});
