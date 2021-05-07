import React from "react";
import FormLogin from "./FormLogin";
import { useForm } from "react-hook-form";

const Login = () => {
	const { register, handleSubmit } = useForm();
	const submitLogin = handleSubmit((data) => console.log(data));
	return (
		<>
			<h3>Login</h3>
			<FormLogin register={register} handleSubmit={submitLogin} />
		</>
	);
};
export default Login;
