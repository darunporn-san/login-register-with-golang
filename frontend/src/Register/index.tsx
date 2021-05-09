import React, { useState } from "react";
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
	const [cRegister,setCRegister] = useState('')	
	const submitRegister = handleSubmit(async (data) => {
		const response = await fetch(`http://localhost:8080/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const userLogin = await response.json()
		if(userLogin.InsertedID){
			setCRegister('Completed Register Success')
		}else if(userLogin.Error === "error"){
			setCRegister('Email duplicated')
		}
	});
	return (
		<>
			<div className="row h-100">
				<div className="col m-auto">{cRegister}</div>
				<div className="formLR col">
					<div className="designFromRegister">	
						<h3 className="text-center">Register</h3>
						<FormRegister
							register={register}
							error={errors}
							handleSubmit={submitRegister}
						/>
						<hr   />
						<div className="text-end"><a href="/login">Login</a></div>
					</div>
				</div>

			</div>
			
			
		</>
	);
};
export default Register;
