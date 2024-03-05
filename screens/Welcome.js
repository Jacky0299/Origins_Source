import { Linking, View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {

    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.yellow, COLORS.orange]}
        >
            <View style={{ flex: 1 }}>
                <View>
                    <Image
                        source={require("../assets/logo.png")}
                        style={{ height: 100, width: 300, borderRadius: 20 }}
                        resizeMode="contain"
                    />
                    <Image
                        source={require("../assets/why-user.png")}
                        style={{
                            height: 110,
                            width: 110,
                            borderRadius: 20,
                            position: "absolute",
                            top: 80,
                            transform: [
                                { translateX: 20 },
                                { translateY: 50 },
                                { rotate: "-15deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/why-battery.png")}
                        style={{
                            height: 120,
                            width: 120,
                            borderRadius: 20,
                            position: "absolute",
                            top: 50,
                            left: 150,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "-5deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/why-security.png")}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 20,
                            position: "absolute",
                            top: 230,
                            left: -30,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "15deg" }
                            ]
                        }}
                    />
                    <Image
                        source={require("../assets/product.png")}
                        style={{ height: 100, width: 300, borderRadius: 20, top: 200, left: 100,}}
                        resizeMode="contain"
                    />
                </View>

                {/* content  */}

                <View style={{
                    paddingHorizontal: 22,
                    position: "absolute",
                    top: 400,
                    width: "100%"
                }}>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: 800,
                        color: COLORS.white
                    }}>Let's Get</Text>
                    <Text style={{
                        fontSize: 46,
                        fontWeight: 800,
                        color: COLORS.white
                    }}>Started</Text>

                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                            marginVertical: 4
                        }}>Monitor With Ease</Text>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                        }}>Using Our Versatile Trackers</Text>
                    </View>

                    <Button
                        title="Sign In"
                        onPress={() => navigation.navigate("Login")}
                        style={{
                            marginTop: 22,
                            width: "100%"
                        }}
                    />

                    <View style={{
                        flexDirection: "row",
                        marginTop: 12,
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white
                        }}>Do not have an account ?</Text>
                        <Pressable
                            onPress={() => Linking.openURL('https://origins-source.com/account-page/signup.php')}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                                fontWeight: "bold",
                                marginLeft: 4
                            }}>Sign Up</Text>
                        </Pressable>

                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

export default Welcome