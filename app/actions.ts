"use server"

type OrderResult = {
  status: "not-found" | "in-production" | "ready"
  data?: {
    orderNumber: string
    imageUrl?: string
  }
}

export async function searchOrder(email: string): Promise<OrderResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock logic based on email
  if (email === "erro@teste.com") {
    return { status: "not-found" }
  }

  if (email === "producao@teste.com") {
    return {
      status: "in-production",
      data: {
        orderNumber: "PET-2025-001",
      },
    }
  }

  if (email === "pronto@teste.com") {
    return {
      status: "ready",
      data: {
        orderNumber: "PET-2025-002",
        imageUrl: "/custom-ceramic-pet-mug-with-cute-dog-illustration.jpg",
      },
    }
  }

  return { status: "not-found" }
}
