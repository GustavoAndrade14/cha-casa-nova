"use client";

import Image from "next/image";
import { Gift, MapPin, Calendar, Heart, ShoppingBag, ExternalLink, QrCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6">
          Chá de Casa Nova
        </h1>
        <div className="flex justify-center items-center gap-4 text-2xl md:text-3xl text-yellow-400 mb-16">
          <span>Gustavo</span>
          <Heart className="text-yellow-400 w-8 h-8" />
          <span>Mirela</span>
        </div>

        {/* Profile Images */}
        <div className="flex justify-center items-center gap-8 md:gap-16 mb-16">
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800 flex items-center justify-center">
              <Image src="/mesmo.png" alt="Gustavo" width={800} height={800} />
            </div>
            <p className="text-center mt-3 text-yellow-400 font-semibold">Gustavo</p>
          </div>
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg shadow-yellow-400/20 bg-gray-800 flex items-center justify-center">
              <Image src="/mesma.png" alt="Mirela" width={800} height={800} />
            </div>
            <p className="text-center mt-3 text-yellow-400 font-semibold">Mirela</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-black/50 border-yellow-400/30 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
              Sobre o Chá
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Estamos muito felizes em anunciar que vamos morar juntos! 🏠✨<br />
              Para celebrar esse novo capítulo em nossas vidas, convidamos você
              para nosso Chá de Casa Nova. Sua presença e carinho já são
              presentes especiais, mas se quiser nos ajudar a construir nosso
              lar, selecionamos alguns itens que serão muito bem-vindos.
              <br /><br />
              <span className="text-yellow-400">
                “Com a sabedoria se edifica a casa, e com a inteligência ela se firma!” - Provérbios 24:3
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Important Information */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Informações Importantes
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-black/50 border-yellow-400/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Calendar className="text-yellow-400 w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                    Data e Horário
                  </h3>
                  <p className="text-gray-300">dia de mes de ano</p>
                  <p className="text-gray-300">hora - hora</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-yellow-400/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-yellow-400 w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                    Local
                  </h3>
                  <p className="text-gray-300">Rua, numero - complemento</p>
                  <p className="text-gray-300">Fortaleza - CE, CEP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-yellow-400/10 to-transparent border-yellow-400/30">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
              Como Usar o Site
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <p className="text-gray-300">
                  Navegue pelos nossos itens desejados na lista abaixo onde estão os itens que selecionamos para nosso lar. Cada item tem um link de compra para facilitar a aquisição.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <p className="text-gray-300">
                  Clique no botão Comprar para ser redirecionado à loja onde o item está disponível para compra. Após comprar o item, não esqueça de marcar como comprado para que possamos atualizar nossa lista e evitar compras duplicadas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <p className="text-gray-300">
                  Caso não queira comprar o item, mas queira ajudar dando o valor de algum item, clique no botão Pix para fazer uma doação via Pix. O valor arrecadado será utilizado
                  para comprar os itens da lista.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Nossos Itens Desejados
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {giftItems
            .map((item, index) => (
              <GiftCard key={index} {...item} />
            ))}
        </div>

        {giftItems.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Nenhum item encontrado nesta categoria.
          </div>
        )}
      </div>

      {/* Couple Photos Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Nossos Momentos Juntos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative group overflow-hidden rounded-lg border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 bg-gray-800 h-64 flex items-center justify-center">
            <Image
              src="/foto8.png"
              alt="Nós"
              width={400}
              height={400}
              suppressHydrationWarning
            />
          </div>
          <div className="relative group overflow-hidden rounded-lg border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 bg-gray-800 h-64 flex items-center justify-center">
            <Image
              src="/foto3.png"
              alt="natal"
              width={400}
              height={400}
              suppressHydrationWarning
            />
          </div>
          <div className="relative group overflow-hidden rounded-lg border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 bg-gray-800 h-64 flex items-center justify-center">
            <Image
              src="/foto5.png"
              alt="Pedido de namoro"
              width={400}
              height={400}
              suppressHydrationWarning
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-yellow-400/30 mt-12">
        <p className="text-gray-400">
          © 2026 Chá de Casa Nova - Gustavo & Mirela. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

function GiftCard({
  name,
  price,
  image,
  link,
  pixKey,
}: {
  name: string;
  price: string;
  image: string;
  link: string;
  pixKey: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [showPixDialog, setShowPixDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBuyClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handlePixClick = () => {
    setShowPixDialog(true);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card className="bg-black/50 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20">
        <CardContent className="p-4">
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
            {!imageError ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-4"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-yellow-400">
                <Gift className="w-12 h-12 mb-2" />
                <span className="text-sm text-center px-4">Imagem não disponível</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2 line-clamp-2">{name}</h3>
          <p className="text-gray-300 font-bold mb-4">{price}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleBuyClick}
              className="flex-1 h-14 sm:h-20 bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300 gap-2 cursor-pointer text-base sm:text-sm font-semibold rounded-xl shadow-lg shadow-yellow-500/20 active:scale-[0.98] py-4 sm:py-0"
            >
              <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />
              Comprar
              <ExternalLink className="w-4 h-4 sm:w-3 sm:h-3" />
            </Button>

            <Button
              onClick={handlePixClick}
              className="flex-1 h-14 sm:h-20 bg-green-600 text-white hover:bg-green-700 transition-all duration-300 gap-2 cursor-pointer text-base sm:text-sm font-semibold rounded-xl shadow-lg shadow-green-500/20 active:scale-[0.98] py-4 sm:py-0"
            >
              <QrCode className="w-5 h-5 sm:w-4 sm:h-4" />
              Pix
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showPixDialog} onOpenChange={setShowPixDialog}>
        <AlertDialogContent className="bg-gray-900 border-yellow-400/30 text-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              Doação via Pix
            </AlertDialogTitle>
            <div className="text-gray-300 space-y-4">
              <div className="mt-4 space-y-3">
                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Item:</div>
                  <div className="text-white font-semibold">{name}</div>
                </div>

                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Valor sugerido:</div>
                  <div className="text-yellow-400 text-2xl font-bold">{price}</div>
                </div>

                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-medium">
                      Chave PIX
                    </span>
                  </div>

                  <Button
                    onClick={copyPixKey}
                    variant="outline"
                    className={`
      w-full justify-between items-center
      bg-black/60 hover:bg-black/80
      border-white/10 hover:border-yellow-400/40
      text-white rounded-xl h-auto p-3
      transition-all duration-300 cursor-pointer
    `}
                  >
                    <code className="flex-1 text-left text-yellow-400 text-sm break-all font-mono pr-3">
                      {pixKey}
                    </code>

                    <div className="flex items-center gap-2 shrink-0">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">
                            Copiado
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-300" />
                          <span className="text-sm text-gray-300">
                            Copiar
                          </span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
                  <div className="text-yellow-400 text-sm font-semibold mb-1">📋 Como doar:</div>
                  <ol className="text-gray-300 text-xs space-y-1 list-decimal list-inside">
                    <li>Copie a chave PIX acima</li>
                    <li>Abra o app do seu banco</li>
                    <li>Escolha a opção Pagar com Pix</li>
                    <li>Cole a chave PIX e o valor sugerido</li>
                    <li>Confirme o pagamento</li>
                  </ol>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:text-white">
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog >
    </>
  );
}

// Gift Items Data - Substitua as chaves PIX pelos dados reais de vocês
const giftItems = [
  {
    name: "Fogão Atlas 4 Bocas preto Mônaco Top Glass com Acendimento automático - Bivolt",
    price: "R$ 900,00",
    image: "/images/fogao.png",
    link: "https://www.amazon.com.br/Atlas-M%C3%B4naco-Top-Glass-Acendimento/dp/B089WKK8N7/ref=sr_1_1",
    pixKey: "634.915.073-24", // 👈 Coloque o CPF, email ou telefone de vocês
  },
  {
    name: "Geladeira Electrolux Frost Free Inverter 322L",
    price: "R$ 3.900,00",
    image: "/images/geladeira.png",
    link: "https://www.casasbahia.com.br/geladeira-electrolux-frost-free-inverter-322l-ib42g-efficient-com-autosense-inverse-e-painel-digital-black-glass/p/55067564",
    pixKey: "634.915.073-24",
  },
  {
    name: "Máquina De Lavar 14kg Philco Preto 12 Programas 220v",
    price: "R$ 1.900,00",
    image: "/images/maquina.png",
    link: "https://www.mercadolivre.com.br/maquina-de-lavar-14kg-philco-preto-12-programas-220v/up/MLBU2708270231",
    pixKey: "634.915.073-24",
  },
  {
    name: "Micro-ondas Electrolux 23L Preto",
    price: "R$ 700,00",
    image: "/images/microondas.png",
    link: "https://www.amazon.com.br/dp/B0B8LCYYX7",
    pixKey: "634.915.073-24",
  },
  {
    name: "Britânia Sanduicheira e Grill Press 127V",
    price: "R$ 110,00",
    image: "/images/sanduicheira.png",
    link: "https://www.amazon.com.br/Brit%C3%A2nia-SANDUICHEIRA-GRILL-PRESS-BGR27I/dp/B09WWY48B7",
    pixKey: "634.915.073-24",
  }
];