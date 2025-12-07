
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export function Hero(){
 return (
  <div className='flex flex-col items-center justify-center py-28 px-6 text-center'>
   <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
    className='text-5xl font-bold text-slate-900'>ExcelWizPro MTM‑8</motion.h1>
   <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:1}}
    className='mt-6 max-w-2xl text-lg text-slate-600'>
    The world's most advanced multi‑intent Excel reporting engine.
   </motion.p>
   <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}} className='mt-10'>
     <Link to='/app' className='px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition'>
       Launch MTM‑8
     </Link>
   </motion.div>
  </div>
 );
}
