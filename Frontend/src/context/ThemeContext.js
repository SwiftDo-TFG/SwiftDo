import { Appearance } from "react-native";
import styles from "../styles/colors";



function Theme() {
    const [theme, setTheme] = useState(Appearance.getColorScheme())
}
