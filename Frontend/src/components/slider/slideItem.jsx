import { View, Text, Image, useWindowDimensions } from 'react-native';
import { slider } from '../../screens/settings/settings.styles';

const SlideItem = ({ item }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={[slider.containerSlider, { width }]}>
            <View  style={{ height: '60%'}}>
                <Image source={item.image} style={[slider.image, { width, resizeMode: 'contain', maxWidth: width - 35 }]} />
            </View>
            <View style={{ height: '30%', paddingRight: 25}}>
                <Text style={slider.title}>{item.title}</Text>
                <Text style={slider.description}>{item.description}</Text>
            </View>
        </View>
    )
}


export default SlideItem;