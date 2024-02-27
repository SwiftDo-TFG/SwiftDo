import { Appearance } from "react-native";
import styles from "../styles/colors";
import React from "react";


function Theme() {
    const [theme, setTheme] = useState(Appearance.getColorScheme())
    Appearance.addChangeListener((color) =>{
        console.log(color);
    });
    
}

export default Theme;