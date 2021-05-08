import React from "react";
import FormRegister from "./FromRegister";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../Validate/Register";
import { yupResolver } from "@hookform/resolvers/yup";
import { IRegister } from "../Typing/RegisterLogin";

const Register = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<IRegister>({
		resolver: yupResolver(RegisterSchema),
		mode: "onChange",
	});
	console.log(errors);
	
	const submitRegister = handleSubmit(async (data) => {
		await fetch(`http://localhost:8080/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
	});
	return (
		<>
			<h3>Register</h3>
			<FormRegister
				register={register}
				error={errors}
				handleSubmit={submitRegister}
			/>
		</>
	);
};
export default Register;
