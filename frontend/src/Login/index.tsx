import React from "react";
import FormLogin from "./FormLogin";
import { useForm } from "react-hook-form";

const Login = () => {
	const { register, handleSubmit } = useForm();
	const submitLogin = handleSubmit(async (data) => {
		await fetch(`http://localhost:8080/api/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
	});
	return (
		<>
			<h3>Login</h3>
			<FormLogin register={register} handleSubmit={submitLogin} />
		</>
	);
};
export default Login;
