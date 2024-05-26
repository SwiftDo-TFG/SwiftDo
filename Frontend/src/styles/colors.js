
const commonColor = {    
    grey: "#A9A9A9",
    orange: "#FFA500",
    green: "#008080",
    red: "#E51A4A",
    yellow: "#FFD700",
    noir: "#1D2129",
    brown: "#D2B48C",
    softGrey: "#e3e4e5",
    darkRed: "B30000",
};
  
const light = {
    themeColor: '#F2F2F2',
    white: '#000000',
    red: '#DE5E69',
    activeColor: '#FFFFFF',
    selectColor: '#FCC89D',
    configInput: '#9e9e9e',
    ...commonColor,
};

const dark = {
    themeColor: '#000000',
    white: '#FFFFFF',
    red: '#831a23',
    activeColor: '#1C1F21', /*Gris antracita*/
    selectColor: '#FCC89D',
    configInput: '#9e9e9e',
    ...commonColor,
};


export default { light, dark };