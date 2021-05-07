import React from "react";

interface IFormLogin {
	register: any;
	handleSubmit: () => void;
}

const FormLogin: React.FC<IFormLogin> = (props) => {
	return (
		<>
			<form onSubmit={props.handleSubmit}>
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
				<input type="submit" />
			</form>
		</>
	);
};
export default FormLogin;
