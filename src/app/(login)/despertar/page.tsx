"use client";

import { Particles } from "@/components/magicui/particles";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { validateLogin } from "@/lib/actions/auth";
import { Orb } from "@/components/login/Orb";
import Image from "next/image";

const Despertar = () => {
  const [value, setValue] = useState("");
  const [correctPass, setCorrectPass] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (formData: FormData) => {
    const pass = formData.get("senha")?.toString() || "";
    startTransition(async () => {
      const res = await validateLogin(pass);
      if (res.success) {
        setCorrectPass(true);
        setTimeout(() => {
          router.push("/");
        }, 5000);
      }
    });
  };

  return (
    <main className="flex items-center justify-center h-screen w-full bg-[#0f0a00]">
      <motion.div
        animate={isPending || correctPass ? { scale: 2 } : { scale: 1 }}
        transition={{
          duration: 1,
          repeat: 0,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="relative w-52 h-52 flex items-center justify-center"
        >
          <div className="z-0 w-32 h-32 shadow-[0_0_0_2px_#6e4400,0_0_0_8px_#AA8013,0_0_0_9px_#6e4400,0_0_0_12px_#ffbf00,0_0_0_14px_#6e4400,0_0_0_32px_#ffbf00,0_0_0_34px_#6e4400,0_0_0_38px_#ffbf00,0_0_0_40px_#6e4400,0_0_40px_20px_#fff8ea] rounded-full"></div>

          <svg
            viewBox="0 0 208 208"
            className="absolute w-full h-full z-10 pointer-events-none"
          >
            <defs>
              <path id="curve" d="M 24,104 A 80,80 0 0,1 184,104" fill="none" />
            </defs>
            <text fill="#6e4400" fontSize="20" letterSpacing="2">
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                {value || ""}
              </textPath>
            </text>
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            <Orb delay={0} />
            <Orb delay={1} />
            <Orb delay={2} />
          </div>
          {mounted && (
            <form
              action={handleSubmit}
              className="absolute top-0 left-0 right-0 h-1/3 z-20"
            >
              <input
                name="senha"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full h-full opacity-0 cursor-text"
              />
              <button type="submit" className="hidden" aria-hidden="true">
                submit
              </button>
            </form>
          )}

          <motion.div
            className="absolute inset-0"
            initial={{ rotate: 10 }}
            animate={correctPass ? { rotate: 0 } : { rotate: 10 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          >
            <Image fill src="/ring-1.svg" className="w-full h-full" alt={""} />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={{ rotate: -10 }}
            animate={correctPass ? { rotate: 0 } : { rotate: -10 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          >
            <Image fill src="/ring-2.svg" className="w-full h-full" alt={""} />
          </motion.div>
        </motion.div>
      </motion.div>

      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={"#f3f0ce"}
        refresh
      />
    </main>
  );
};

export default Despertar;
