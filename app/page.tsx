"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, CheckCircle, AlertCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { searchOrder } from "@/app/actions"

type OrderStatus = "idle" | "loading" | "not-found" | "in-production" | "ready"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<OrderStatus>("idle")
  const [orderData, setOrderData] = useState<any>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    const result = await searchOrder(email)

    setStatus(result.status)
    setOrderData(result.data)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary text-center">Petloo</h1>
          <p className="text-center text-muted-foreground mt-1 text-sm">Canecas personalizadas com amor</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-foreground">Acompanhe sua Looneca</CardTitle>
            <CardDescription className="text-base">
              Digite o e-mail utilizado na compra para consultar o status do seu pedido
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Search Form */}
            {(status === "idle" || status === "loading") && (
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                    disabled={status === "loading"}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Buscando pedido...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Buscar Pedido
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Not Found State */}
            {status === "not-found" && (
              <div className="text-center space-y-4 py-6">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Pedido não encontrado</h3>
                  <p className="text-muted-foreground">
                    Não encontramos nenhum pedido com este e-mail. Verifique se digitou corretamente.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setStatus("idle")
                    setEmail("")
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* In Production State */}
            {status === "in-production" && (
              <div className="text-center space-y-4 py-6">
                <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-accent-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Encontramos seu pedido!</h3>
                  <div className="bg-accent/20 rounded-lg p-4 space-y-1">
                    <p className="font-medium text-foreground">Status: Em Produção</p>
                    <p className="text-sm text-muted-foreground">Pedido #{orderData?.orderNumber}</p>
                  </div>
                  <p className="text-muted-foreground pt-2">
                    Nossos artistas ainda estão esculpindo sua peça com muito carinho. Volte em breve para ver o
                    resultado final!
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setStatus("idle")
                    setEmail("")
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Buscar outro pedido
                </Button>
              </div>
            )}

            {/* Ready State */}
            {status === "ready" && (
              <div className="text-center space-y-4 py-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Sua Looneca ficou pronta!</h3>
                  <div className="bg-primary/5 rounded-lg p-4 space-y-1">
                    <p className="font-medium text-foreground">Status: Pronta para envio</p>
                    <p className="text-sm text-muted-foreground">Pedido #{orderData?.orderNumber}</p>
                  </div>
                </div>

                {/* Product Image */}
                <div className="my-6 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg">
                  <img
                    src={orderData?.imageUrl || "/placeholder.svg?height=400&width=400&query=custom pet mug ceramic"}
                    alt="Sua Looneca personalizada"
                    className="w-full h-auto"
                  />
                </div>

                <p className="text-muted-foreground">
                  Sua caneca foi finalizada com sucesso! Em breve você receberá um e-mail com informações sobre o envio.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = orderData?.imageUrl || "/custom-pet-mug.jpg"
                      link.download = `looneca-${orderData?.orderNumber}.jpg`
                      link.click()
                    }}
                    className="flex-1"
                  >
                    Baixar Foto
                  </Button>
                  <Button
                    onClick={() => {
                      setStatus("idle")
                      setEmail("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Buscar outro pedido
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Instructions */}
        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Teste o sistema</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>erro@teste.com</strong> - Pedido não encontrado
            </p>
            <p>
              <strong>producao@teste.com</strong> - Em produção
            </p>
            <p>
              <strong>pronto@teste.com</strong> - Pronto para baixar
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Petloo. Feito com amor para seu pet.</p>
        </div>
      </footer>
    </div>
  )
}
