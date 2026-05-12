"use client";

import Image from "next/image";
import { Gift, MapPin, Calendar, Heart, ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("todos");

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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <p className="text-gray-300">
                  Navegue pelos nossos itens desejados na lista abaixo
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <p className="text-gray-300">
                  Clique no botão Comprar para ser redirecionado à loja
                </p>
              </div>
              {/* <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <p className="text-gray-300">
                  Escolha o presente e nos presenteie com sua contribuição
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gift List Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Nossos Itens Desejados
        </h2>
        {/* Grid de itens */}
        <div className="grid md:grid-cols-3 gap-6">
          {giftItems
            .map((item, index) => (
              <GiftCard key={index} {...item} />
            ))}
        </div>

        {/* Mensagem se não houver itens */}
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
}: {
  name: string;
  price: string;
  image: string;
  link: string;
}) {
  const [imageError, setImageError] = useState(false);


  const handleBuyClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
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
        <Button
          onClick={handleBuyClick}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 transition-colors gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          Comprar
          <ExternalLink className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Gift Items Data com links de compra adicionados
const giftItems = [
  {
    name: "Fogão Atlas 4 Bocas preto Mônaco Top Glass com Acendimento automático - Bivolt",
    price: "R$ 900,00",
    image: "/images/fogao.png",
    link: "https://www.amazon.com.br/Atlas-M%C3%B4naco-Top-Glass-Acendimento/dp/B089WKK8N7/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2XR3Q8X6FPM83&dib=eyJ2IjoiMSJ9.NiwwT2ALMcdGrkaT0NMR7kZEm0KplB1cyT-s0ar4K3YaQ4XV5Rgi1lwXiT3HuGIqGQ6IRsc_Lne4nPUzFITxrLWitP_wJGXloY125W_wpobDk2ejZePAvDwBVSZq_DfU-cudk57_xqfm8qSARcnRqZZ5_q4_oUzwTPrkQTDPbYH2KXwsUzThsm3cQ5RlFyJB8_D2GV41ctSadKErrUp83tUTXAq8d2EaQT5IxmCmBgki6uciaTcZdOerJN8t7hx36eB4WCLNEGeiJLFw5Y_nYxWteiTZthqNjfZzrJ-s1Jo.lEAhp0VeB8WTuzpUQHPFXsur_7FVQQnrIiahOA5hCsk&dib_tag=se&keywords=Fog%C3%A3o+4+Bocas+Atlas+Atenas+Glass+com+Mesa+de+Vidro+e+Acendimento&qid=1778614496&sprefix=fog%C3%A3o+4+bocas+atlas+atenas+glass+com+mesa+de+vidro+e+acendimento%2Caps%2C226&sr=8-1&ufe=app_do%3Aamzn1.fos.95de73c3-5dda-43a7-bd1f-63af03b14751",
    priority: true,
  },
  {
    name: "Geladeira Electrolux Frost Free Inverter 322L",
    price: "R$ 3.900,00",
    image: "/images/geladeira.png",
    link: "https://www.casasbahia.com.br/geladeira-electrolux-frost-free-inverter-322l-ib42g-efficient-com-autosense-inverse-e-painel-digital-black-glass/p/55067564?utm_medium=Cpc&utm_source=GP_PLA&IdSku=55067564&idLojista=10037&tipoLojista=1P&gclsrc=aw.ds&&utm_campaign=cb_b2c_gg_shopping_core_eldo_refrigerador&gad_source=1&gad_campaignid=22440733097&gclid=Cj0KCQjwk_bPBhDXARIsACiq8R1XxZUBOaxmW35cg2H2Hb3l2fMMl_bXfgVZJ873xw8jhp5dKFMyOMsaAmo_EALw_wcB",
    priority: false,
  },
  {
    name: "Máquina De Lavar 14kg Philco Preto 12 Programas 220v",
    price: "R$ 1.900,00",
    image: "/images/maquina.png",
    link: "https://www.mercadolivre.com.br/maquina-de-lavar-14kg-philco-preto-12-programas-220v/up/MLBU2708270231?attributes=COLOR%3APreto_49cb43e_vpp%2CVOLTAGE%3A220V_177c66_vpp&pdp_filters=item_id%3AMLB3900918533&matt_tool=38524122#origin=share&sid=share&wid=MLB3900918533&action=copy",
    priority: false,
  },
  {
    name: "Micro-ondas Electrolux 23L Preto",
    price: "R$ 700,00",
    image: "/images/microondas.png",
    link: "https://www.amazon.com.br/dp/B0B8LCYYX7?ref=cm_sw_r_cso_cp_apin_dp_7XYP64TR6YN5HDC87H9X&ref_=cm_sw_r_cso_cp_apin_dp_7XYP64TR6YN5HDC87H9X&social_share=cm_sw_r_cso_cp_apin_dp_7XYP64TR6YN5HDC87H9X&th=1",
    priority: true,
  },
  {
    name: "Britânia Sanduicheira e Grill Press 127V",
    price: "R$ 110,00",
    image: "/images/sanduicheira.png",
    link: "https://www.amazon.com.br/Brit%C3%A2nia-SANDUICHEIRA-GRILL-PRESS-BGR27I/dp/B09WWY48B7/ref=mp_s_a_1_5?crid=32L4SKZ4FRZE1&dib=eyJ2IjoiMSJ9.r7TEi1_6CBOekdrAf7Wwfu7YZbDSbJly8Lg3ocJ8ypE2dlDT8us6zXfM__PS80zxh7PDDpFOuqXdZC_7Ea5jVsI0SDc7XXM2QerlNDNDW8SAMrdrmtS4a8-tG9Je9gKqPtrEUaNkyHXE34jz0PzkcvOU3N5OzISNiQw7OICl8hdsZ-oFOJRhS_YYEsIMO1luQ4Z-JnbL6kypGxEJAmcUug.A4t704dMyKBtB0yLHk9xtyqDWk--7-01aanwhejQ_oE&dib_tag=se&keywords=sanduicheira&qid=1777502988&sprefix=sabd%2Caps%2C244&sr=8-5&ufe=app_do%3Aamzn1.fos.6121c6c4-c969-43ae-92f7-cc248fc6181d&th=1",
    priority: true,
  }
];