
const commonColor = {
    commonWhite: '#FFFFFF',
    commonBlack: '#000000',
    activeColor: '#DE5E69',
    deactiveColor: '#DE5E6950',
    boxActiveColor: '#DE5E6940',
    light: "#EEEDED",
    dark: "#272C34",
    grey: "#A9A9A9",
    orange: "#FFA500",
    green: "#008080",
    red: "#E51A4A",
    yellow: "#FFD700",
    noir: "#1D2129",
    brown: "#D2B48C",
    redFlag: "B30000",
    softGrey: "#e3e4e5",
    darkRed: "B30000",
    paper: "#F2F2F2"
};
  
const light = {
    themeColor: '#FFFFFF',
    white: '#000000',
    sky: '#DE5E69',
    gray: 'gray',
    ...commonColor,
};

const dark = {
    themeColor: '#000000',
    white: '#FFFFFF',
    sky: '#831a23',
    gray: 'white',
    ...commonColor,
};


export default { light, dark };