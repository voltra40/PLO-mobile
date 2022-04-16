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
import { useNavigation } from "@react-navigation/native";

const HabitScreen = () => {
	const navigation = useNavigation();

	const back = () => {
		navigation.replace("Root");
	};

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

	// today
	const today = new Date().getDate();

	const user = auth.currentUser;
	const habitRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("habits")
		.doc(months[currMonth]);

	// handle loading component
	useEffect(() => {
		console.log("today", today);
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
					<TouchableOpacity
						onPress={() => check(item, sIndex)}
						style={styles.checkBox}
						key={sIndex}
					>
						{value ? (
							<Ionicons name="checkmark" size={32} color="black" />
						) : (
							<Ionicons name="checkmark" size={32} color="white" />
						)}
					</TouchableOpacity>
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
			<View style={styles.header}>
				<View style={styles.heading}>
					<Text style={styles.headerText}>Calendar</Text>
				</View>
				<TouchableOpacity onPress={back} style={styles.close}>
					<Ionicons name="close-sharp" size={32} color="white" />
				</TouchableOpacity>
			</View>
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
						style={styles.cancel}
						onPress={() => {
							setAdding(false);
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
						}}
					>
						<Ionicons name="close-outline" size={50} color="black" />
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.calendarContainer}>
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
							<TouchableOpacity
								style={styles.addHabitButton}
								onPress={() => {
									setAdding(true);
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
								}}
							>
								<Text style={styles.addText}>Add</Text>
							</TouchableOpacity>
						</View>
						<ScrollView style={styles.scrollView} horizontal={true}>
							<View style={styles.grid}>
								<View style={styles.row}>
									{JSON.stringify(habits) !== "{}" &&
										dates.map((date, index) =>
											date === today ? (
												<View style={styles.dateBoxToday} key={index}>
													<Text style={styles.dateText}> {date} </Text>
												</View>
											) : (
												<View style={styles.dateBox} key={index}>
													<Text style={styles.dateText}> {date} </Text>
												</View>
											)
										)}
								</View>
								<Rows />
							</View>
						</ScrollView>
					</View>
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
	header: {
		alignSelf: "stretch",
		justifyContent: "center",
		flexDirection: "row",
		borderBottomWidth: 1,
		paddingVertical: "1%",
		backgroundColor: "black",
	},
	heading: {
		alignSelf: "center",
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
	close: {
		position: "absolute",
		right: 0,
		top: "-1%",
	},
	calendarContainer: {
		flex: 1,
		alignSelf: "stretch",
		justifyContent: "center",
	},
	containerColumn: {
		flexDirection: "row",
	},
	habitTypeContainer: {
		marginTop: 49,
		marginLeft: "1%",
	},
	scrollView: {
		flex: 1,
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
	habitType: {
		marginRight: "2%",
		marginBottom: 12,
	},
	grid: {},
	checkBox: {
		marginHorizontal: 6,
		marginVertical: 6,
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
	dateBoxToday: {
		width: 34,
		height: 34,
		borderWidth: 1,
		borderColor: "green",
		margin: 5,
		borderRadius: 5,
		justifyContent: "center",
		backgroundColor: "green",
	},
	dateText: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
	},
	habitTypeText: {
		fontSize: 29,
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
	},
	forward: {
		backgroundColor: "black",
		padding: 5,
		borderRadius: 5,
		justifyContent: "center",
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
		marginLeft: "5%",
		alignSelf: "stretch",
		width: 50,
		padding: 5,
		backgroundColor: "black",
		borderRadius: 5,
	},
	cancel: {
		position: "absolute",
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
	addText: {
		fontWeight: "bold",
		alignSelf: "center",
		color: "white",
		fontSize: 20,
	},
});
