import React from "react";
import ClusterItem from "../ClusterItem/ClusterItem";
import "./ClusterList.scss";
const ClusterList = (props) => {
	const draggable = props.isDraggable;

	return (
		<div className="cluster-list">
			<div className="option-list-title">선택지 목록</div>

			{props.clusterList &&
				props.clusterList.map((c) => {
					if (c.ansRep !== null) {
						return (
							<div id={c._id} className="option-item-wrapper" key={c._id}>
								<ClusterItem clusterInfo={c} id={c._id} type={true} />
							</div>
						);
					}
				})}
			{props.clusterList &&
				props.clusterList.map((c) => {
					if (c.disRep !== null) {
						return (
							<div id={c._id} className="option-item-wrapper" key={c._id}>
								<ClusterItem clusterInfo={c} id={c._id} type={false} />
							</div>
						);
					}
				})}
		</div>
	);
};

export default ClusterList;
