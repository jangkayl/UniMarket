"use client";

import { useState, useActionState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { changePassword } from "@/app/actions/settings"; // Import the action

// Helper component for the Toggle Switch
const ToggleSwitch = ({
	isOn,
	handleToggle,
}: {
	isOn: boolean;
	handleToggle: () => void;
}) => (
	<div
		onClick={handleToggle}
		className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
			isOn ? "bg-red-900" : "bg-gray-300"
		}`}>
		<div
			className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
				isOn ? "translate-x-6" : "translate-x-0"
			}`}></div>
	</div>
);

const SettingsPage = () => {
	// State for toggle switches
	const [emailNotif, setEmailNotif] = useState(true);
	const [pushNotif, setPushNotif] = useState(true);
	const [inAppNotif, setInAppNotif] = useState(false);
	const [dataSharing, setDataSharing] = useState(false);
	const [twoFactor, setTwoFactor] = useState(true);

	// Form Action for Password Change
	const [state, formAction, isPending] = useActionState(
		changePassword,
		undefined
	);

	return (
		<div className="bg-white min-h-screen flex flex-col text-gray-900">
			<Navbar />

			<main className="grow w-full max-w-[1600px] mx-auto px-6 py-10">
				<h1 className="text-4xl font-bold mb-10 text-black">Settings</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					{/* ---------------- CARD 1: ACCOUNT SETTINGS ---------------- */}
					<div className="border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
						<div className="flex gap-4 mb-6">
							<div className="text-red-800 mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-person"
									viewBox="0 0 16 16">
									<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
								</svg>
							</div>
							<div>
								<h2 className="text-xl font-bold">Account Settings</h2>
								<p className="text-gray-500 text-sm mt-1">
									Manage your login credentials and personal details.
								</p>
							</div>
						</div>

						{/* Profile Picture Edit */}
						<div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
							<div className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden group cursor-pointer">
								<div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="40"
										height="40"
										fill="currentColor"
										className="bi bi-person-fill"
										viewBox="0 0 16 16">
										<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
									</svg>
								</div>
								<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="white"
										className="bi bi-camera-fill"
										viewBox="0 0 16 16">
										<path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
										<path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
									</svg>
								</div>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">Profile Picture</h3>
								<div className="flex gap-3 mt-2">
									<button className="text-xs font-bold text-white bg-red-900 px-3 py-2 rounded-md hover:bg-red-800 transition-colors">
										Change Picture
									</button>
									<button className="text-xs font-bold text-red-900 border border-red-900 px-3 py-2 rounded-md hover:bg-red-50 transition-colors">
										Remove
									</button>
								</div>
							</div>
						</div>

						{/* --- PASSWORD CHANGE FORM --- */}
						<form
							action={formAction}
							className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">
									Current Password
								</label>
								<input
									name="currentPassword"
									type="password"
									placeholder="********"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-800"
								/>
								{state?.errors?.currentPassword && (
									<p className="text-red-500 text-xs mt-1">
										{state.errors.currentPassword[0]}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">
									New Password
								</label>
								<input
									name="newPassword"
									type="password"
									placeholder="********"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-800"
								/>
								{state?.errors?.newPassword && (
									<p className="text-red-500 text-xs mt-1">
										{state.errors.newPassword[0]}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-1">
									Confirm New Password
								</label>
								<input
									name="confirmPassword"
									type="password"
									placeholder="********"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-800"
								/>
								{state?.errors?.confirmPassword && (
									<p className="text-red-500 text-xs mt-1">
										{state.errors.confirmPassword[0]}
									</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isPending}
								className="w-full bg-red-900 text-white font-semibold py-3 rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-400">
								{isPending ? "Updating..." : "Update Password"}
							</button>

							{/* Success/Error Message */}
							{state?.message && (
								<p
									className={`text-center text-sm mt-2 ${
										state.success ? "text-green-600" : "text-red-500"
									}`}>
									{state.message}
								</p>
							)}
						</form>

						<div className="pt-8 mt-4 border-t border-gray-100">
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								Email Address
							</label>
							<input
								type="email"
								defaultValue="student@cit.edu"
								className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-800 bg-gray-50"
							/>
							<button className="w-full bg-white border border-red-900 text-red-900 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors mt-4">
								Update Email
							</button>
						</div>
					</div>

					{/* ---------------- CARD 2: NOTIFICATION PREFERENCES ---------------- */}
					<div className="border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
						<div className="flex gap-4 mb-6">
							<div className="text-red-800 mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-bell"
									viewBox="0 0 16 16">
									<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
								</svg>
							</div>
							<div>
								<h2 className="text-xl font-bold">
									Notification <br /> Preferences
								</h2>
								<p className="text-gray-500 text-sm mt-1">
									Customize how you receive alerts and updates.
								</p>
							</div>
						</div>

						<div className="space-y-6 grow">
							<label className="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={emailNotif}
									onChange={() => setEmailNotif(!emailNotif)}
									className="mt-1 w-5 h-5 accent-red-900 border-gray-300 rounded focus:ring-red-900"
								/>
								<div>
									<span className="font-bold text-gray-800">
										Email Notifications
									</span>
									<p className="text-sm text-gray-500 mt-1">
										Receive updates and important announcements via email.
									</p>
								</div>
							</label>
							<label className="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={pushNotif}
									onChange={() => setPushNotif(!pushNotif)}
									className="mt-1 w-5 h-5 accent-red-900 border-gray-300 rounded focus:ring-red-900"
								/>
								<div>
									<span className="font-bold text-gray-800">
										Push Notifications
									</span>
									<p className="text-sm text-gray-500 mt-1">
										Get instant alerts on your mobile device.
									</p>
								</div>
							</label>
							<label className="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={inAppNotif}
									onChange={() => setInAppNotif(!inAppNotif)}
									className="mt-1 w-5 h-5 accent-red-900 border-gray-300 rounded focus:ring-red-900"
								/>
								<div>
									<span className="font-bold text-gray-800">
										In-App Notifications
									</span>
									<p className="text-sm text-gray-500 mt-1">
										See alerts directly within the UniMarket application.
									</p>
								</div>
							</label>
						</div>
						<button className="w-full bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors mt-8">
							Save Preferences
						</button>
					</div>

					{/* ---------------- CARD 3: PRIVACY & SECURITY ---------------- */}
					<div className="border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
						<div className="flex gap-4 mb-6">
							<div className="text-red-800 mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-shield-check"
									viewBox="0 0 16 16">
									<path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.826 7.18 3.422 9.676.595.571 1.16 1.056 1.69 1.455 1.573 1.164 1.528 2.052 2.659 2.052.88 0 1.666-.372 2.502-1.094 2.238-1.928 4.67-4.148 5.672-8.086a.48.48 0 0 0-.328-.39c-.91-.256-1.956-.566-2.91-.856C11.332 1.34 9.67.92 8.01 1.59c-1.658-.67-3.32.35-4.672-.35zM8 2.25c.036 0 .073.003.11.009.28.046.56.095.84.145l.235.042c1.07.195 2.18.397 3.325.567.08.012.16.012.24 0 .84-.132 1.63-.3 2.373-.497a.475.475 0 0 1 .593.535 59.86 59.86 0 0 0-1.87 6.425c-.297 1.334-.72 2.64-1.258 3.92-.09.213-.19.423-.3.63-.09-.07-.173-.146-.25-.224-2.28-2.227-3.483-5.066-2.87-8.914a.48.48 0 0 1 .45-.415z" />
									<path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
								</svg>
							</div>
							<div>
								<h2 className="text-xl font-bold">Privacy & Security</h2>
								<p className="text-gray-500 text-sm mt-1">
									Control your data sharing and account protection settings.
								</p>
							</div>
						</div>

						<div className="space-y-6 grow">
							<div className="flex justify-between items-center">
								<span className="font-bold text-gray-800">
									Enable Data Sharing
								</span>
								<ToggleSwitch
									isOn={dataSharing}
									handleToggle={() => setDataSharing(!dataSharing)}
								/>
							</div>
							<p className="text-sm text-gray-500 -mt-4">
								Allow UniMarket to share anonymous data for product improvement.
							</p>
							<div className="flex justify-between items-center pt-2">
								<span className="font-bold text-gray-800">
									Two-Factor Authentication
								</span>
								<ToggleSwitch
									isOn={twoFactor}
									handleToggle={() => setTwoFactor(!twoFactor)}
								/>
							</div>
							<p className="text-sm text-gray-500 -mt-4">
								Add an extra layer of security to your account.
							</p>
						</div>
						<div className="mt-8 space-y-4">
							<button className="w-full bg-white border border-red-900 text-red-900 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors">
								View Privacy Policy
							</button>
							<button className="w-full text-red-900 font-semibold hover:underline text-sm text-center">
								Manage Connected Apps
							</button>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default SettingsPage;
