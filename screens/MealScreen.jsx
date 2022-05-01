import React, {useEffect, useState} from "react"
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Pressable,
	ScrollView,
	Keyboard,
} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {auth, firebase} from "../firebase"
import {Ionicons} from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

const Meals = ({route}) => {
	const [loading, setLoading] = useState(true)
	const [reload, setReload] = useState(false)

	const [meal, setMeal] = useState("")

	const [macroInputRows, setMacroInputRows] = useState([
		{calories: 0.0, fat: 0.0, carbs: 0.0, protein: 0.0},
	])

	const [mealNames, setMealNames] = useState([])
	const [mealData, setMealData] = useState([])

	const navigation = useNavigation()

	const macros = route.params.macros

	const day = Object.keys(macros)[0]

	const user = auth.currentUser
	const macroRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("macros")
		.doc(day)

	const back = () => {
		navigation.navigate("Root", {screen: "Macros"})
	}

	useEffect(() => {
		getData()
	}, [reload])

	const getData = () => {
		macroRef
			.get()
			.then((doc) => {
				if (doc.exists) {
					setMealNames(Object.keys(doc.data()))
					setMealData(doc.data())
				} else {
					console.log("no such doc")
				}
			})
			.then(() => {
				setLoading(false)
			})
			.catch((err) => console.log("error getting doc:", err))
	}

	const addMeal = () => {
		if (meal !== "") {
			setLoading(true)

			// totals
			let calories = 0.0
			let fat = 0.0
			let carbs = 0.0
			let protein = 0.0

			// get total from every ingredient in meal
			for (let ingredient of macroInputRows) {
				calories += Math.round(ingredient.calories)
				fat += Math.round(ingredient.fat)
				carbs += Math.round(ingredient.carbs)
				protein += Math.round(ingredient.protein)
			}

			macroRef
				.update({
					[meal]: {
						calories: calories,
						fat: fat,
						carbs: carbs,
						protein: protein,
					},
				})
				.then(() => {
					// clean up
					setMeal("")
					setMacroInputRows([
						{calories: 0.0, fat: 0.0, carbs: 0.0, protein: 0.0},
					])
					Keyboard.dismiss()
					setReload((reload) => !reload)
					console.log(`added new meal: ${meal}`)
				})
				.catch((err) => console.log(err))
		}
	}

	const addInput = () => {
		setMacroInputRows([
			...macroInputRows,
			{calories: 0.0, fat: 0.0, carbs: 0.0, protein: 0.0},
		])
		setReload((reload) => !reload)
		console.log("macroInputRows:", macroInputRows)
	}

	const deleteInput = (index) => {
		console.log("delete")
		let copy = macroInputRows
		copy.splice(index, 1)
		setMacroInputRows(copy)
		setReload((reload) => !reload)
		console.log("rows:", macroInputRows)
	}

	function MacroInputs() {
		return macroInputRows.map((elem, index) => (
			<View style={styles.row} key={index}>
				<TextInput
					placeholder="calories"
					value={elem.calories}
					onChangeText={(text) => (elem.calories = text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="fat"
					value={elem.fat}
					onChangeText={(text) => (elem.fat = text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="carbs"
					value={elem.carbs}
					onChangeText={(text) => (elem.carbs = text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="protein"
					value={elem.protein}
					onChangeText={(text) => (elem.protein = text)}
					style={styles.input}
				/>
				{index == macroInputRows.length - 1 ? (
					<TouchableOpacity onPress={addInput}>
						<Ionicons name="add-circle" size={32} color="black" />
					</TouchableOpacity>
				) : (
					<TouchableOpacity onPress={() => deleteInput(index)}>
						<Ionicons name="close-circle-outline" size={32} color="black" />
					</TouchableOpacity>
				)}
			</View>
		))
	}

	const deleteMeal = (elem) => {
		setLoading(true)
		console.log("elem:", elem)
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		macroRef
			.update({[elem]: firebase.firestore.FieldValue.delete()})
			.then(() => {
				console.log(elem, "deleted")
				setReload((reload) => !reload)
			})
			.catch((err) => console.log(err))
	}

	function Meals() {
		return mealNames.sort().map((elem, index) => (
			<View style={styles.mealContainer} key={index}>
				<Pressable onLongPress={() => deleteMeal(elem)}>
					<Text style={styles.mealText}>{elem}</Text>
				</Pressable>
				<View style={styles.row}>
					<Text style={styles.detailsText}>
						calories: {mealData[elem].calories},{" "}
					</Text>
					<Text style={styles.detailsText}>fat: {mealData[elem].fat}g, </Text>
					<Text style={styles.detailsText}>
						carbs: {mealData[elem].carbs}g,{" "}
					</Text>
					<Text style={styles.detailsText}>
						protein: {mealData[elem].protein}g
					</Text>
				</View>
			</View>
		))
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.heading}>
					<Text style={styles.headerText}>Macros</Text>
				</View>
				<TouchableOpacity onPress={back} style={styles.close}>
					<Ionicons name="close-sharp" size={32} color="white" />
				</TouchableOpacity>
			</View>
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
					<MacroInputs />
					<TouchableOpacity onPress={addMeal} style={styles.addButton}>
						<Text style={styles.buttonText}>Add</Text>
					</TouchableOpacity>
					<ScrollView style={styles.scrollView}>
						<Meals />
					</ScrollView>
				</View>
			)}
		</SafeAreaView>
	)
}

export default Meals

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
		marginTop: "5%",
	},
	row: {
		flexDirection: "row",
		alignSelf: "stretch",
	},
	scrollView: {
		marginTop: "5%",
		alignSelf: "stretch",
	},
	mealContainer: {
		marginBottom: "5%",
	},
	mealInput: {
		padding: "2%",
		borderWidth: 2,
		marginBottom: "5%",
		borderRadius: 5,
		fontSize: 20,
	},
	input: {
		padding: "2%",
		width: "21%",
		borderWidth: 1,
		marginBottom: "5%",
		marginRight: "2%",
		borderRadius: 5,
	},
	addButton: {
		padding: "5%",
		borderRadius: 5,
		backgroundColor: "black",
		alignSelf: "center",
	},
	buttonText: {
		color: "white",
	},
	mealText: {
		fontSize: 22.5,
	},
	detailsText: {
		fontSize: 15,
	},
})
