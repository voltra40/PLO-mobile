import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/ProfileScreen";

// expo's icon library
import { Ionicons } from "@expo/vector-icons";
import HabitScreen from "../screens/HabitScreen";
import CryptoScreen from "../screens/CryptoScreen";
import MacroScreen from "../screens/MacroScreen";
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
		<BottomTab.Navigator initialRouteName="Habits">
			<BottomTab.Screen
				name="Habits"
				component={HabitScreen}
				options={{
					title: "Habits",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="grid-outline" color={color} />
					),
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="Crypto"
				component={CryptoScreen}
				options={{
					title: "Crypto",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="logo-bitcoin" color={color} />
					),
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="Macro"
				component={MacroScreen}
				options={{
					title: "Macro",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="nutrition" color={color} />
					),
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="Sleep"
				component={SleepScreen}
				options={{
					title: "Sleep",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="bed" color={color} />,
					tabBarActiveTintColor: "black",
				}}
			/>
			<BottomTab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
					tabBarActiveTintColor: "black",
				}}
			/>
		</BottomTab.Navigator>
	);
}

// for use with tab bar icons, necessary
function TabBarIcon(props) {
	return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
