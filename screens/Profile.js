import { View, Text, TextInput, TouchableOpacity, Button, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GlobalContext from "../context/Context";
import { pickImage, askForPermission, uploadImage } from "../utils";

import { auth, db } from "../firebase";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { DebugInstructions } from "react-native/Libraries/NewAppScreen";

export default function Profile() {
    const [displayName, setDisplayName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState(null);
    const navigation = useNavigation();

    const {theme: {colors},} = useContext(GlobalContext);

    // Wait for the user give permission to select image
    useEffect(() => {
        (async() => {
            const status = await askForPermission();
            setPermissionStatus(status);
        })();
    }, []);

    // Handle the button press to select image.
    async function handlePress() {
        const user = auth.currentUser; // Get the user from firebase auth.
        let photoURL;
        if (selectedImage) { // If theres the image, upload it.
            const { url } = await uploadImage(
                selectedImage, 
                `images/${user.uid}`, 
                "profilePicture"
            );
            photoURL = url;
        }
        const userData = { // Store user data in this so we can pass it
            displayName,
            email: user.email
        }
        if (photoURL) { // If we've set the photoURL, store it in "userData"
            userData.photoURL = photoURL;
        }
        console.log({ ... userData, uid: user.uid });
        await Promise.all([
            updateProfile(user, userData),
            setDoc(doc(db, "users", user.uid), { ... userData, uid: user.uid })
        ])
        navigation.navigate("home")
    }

    // Handle the result after image is selected
    async function handleProfilePicture() {
        const result = await pickImage()
        if (!result.canceled) {
            setSelectedImage(result.uri);
        }
    }

    // If theres no permission result yet, display "Loading"
    if (!permissionStatus) {
        return <Text>Loading</Text>
    }

    // If user doesn't give permission, say its needed anyway
    if (permissionStatus !== "granted") {
        return <Text>You need to allow this permission</Text>
    }


    // User interface
    return (
        <React.Fragment>
            <StatusBar style="auto" />
            <View 
                style={{
                    alignItems: "center", 
                    justifyContent: "center", 
                    flex: 1, 
                    paddingTop: Constants.statusBarHeight + 20,
                    padding: 20
                }}>
                <Text style={{fontSize: 22, color: colors.foreground}}>
                    Hi Profile
                </Text>
                <Text style={{fontSize: 14, color: colors.text, marginTop: 20}}>
                    Please provide your name and an optional profile photo
                </Text>
                <TouchableOpacity
                    onPress={handleProfilePicture} 
                    style={{
                        marginTop: 30, 
                        borderRadius: 120, 
                        width: 120, 
                        height: 120, 
                        backgroundColor: colors.background, 
                        alignItems: "center", 
                        justifyContent: "center",
                    }}
                >
                    {!selectedImage ? (
                        <MaterialCommunityIcons 
                            name="camera-plus" 
                            color={colors.iconGray}
                            size={45}
                        />
                    ) : (
                        <Image 
                            source={{ uri: selectedImage }}
                            style={{ width: "100%", height: "100%", borderRadius: 120 }}
                        />
                    )}
                </TouchableOpacity>
                <TextInput 
                    placeholder="Type your name" 
                    value={displayName} 
                    onChangeText={setDisplayName}
                    style={{
                        borderBottomColor: colors.primary,
                        marginTop: 40,
                        borderBottomWidth: 2,
                        width: "100%",
                    }}
                />
                <View
                    style={{
                        marginTop: "auto",
                        width: 80
                    }}
                >
                    <Button
                        title="Next"
                        color={colors.secondary}
                        onPress={handlePress}
                        disabled={!displayName}
                    />
                </View>
            </View>
        </React.Fragment>
    )
}