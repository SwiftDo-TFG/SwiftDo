import React from "react";
import { View, Animated, useWindowDimensions } from "react-native";
import { slider } from "../../screens/settings/settings.styles";

const Paginator = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', height: 64, justifyContent: 'center' }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                });
                
                // Calculate opacity based on scroll position
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return <Animated.View style={[slider.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
            })}
        </View>
    );
}

export default Paginator;
