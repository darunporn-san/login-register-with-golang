import React from "react";
import classnames from "classnames";

interface IFormRegister {
	register: any;
	error: any;
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
						className={classnames("form-control input-radius", {
							"is-invalid": props.error.username,
						})}
						{...props.register("username")}
					/>
					{props.error.username && (
						<p style={{ display: "block" }} className="invalid-feedback">
							{props.error.username.message}
						</p>
					)}
				</div>
				<div className ="mt-3">
					<label>Email</label>
					<input
						type="email"
						className={classnames("form-control input-radius", {
							"is-invalid": props.error.email,
						})}
						{...props.register("email")}
					/>
					{props.error.email && (
						<p style={{ display: "block" }} className="invalid-feedback">
							{props.error.email.message}
						</p>
					)}
				</div>
				<div className ="mt-3">
					<label>Password</label>
					<input
						type="password"
						className={classnames("form-control input-radius", {
							"is-invalid": props.error.password,
						})}
						{...props.register("password")}
					/>
					{props.error.password && (
						<p style={{ display: "block" }} className="invalid-feedback">
							{props.error.password.message}
						</p>
					)}
				</div>
				<div className ="mt-3">
					<label>Confirm Password</label>
					<input
						type="password"
						className={classnames("form-control input-radius", {
							"is-invalid": props.error.confirmPassword,
						})}
						{...props.register("confirmPassword")}
					/>
					{props.error.confirmPassword && (
						<p style={{ display: "block" }} className="invalid-feedback">
							{props.error.confirmPassword.message}
						</p>
					)}
				</div>
				<div className="text-center">
					<button type="submit" className="btn btn-primary mt-3 text-end">
						Register
					</button>
				</div>
			</form>
		</>
	);
};
export default FormRegister;
