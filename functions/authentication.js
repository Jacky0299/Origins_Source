import AsyncStorage from '@react-native-async-storage/async-storage';
const handleLogin = async (email, password, navigation) => {
    try {
        const response = await fetch('https://origins-source.com/account-page/mobile_signin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password: password
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (response.ok) {
            if (data.status === "success") {
                await AsyncStorage.setItem('@email', data.email);
                console.log('Login successful');
                // navigation.replace('Home');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                alert("Wrong Username Or Password");
            }
        } else {
            alert("An error occurred. Please try again later.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
};

export { handleLogin };