import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, firebase } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const SleepScreen = () => {
	const navigation = useNavigation();

	const viewMore = () => {
		navigation.replace("Sleep Calculator");
	};

	const [reload, setReload] = useState(false);
	const [sleepData, setSleepData] = useState([]);
	const [time, setTime] = useState();
	const [picker, setPicker] = useState({ show: false, date: null, type: null });
	const [sleepTimes, setSleepTimes] = useState([]);
	const [wakeTimes, setWakeTimes] = useState([]);

	const today = new Date(Date.now()).toDateString();

	const user = auth.currentUser;
	const sleepRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("sleep");

	// populate sleep and wake times
	const loadSleepTimes = () => {
		let tempSleepTimes = [];
		for (let hour = 9; hour < 15; hour++) {
			for (let minutes = 0; minutes < 60; minutes += 5) {
				let minutesString = "";
				if (minutes == 0) {
					minutesString = ":00 ";
				} else if (minutes == 5) {
					minutesString = ":05 ";
				} else {
					minutesString = ":" + minutes + " ";
				}
				if (hour < 12) {
					tempSleepTimes.push(hour + minutesString + "pm");
				} else if (hour == 12) {
					tempSleepTimes.push(hour + minutesString + "am");
				} else {
					tempSleepTimes.push(hour - 12 + minutesString + "am");
				}
			}
		}
		setSleepTimes(tempSleepTimes);
	};

	const loadWakeTimes = () => {
		let tempWakeTimes = [];
		for (let hour = 5; hour < 11; hour++) {
			for (let minutes = 0; minutes < 60; minutes += 5) {
				let minutesString = "";
				if (minutes == 0) {
					minutesString = ":00 ";
				} else if (minutes == 5) {
					minutesString = ":05 ";
				} else {
					minutesString = ":" + minutes + " ";
				}
				tempWakeTimes.push(hour + minutesString + "am");
			}
		}
		setWakeTimes(tempWakeTimes);
	};

	// set up; load sleep and wake times
	useEffect(() => {
		loadSleepTimes();
		loadWakeTimes();
	}, []);

	useEffect(() => {
		// create new entry for today
		sleepRef.doc(today).onSnapshot((response) => {
			if (response.exists) {
				console.log("sleep ref exist for", today);
				getSleepData();
			} else {
				console.log("creating new sleep entry for", today);
				sleepRef.doc(today).set({ sleep: "???", wake: "???" });
				getSleepData();
			}
		});
	}, [reload]);

	const getSleepData = () => {
		let tempDocs = [];
		sleepRef.get().then((res) => {
			res.forEach((doc) => {
				tempDocs.push({ [doc.id]: doc.data() });
				console.log({ [doc.id]: doc.data() });
			});
			setSleepData(
				tempDocs
					.sort((a, b) => new Date(Object.keys(a)) - new Date(Object.keys(b)))
					.reverse()
			);
		});
	};

	const updateTime = (date, type) => {
		console.log("time updated");
		// update sleep or wake time depending on type given
		if (type === "sleep") {
			sleepRef
				.doc(String(date))
				.update({ sleep: time })
				.then(() => {
					setReload(!reload);
					console.log(`updated ${date} with sleep time ${time}, reloading`);
				});
		} else if (type === "wake") {
			sleepRef
				.doc(String(date))
				.update({ wake: time })
				.then(() => {
					setReload(!reload);
					console.log(`updated ${date} with wake time ${time}, reloading`);
				});
		}
	};

	const SleepData = () => {
		return sleepData.map((item, index) => (
			<View styles={styles.sleepDataContainer} key={index}>
				<View style={styles.sleepEntry}>
					{String(Object.keys(item)) === today ? (
						<View style={styles.todayDateContainer}>
							<Text style={styles.todayDateText}>{Object.keys(item)}</Text>
						</View>
					) : (
						<View style={styles.dateContainer}>
							<Text style={styles.dateText}>{Object.keys(item)}</Text>
						</View>
					)}
					<TouchableOpacity
						onPress={() =>
							setPicker({ show: true, date: index, type: "sleep" })
						}
						style={styles.sleepContainer}
					>
						<Text style={styles.valueText}>{Object.values(item)[0].sleep}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setPicker({ show: true, date: index, type: "wake" })}
						style={styles.wakeContainer}
					>
						<Text style={styles.valueText}>{Object.values(item)[0].wake}</Text>
					</TouchableOpacity>
				</View>
				{/* show picker when time input is clicked, date corresponds to index key*/}
				{picker.show && picker.date == index && (
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={time}
							onValueChange={(itemValue, itemIndex) => setTime(itemValue)}
							style={styles.picker}
						>
							{picker.type === "sleep"
								? sleepTimes.map((item, index) => (
										<Picker.Item label={item} value={item} key={index} />
								  ))
								: wakeTimes.map((item, index) => (
										<Picker.Item label={item} value={item} key={index} />
								  ))}
						</Picker>
						<TouchableOpacity
							onPress={() => {
								updateTime(Object.keys(item), picker.type);
								setPicker({ show: false, date: null, type: null });
							}}
							style={styles.icon}
						>
							<Ionicons name="checkmark-outline" size={32} color="black" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setPicker({ show: false, date: null, type: null })}
							style={styles.icon}
						>
							<Ionicons name="close-outline" size={32} color="black" />
						</TouchableOpacity>
					</View>
				)}
			</View>
		));
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Sleep</Text>
			<ScrollView>
				<SleepData />
			</ScrollView>
			<TouchableOpacity onPress={viewMore} style={styles.bottomButton}>
				<Text style={styles.buttonText}>Sleep Calculator</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default SleepScreen;

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
	sleepDataContainer: {},
	sleepContainer: {
		marginHorizontal: "5%",
		justifyContent: "center",
	},
	wakeContainer: {
		marginHorizontal: "5%",
		justifyContent: "center",
	},
	todayDateContainer: {
		backgroundColor: "black",
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
	},
	sleepEntry: {
		flexDirection: "row",
		marginVertical: "2.5%",
	},
	picker: {
		width: 150,
	},
	pickerContainer: {
		alignSelf: "center",
		flexDirection: "row",
	},
	dateContainer: {
		alignSelf: "stretch",
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
	},
	icon: {
		justifyContent: "center",
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
	buttonText: {
		color: "white",
	},
	dateText: {
		fontSize: 20,
	},
	todayDateText: {
		fontSize: 20,
		color: "white",
	},
	valueText: {
		fontSize: 15,
	},
});
