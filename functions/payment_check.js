import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubscriptionStatus = () => {
    const [isLoading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState(null);

    const products = ["Tier 1", "Tier 2", "Tier 1 Annual", "Tier 2 Annual"];

    const checkSubscriptionStatus = async () => {
        setLoading(true);
        setError(null);
        setIsSubscribed(false);
        const mail = await AsyncStorage.getItem('@email');
        for (const product of products) {
            try {
                const response = await fetch('https://origins-source.com/account-page/payment_check.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: mail, productId: product })
                });

                const json = await response.json();
                if (response.ok && json.hasActiveSubscription) {
                    setIsSubscribed(true);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                setError(error.toString());
                setLoading(false);
                return;
            }
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    {error ? (
                        <Text>Error: {error}</Text>
                    ) : (
                        <Text>
                            Subscription Status: {isSubscribed ? 'Active' : 'Inactive'}
                        </Text>
                    )}
                    <Button
                        title="Check Subscription Status"
                        onPress={checkSubscriptionStatus}
                    />
                </View>
            )}
        </View>
    );
};

export default SubscriptionStatus;
