"use client";

import { useEffect, useState } from "react";
import Vara from "vara";
import { motion, AnimatePresence } from "motion/react";
import { acceptContract } from "@/lib/actions/accept-contract";

function VaraText({ text }: { text: string }) {
  useEffect(() => {
    const container = document.getElementById("vara-container");
    if (!container) return;

    container.innerHTML = "";

    new Vara(
      "#vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/refs/heads/master/fonts/Parisienne/Parisienne.json",
      [
        {
          text: text,
          fontSize: 32,
          strokeWidth: 0.7,
          textAlign: "center",
        },
      ]
    );

    return () => {
      container.innerHTML = "";
    };
  }, [text]);

  return (
    <div id="vara-container" className="w-full z-[20] absolute -top-0.5"></div>
  );
}

const ContractModal = () => {
  const [visible, setVisible] = useState(true);
  const [signed, setSigned] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleAccept = async () => {
    setSigned(true);

    setTimeout(async () => {
      const res = await acceptContract();
      if (res.success) {
        setIsClosing(true);
        setTimeout(() => setVisible(false), 1000);
      }
    }, 3000);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          animate={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative w-[90%] max-w-lg aspect-[3/4]"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex absolute left-0 top-0 w-full h-full">
              <div className="h-full w-[42px] bg-repeat-y bg-left bg-[url('/contract-border.svg')]" />
              <div
                className={`font-[Shadows_Into_Light] relative h-full flex flex-col gap-18 w-full bg-repeat-y bg-right bg-white rounded-[0_20px_20px_0] p-6 overflow-hidden`}
              >
                <div className="w-full px-6 absolute inset-0 z-0">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 w-full h-px bg-gray-200 opacity-50"
                      style={{ top: `${(i + 1) * 24}px` }}
                    />
                  ))}
                </div>

                <p className="relative text-[#3d3d3d] z-10 pt-[5px] leading-6">
                  <b>Contrato do Refúgio</b>
                  <br />
                  <br />
                  Este Refúgio foi criado com carinho para guardar nossas
                  memórias, afetos e momentos únicos.
                  <br />
                  Cada detalhe tem um significado.
                  <br />
                  <br />
                  <b>
                    Atente-se a cada um deles — foi feito com muito carinho.
                  </b>
                  <br />
                  <br />
                  <i>
                    “O Nen que protege este lugar enfraquece com a ausência.
                    Visite ao menos uma vez por semana, ou ele poderá se
                    dissipar.”
                  </i>
                </p>

                <button
                  onClick={handleAccept}
                  className="flex flex-col items-center cursor-pointer relative z-10 text-[#3d3d3d] hover:text-[#b3b3b3]"
                >
                  {signed && <VaraText text="Juliana Alice" />}
                  <span className="underline">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Juliana Alice
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContractModal;
