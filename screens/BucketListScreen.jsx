import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	SafeAreaView,
	ScrollView,
	KeyboardAvoidingView,
} from "react-native";
import { auth, firebase } from "../firebase";

const BucketListScreen = () => {
	const [bucketList, setBucketList] = useState();
	const [item, setItem] = useState("");

	// firebase firestore collection
	const user = auth.currentUser;
	const bucketListRef = firebase
		.firestore()
		.collection("users")
		.doc(user.uid)
		.collection("bucket list")
		.doc("my bucket list");

	useEffect(() => {
		// get current bucket list
		bucketListRef.onSnapshot((response) => {
			// check document exist
			if (response.exists) {
				const bucketList = response.data().items;
				setBucketList(bucketList);
				console.log(bucketList);
			} else {
				console.log("Document does not exist.");
			}
		});
	}, []);

	const addItem = () => {
		if (item === "") return;
		bucketListRef
			.update({
				items: firebase.firestore.FieldValue.arrayUnion(item),
			})
			.then(() => {
				// clear input
				setItem("");
				console.log("added to items");
			})
			.catch((error) => {
				alert(error);
			});
	};

	const deleteItem = (selectedItem) => {
		bucketListRef
			.update({
				items: firebase.firestore.FieldValue.arrayRemove(selectedItem),
			})
			.then(() => {
				console.log("deleted from items");
			})
			.catch((error) => {
				alert(error);
			});
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Bucket List</Text>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="add a bucket list item"
					value={item}
					onChangeText={(text) => setItem(text)}
					style={styles.input}
				/>
				<TouchableOpacity onPress={addItem} style={styles.inputButton}>
					<Text style={styles.buttonText}>Add</Text>
				</TouchableOpacity>
			</View>
			<ScrollView style={styles.scrollView}>
				{bucketList ? (
					bucketList.map((item, index) => (
						<View style={styles.bucketListItemContainer} key={index}>
							<View style={styles.bucketListItem}>
								<Text style={styles.bucketListItemText}> {item}</Text>
							</View>
							<TouchableOpacity
								onPress={() => deleteItem(item)}
								style={styles.deleteButton}
							>
								<Text style={styles.buttonText}>Delete</Text>
							</TouchableOpacity>
						</View>
					))
				) : (
					<Text> No items </Text>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default BucketListScreen;

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
	bucketListItemContainer: {
		flexDirection: "row",
		marginBottom: "10%",
		alignSelf: "center",
		width: "80%",
	},
	bucketListItem: {
		flex: 1,
		marginRight: "5%",
	},
	bucketListItemText: {
		fontSize: 20,
	},
	deleteButton: {
		marginLeft: "auto",
		justifyContent: "center",
		padding: 5,
		borderRadius: 5,
		backgroundColor: "red",
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
	buttonContainer: {
		marginLeft: "auto",
	},
	buttonText: {
		color: "white",
	},
});
