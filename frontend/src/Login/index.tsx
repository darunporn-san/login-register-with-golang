import React from "react";
import FormLogin from "./FormLogin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../Validate/Login";
import { ILogin } from "../Typing/RegisterLogin";
const Login = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<ILogin>({
		resolver: yupResolver(LoginSchema),
		mode: "onChange",
	});
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
			<FormLogin
				register={register}
				error={errors}
				handleSubmit={submitLogin}
			/>
		</>
	);
};
export default Login;
