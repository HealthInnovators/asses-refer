import { motion } from 'framer-motion';

export const Greeting = () => {
  return (
    <div
      key="greeting"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold mb-2"
      >
        Welcome to your AI Health Assistant!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-lg text-zinc-600 mb-4"
      >
        I can help you understand your symptoms, provide general health information, and suggest potential doctors or clinics. Please remember, I am an AI and cannot provide medical advice or diagnosis. Always consult a healthcare professional for medical concerns.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-zinc-500"
      >
        How are you feeling today? For example, you could tell me:
        <ul className='list-disc list-inside mt-2 text-zinc-600'>
          <li>&quot;I have a headache and a sore throat.&quot;</li>
          <li>&quot;I&apos;ve had a cough for three days.&quot;</li>
          <li>&quot;Can you help me find a general practitioner in Springfield, IL?&quot;</li>
        </ul>
      </motion.div>
    </div>
  );
}; 

