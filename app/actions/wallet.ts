"use server";

import { revalidatePath } from "next/cache";

export async function addPaymentMethodAction(
	studentId: number,
	type: string,
	accountName: string,
	accountNumber: string
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/${studentId}/methods`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type, accountName, accountNumber }),
			}
		);
		if (res.ok) {
			revalidatePath("/profile/wallet");
			return { success: true };
		}
		return { success: false };
	} catch (e) {
		return { success: false };
	}
}

export async function deletePaymentMethodAction(methodId: number) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/methods/${methodId}`,
			{
				method: "DELETE",
			}
		);
		if (res.ok) {
			revalidatePath("/profile/wallet");
			return { success: true };
		}
		return { success: false };
	} catch (e) {
		return { success: false };
	}
}

export async function withdrawFundsAction(
	studentId: number,
	amount: number,
	provider: string,
	accountNumber: string,
	accountName: string, // New Param
	pin: string
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/${studentId}/withdraw`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					amount,
					provider,
					accountNumber,
					accountName, // Pass to backend (even if backend logic for it isn't fully utilized yet)
					pin,
				}),
			}
		);

		if (res.ok) {
			revalidatePath("/profile/wallet");
			return { success: true };
		}

		const msg = await res.text();
		return { success: false, message: msg };
	} catch (e) {
		return { success: false, message: "Network error occurred." };
	}
}

export async function addFundsAction(
	studentId: number,
	amount: number,
	provider: string,
	referenceNumber: string
) {
	try {
		const description = `Cash In via ${provider}`;
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/${studentId}/add-funds`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ amount, description, referenceNumber }),
			}
		);

		if (res.ok) {
			revalidatePath("/profile/wallet");
			return { success: true };
		}
		return { success: false };
	} catch (e) {
		return { success: false };
	}
}

export async function setWalletPinAction(
	studentId: number,
	newPin: string,
	oldPin?: string
) {
	try {
		const res = await fetch(
			`${process.env.SPRING_BOOT_API_URL}/api/wallet/${studentId}/pin`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ newPin, oldPin }),
			}
		);

		if (res.ok) {
			revalidatePath("/profile/wallet");
			return { success: true };
		}
		const msg = await res.text();
		return { success: false, message: msg };
	} catch (e) {
		return { success: false, message: "Network error" };
	}
}
