import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import BucketListScreen from "../screens/BucketListScreen";
import ProfileScreen from "../screens/ProfileScreen";

// expo's icon library
import { FontAwesome } from "@expo/vector-icons";
import CryptoScreen from "../screens/CryptoScreen";
import HabitScreen from "../screens/HabitScreen";
import SleepScreen from "../screens/SleepScreen";
import Transactions from "../screens/Transactions";
import Stats from "../screens/Stats";

export default function Navigation() {
	return <RootNavigator />;
}

// used to display modal (tabs) on top of other content
const Stack = createNativeStackNavigator();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Root"
				component={BottomTabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Transactions"
				component={Transactions}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Stats"
				component={Stats}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
	return (
		<BottomTab.Navigator initialRouteName="TabOne">
			<BottomTab.Screen
				name="TabOne"
				component={HomeScreen}
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="TabTwo"
				component={BucketListScreen}
				options={{
					title: "Bucket",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="list-ul" color={color} />
					),
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="TabThree"
				component={HabitScreen}
				options={{
					title: "Habits",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="table" color={color} />,
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="TabFour"
				component={CryptoScreen}
				options={{
					title: "Crypto",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="bitcoin" color={color} />
					),
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="TabFive"
				component={SleepScreen}
				options={{
					title: "Sleep",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="bed" color={color} />,
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="TabSix"
				component={ProfileScreen}
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
					tabBarActiveTintColor: "black",
				}}
			/>
		</BottomTab.Navigator>
	);
}

// for use with tab bar icons, necessary
function TabBarIcon(props) {
	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
