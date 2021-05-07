import React from "react";
import FormRegister from "./FromRegister";
import { useForm } from "react-hook-form";

const Register = () => {
	const { register, handleSubmit } = useForm();
	const submitRegister = handleSubmit((data) => console.log(data));
	return (
		<>
			<h3>Register</h3>
			<FormRegister register={register} handleSubmit={submitRegister} />
		</>
	);
};
export default Register;
