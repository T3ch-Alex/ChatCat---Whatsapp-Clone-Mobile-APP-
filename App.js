//React
import React, {useState, useEffect, useContext} from "react";
import { Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

//Screens
import SignIn from './screens/SignIn';
import Profile from './screens/Profile';
import Chats from './screens/Chats';
import Photo from './screens/Photo';
import Contacts from './screens/Contacts';

//Context
import ContextWrapper from "./context/ContextWrapper";
import Context from "./context/Context";

//Expo
import { StatusBar } from 'expo-status-bar';
import { useAssets } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';

//Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';


LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
]);

//Here we create some navigators so we can change screens
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

//Here we put our component's hierarchy (kinda like html but its not html at all)
function App() {
  //useState() purpose is to handle reactive data
  //When data changes, re-render the UI
  const [currUser, setCurrUser] = useState(null); //Default user data state
  const [loading, setLoading] = useState(true); //Default loading state
  const {theme: {colors}} = useContext(Context);

  //useEffect() purpose is to return a side effect when data has changed, it REACTS :O. Kinda like a listen maybe?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setCurrUser(user);
      }
    });

    //When this component is destroyed, it returns a function, a Teardown Function :)
    return () => unsubscribe();
  }, []); //The array is a second argument to stop useEffect() from running a infinite loop

  if (loading) {
    return <Text>Loading ... </Text>
  }

  return (
    //Each component can receive atributes and get its style from the stylesheet
    <NavigationContainer style={{
      justifyContent: "center", 
      alignItems: "center",
      flex: 1,
      backgroundColor: "#aff",
      }}>
      {!currUser ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="signIn" 
            component={SignIn}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: colors.foreground,
              shadowOpacity: 0,
              elevation: 0
            },
            headerTintColor: colors.white,
          }}
        >

          {!currUser.displayName && (
            <Stack.Screen
              name="profile" 
              component={Profile}
              options={{ headerShown: false }}
            />
          )}

          <Stack.Screen 
            name="home" 
            options={{title: "ChatCat"}} 
            component={Home}
          />
          <Stack.Screen 
            name="contacts" 
            options={{title: "Select Contacts"}} 
            component={Contacts} 
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function Home() {
  const {theme: {colors},} = useContext(Context);
  return (
    <Tab.Navigator screenOptions={({route}) => {
      return {
        tabBarLabel: () => {
          if (route.name === 'photo') {
            return <Ionicons name="camera" size ={20} color={colors.white}/>
          } else {
            return (
              <Text style={{color: colors.white}}>
                {route.name.toLocaleUpperCase()} 
              </Text>
            );
          }
        },

        tabBarShowIcon: true,
        tabBarLabelStyle: {
          color: colors.white
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.white
        },
        tabBarStyle: {
          backgroundColor: colors.foreground
        }
      };
    }}
    initialRouteName="chats"
    >
      <Tab.Screen name="photo" component={Photo} />
      <Tab.Screen name="chats" component={Chats} />
    </Tab.Navigator>
  );
}

function Main() {
  //Preloading stuff
  const [assets] = useAssets(
    require("./assets/icon-square.png"),
    require("./assets/chatbg.png"),
    require("./assets/user-icon.png"),
    require("./assets/kitty.png")
  );
  if (!assets) {
    return <Text>Loading ... </Text>;
  }
  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
}

export default Main