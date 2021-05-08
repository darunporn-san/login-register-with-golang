import React from "react";
import FormRegister from "./FromRegister";
import { useForm } from "react-hook-form";

const Register = () => {
	const { register, handleSubmit } = useForm();
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
			<FormRegister register={register} handleSubmit={submitRegister} />
		</>
	);
};
export default Register;
