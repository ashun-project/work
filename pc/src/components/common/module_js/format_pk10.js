const PK_10 = [
    { color: "#fffc00", ball: "01" },
    { color: "#0054ff", ball: "02" },
    { color: "#001868", ball: "03" },
    { color: "#ff5b00", ball: "04" },
    { color: "#00c0ff", ball: "05" },
    { color: "#5d06f4", ball: "06" },
    { color: "#b2b2b2", ball: "07" },
    { color: "#f70400", ball: "08" },
    { color: "#ad0000", ball: "09" },
    { color: "#0ad500", ball: "10" }
];
export default function (ball) {
    for (let j = 0, len2 = PK_10.length; j < len2; j++) {
        if (ball === PK_10[j].ball) {
            return {
                bg: PK_10[j].color,
                clr: PK_10[j].color === "#fffc00" ? "#000" : "#fff"
            }
        }
    }
}