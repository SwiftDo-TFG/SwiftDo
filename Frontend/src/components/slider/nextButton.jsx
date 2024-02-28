import React, { useEffect, useRef, useState } from "react";
import { View, Animated, TouchableOpacity } from "react-native";
import Svg, { G, Circle } from 'react-native-svg'
import { slider } from "../../screens/settings/settings.styles";
import { AntDesign } from '@expo/vector-icons';

const NextButton = ({ percentage, onNextPress, isLastPage }) => {
    const size = 128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circunference = 2 * Math.PI * radius;

    const [strokeDashoffset, setStrokeDashoffset] = useState(circunference);

    const progressAnimation = useRef(new Animated.Value(0)).current;

    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        animation(percentage);
    }, [percentage])

    useEffect(() => {
        progressAnimation.addListener((animate) => {
            const newStrokeDashoffset = circunference - (circunference * animate.value) / 100;
            setStrokeDashoffset(newStrokeDashoffset);
        });

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, []);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={center}>
                    <Circle
                        stroke="#e6e7e8"
                        fill='transparent'
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke="#ffa420"
                        cx={center}
                        cy={center}
                        r={radius}
                        fill='transparent'
                        strokeWidth={strokeWidth}
                        strokeDasharray={circunference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </G>
            </Svg>
            <TouchableOpacity style={slider.button} activeOpacity={0.6} onPress={onNextPress}>
                <AntDesign name={isLastPage ? "check" : "arrowright"} size={32} color="#ffffff" />
            </TouchableOpacity>
        </View >
    );
}

export default NextButton;
