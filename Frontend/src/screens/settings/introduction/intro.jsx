import { View, Text, SafeAreaView, TouchableOpacity, Dimensions, FlatList, Animated } from "react-native";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { slider } from "../settings.styles";
import styles from "../../tasks/actionScreen.styles";
import slides from "../../../components/slider/slides";
import SlideItem from "../../../components/slider/slideItem";
import Paginator from "../../../components/slider/paginator";
import NextButton from "../../../components/slider/nextButton";
import { useRef, useState, useEffect } from "react";

function Intro(props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reachedEnd, setReachedEnd] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null)

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNextPress = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < slides.length) {
            setCurrentIndex(nextIndex);
            const nextScrollX = nextIndex * Dimensions.get('window').width;
            slidesRef.current.scrollToOffset({ offset: nextScrollX, animated: true });
        } else {
            props.navigation.navigate('Inbox')
        }
    };

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / Dimensions.get('window').width);
        setCurrentIndex(index);
        scrollX.setValue(contentOffset.x);
    };

    useEffect(() => {
        if (currentIndex === slides.length - 1) {
            setReachedEnd(true);
        } else {
            setReachedEnd(false);
        }
        
    }, [currentIndex]);

    return (
        <SafeAreaView style={{ flex: 1, height: '100%' }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: Dimensions.get('window').width <= 768 ? 'space-between' : 'flex-end', alignItems: 'flex-end', marginTop: 25, marginLeft: 15 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Inbox')}>
                        <Text style={slider.omitir}>Omitir</Text>
                    </TouchableOpacity>
                </View>
                <View style={slider.container}>
                    <FlatList
                        data={slides}
                        renderItem={({ item }) => <SlideItem item={item} />}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        bounces={false}
                        onScroll={handleScroll}
                        viewabilityConfig={viewConfig}
                        scrollEventThrottle={16}
                        ref={slidesRef}
                    />
                </View>
                <Paginator data={slides} scrollX={scrollX} />
                <NextButton percentage={(currentIndex + 1) * (100 / slides.length)} onNextPress={handleNextPress} isLastPage={reachedEnd} />
            </View>
        </SafeAreaView >
    )
}


export default Intro;
