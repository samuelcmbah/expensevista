// src/services/userService.ts
export async function getUserProfile() {
  return {
    fullName: "Samuel Johnson",
    email: "samuel@example.com",
    monthlyBudget: 300000,
  };
}

export async function updateUserProfile(data: { fullName: string }) {
  console.log("Updating user profile:", data);
  return { success: true };
}
