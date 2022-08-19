import React,{useState, useEffect} from "react"
import { useParams } from "react-router"
import axios from "axios"
import ClusterItem from "../ClusterItem/ClusterItem"
import {useDispatch, useSelector} from 'react-redux'
import './ClusterList.scss'
const ClusterList = (props) => {

    return(
        <div>
            <div className="option-list-title">Cluster List</div>
            
            {props.clusterList.map(c => {
                if(c.ansRep !== null ) {
                    return <div id={c._id} className="option-item-wrapper"><ClusterItem clusterInfo={c} id={c._id} type={true}/></div>
                }
            })}
            <hr/>
            {props.clusterList.map(c => {
                if(c.disRep !== null) {
                    return <div id={c._id} className="option-item-wrapper"><ClusterItem clusterInfo={c} id={c._id} type={false}/></div>
                }
            })}
        </div>
    );
}

export default ClusterList