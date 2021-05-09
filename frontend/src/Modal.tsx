import React from "react";

interface IModal {
	handleClose: () => void;
	show: boolean;
	children: any;
	createAccount: () => void;
}
const Modal: React.FC<IModal> = (props) => {
	const showHideClassName = props.show ? "modal d-block" : "modal d-none";

	return (
		<div className={showHideClassName}>
			<div className="popupModal modal-container text-center">
				<div className="py-3">
					{props.children}
					<div className="d-grid gap-2 d-md-flex mt-3 justify-content-md-center">
						<button
							className="btn btn-secondary me-md-2"
							type="button"
							onClick={props.handleClose}>
							No
						</button>
						<button
							className="btn btn-primary"
							type="button"
							onClick={props.createAccount}>
							Yes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
