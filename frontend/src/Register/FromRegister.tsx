import React from "react";

interface IFormRegister {
	register: any;
	handleSubmit: () => void;
}

const FormRegister: React.FC<IFormRegister> = (props) => {
	return (
		<>
			<form onSubmit={props.handleSubmit}>
				<div>
					<label>Username</label>
					<input
						type="text"
						className="form-control"
						{...props.register("username")}
					/>
				</div>
				<div>
					<label>Email</label>
					<input
						type="email"
						className="form-control"
						{...props.register("email")}
					/>
				</div>
				<div>
					<label>Password</label>
					<input
						type="password"
						className="form-control"
						{...props.register("password")}
					/>
				</div>
				<div>
					<label>Confirm Password</label>
					<input
						type="password"
						className="form-control"
						{...props.register("confirmPassword")}
					/>
				</div>
				<input type="submit" />
			</form>
		</>
	);
};
export default FormRegister;
