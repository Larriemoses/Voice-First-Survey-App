export async function registerCompany(payload: {
  fullName: string;
  companyName: string;
  companySlug?: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    "http://localhost:4000/api/auth/register-company",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}
