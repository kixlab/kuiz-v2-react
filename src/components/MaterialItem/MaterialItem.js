import React from "react";
import './MaterialItem.scss'

const MaterialItem = (props) => {
    const item = props.item
    return(
        <div>{item}</div>
    );
}
export default MaterialItem