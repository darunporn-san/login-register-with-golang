import React from "react";
import FormLogin from "./FormLogin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../Validate/Login";
import { ILogin } from "../Typing/RegisterLogin";
import Modal from '../Modal'
const Login = () => {
	const [users,serUsers] = React.useState('')
	const [modal,setModal] = React.useState(false)
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<ILogin>({
		resolver: yupResolver(LoginSchema),
		mode: "onChange",
	});
	const submitLogin = handleSubmit(async (data) => {
		const response = await fetch(`http://localhost:8080/api/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const userLogin = await response.json()
		if(userLogin.Result === "No User"){
			setModal(true)
		}else if(userLogin.access_token){
			serUsers('Completed Login Success')
		}else if(userLogin.Error === "error"){
			serUsers('Wrong Password')
		}
	});

	const openModal = () =>{
		setModal(!modal)
	}

	const createAccount = () =>{
		window.location.href = "/register";
		setModal(false)
	}
	return (
		<>
			<div className="row h-100 ">
				<div className="col m-auto">{users}</div>
				<div className="formLR col">
					<div className="designFromLogin">
						<h3 className="text-center">Login</h3>
						<FormLogin
							register={register}
							error={errors}
							handleSubmit={submitLogin}
						/>
						<hr   />
						<div className="text-end">New Member?<a href="/register"> Sign Up Now</a></div>
					</div>
					<Modal show = {modal} handleClose = {openModal} createAccount={createAccount}>
						<h5>You are not member, Do you create account?</h5>
					</Modal>
					
				</div>
				
			</div>
			
		</>
	);
};
export default Login;
