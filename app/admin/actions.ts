"use server"

type UploadResult = {
  success: boolean
  message?: string
}

export async function uploadPhoto(email: string, orderNumber: string, filename: string): Promise<UploadResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock successful upload
  console.log("[v0] Mock upload:", { email, orderNumber, filename })

  return {
    success: true,
    message: "Foto vinculada ao pedido com sucesso!",
  }
}
