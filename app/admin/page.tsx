"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadPhoto } from "./actions"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [email, setEmail] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await uploadPhoto(email, orderNumber, file?.name || "")

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: "Foto vinculada ao pedido com sucesso!",
      })

      // Reset form
      setEmail("")
      setOrderNumber("")
      setFile(null)
      setPreview(null)
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a foto.",
      })
    }

    setIsLoading(false)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-primary">Petloo Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">Faça upload das fotos dos produtos finalizados</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Upload de Foto da Prova</CardTitle>
            <CardDescription>Vincule a foto do produto final ao pedido do cliente</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  E-mail do Cliente *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* Order Number Input */}
              <div className="space-y-2">
                <Label htmlFor="orderNumber" className="text-base">
                  Número do Pedido
                  <span className="text-muted-foreground ml-1">(Opcional)</span>
                </Label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="PET-2025-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-base">Foto da Prova *</Label>

                {!preview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 hover:bg-accent/5 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                      disabled={isLoading}
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-base font-medium text-foreground mb-1">
                        Clique para fazer upload ou arraste a imagem
                      </p>
                      <p className="text-sm text-muted-foreground">PNG, JPG ou JPEG até 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain bg-muted"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearFile}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {file && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 text-sm">
                        {file.name}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Salvar e Notificar Cliente
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 border-dashed">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-2">Instruções:</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Certifique-se de que a foto está nítida e bem iluminada</li>
              <li>O e-mail deve ser o mesmo utilizado pelo cliente na compra</li>
              <li>Após salvar, o cliente receberá uma notificação por e-mail</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
