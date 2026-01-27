// components/BirthdayCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import type { Variants } from 'framer-motion';

// Constants moved outside component
const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
const BALLOON_POSITIONS = [10, 25, 75, 90];
const BOTTOM_EMOJIS = ['🎂', '🎁', '🎈', '🎊', '🎉'];

// Variants defined outside component to prevent recreation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 10 }
  }
};

const letterVariants: Variants = {
  hidden: { y: -50, opacity: 0, rotate: -10 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 10, delay: i * 0.05 }
  })
};

// Memoized sub-components
const ConfettiPiece = memo(({ delay, x, color }: { delay: number; x: number; color: string }) => (
  <motion.div
    className="absolute w-3 h-3 rounded-sm pointer-events-none"
    style={{ backgroundColor: color, left: `${x}%`, top: -20 }}
    initial={{ y: -20, rotate: 0, opacity: 1 }}
    animate={{ y: '100vh', rotate: 720, opacity: [1, 1, 0] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'linear' }}
  />
));
ConfettiPiece.displayName = 'ConfettiPiece';

const Balloon = memo(({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute text-5xl md:text-6xl pointer-events-none"
    style={{ left: `${x}%`, bottom: -60 }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: '-120vh', opacity: [0, 1, 1, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeOut' }}
  >
    🎈
  </motion.div>
));
Balloon.displayName = 'Balloon';

const Sparkle = memo(({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute text-2xl md:text-3xl pointer-events-none"
    style={style}
    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    ✨
  </motion.div>
));
Sparkle.displayName = 'Sparkle';

// Celebration burst confetti
const BurstConfetti = memo(({ id, onComplete }: { id: number; onComplete: () => void }) => {
  const pieces = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      angle: (i / 50) * 360,
      distance: 100 + Math.random() * 200,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 8 + Math.random() * 8
    })), []
  );

  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {pieces.map((piece) => (
        <motion.div
          key={`${id}-${piece.id}`}
          className="absolute rounded-full"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((piece.angle * Math.PI) / 180) * piece.distance,
            y: Math.sin((piece.angle * Math.PI) / 180) * piece.distance + 100,
            scale: [0, 1.5, 1],
            opacity: [1, 1, 0],
            rotate: Math.random() * 720
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
});
BurstConfetti.displayName = 'BurstConfetti';

// Animated text component
const AnimatedText = memo(({ text, className }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        custom={i}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
        whileHover={{ scale: 1.3, color: '#FFD700' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </span>
));
AnimatedText.displayName = 'AnimatedText';

export default function BirthdayCard() {
  const [imageError, setImageError] = useState(false);
  const [celebrations, setCelebrations] = useState<number[]>([]);
  const [celebrationCount, setCelebrationCount] = useState(0);

  // Memoize confetti pieces
  const confettiPieces = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    })), []
  );

  // Sparkle positions
  const sparklePositions = useMemo(() => [
    { top: '10%', left: '10%' },
    { top: '20%', right: '15%' },
    { bottom: '30%', left: '20%' },
    { bottom: '20%', right: '10%' }
  ], []);

  // Celebrate button handler
  const handleCelebrate = useCallback(() => {
    const newId = Date.now();
    setCelebrations(prev => [...prev, newId]);
    setCelebrationCount(prev => prev + 1);
  }, []);

  // Remove celebration burst after animation
  const removeCelebration = useCallback((id: number) => {
    setCelebrations(prev => prev.filter(c => c !== id));
  }, []);

  return (
    <div className="pt-16 min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Background pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} x={piece.x} color={piece.color} />
      ))}

      {/* Balloons */}
      {BALLOON_POSITIONS.map((x, i) => (
        <Balloon key={i} delay={i * 2} x={x} />
      ))}

      {/* Sparkles */}
      {sparklePositions.map((style, i) => (
        <Sparkle key={i} style={style} />
      ))}

      {/* Celebration bursts */}
      <AnimatePresence>
        {celebrations.map((id) => (
          <BurstConfetti key={id} id={id} onComplete={() => removeCelebration(id)} />
        ))}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Cake emoji */}
        <motion.div
          className="text-4xl md:text-6xl mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎂
        </motion.div>

        {/* Main card */}
        <motion.div
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 max-w-lg md:max-w-2xl w-full mx-auto"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Party emojis */}
          <motion.div className="flex justify-center gap-2 md:gap-4 text-2xl md:text-4xl mb-6" variants={itemVariants}>
            {['🎊', '🎁', '🎉'].map((emoji, i) => (
              <motion.span
                key={emoji}
                animate={i === 1 ? { scale: [1, 1.2, 1] } : { rotate: [i === 0 ? -10 : 10, i === 0 ? 10 : -10, i === 0 ? -10 : 10] }}
                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 md:mb-8 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.1, borderColor: '#FFD700', boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
          >
            {!imageError ? (
              <Image
                src="/images/ada.jpg"
                alt="Dusia"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center">
                <span className="text-4xl md:text-6xl">👤</span>
              </div>
            )}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-yellow-400 pointer-events-none"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Title - Split into two lines */}
          <motion.h1
            className="text-center text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
            variants={itemVariants}
          >
            <span className="h-20 block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              <AnimatedText text="Happy Birthday," />
            </span>
            <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mt-2">
              <AnimatedText text="Dusia!" />
            </span>
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-center text-gray-600 text-base md:text-xl mb-6 md:mb-8 px-4"
            variants={itemVariants}
          >
            Wishing you a day filled with love, laughter, and all the happiness in the world! 
            May this year bring you amazing adventures and beautiful memories! 💕
          </motion.p>

          {/* Divider */}
          <motion.div className="flex items-center justify-center gap-2 mb-6" variants={itemVariants}>
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
            <motion.span
              className="text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              🌟
            </motion.span>
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
          </motion.div>

          {/* Celebrate button */}
          <motion.button
            onClick={handleCelebrate}
            className="w-full py-3 md:py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 active:scale-95"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎈 Celebrate! 🎈
            {celebrationCount > 0 && (
              <motion.span
                className="ml-2 inline-flex items-center justify-center bg-white/20 rounded-full px-2 py-0.5 text-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={celebrationCount}
              >
                x{celebrationCount}
              </motion.span>
            )}
          </motion.button>

          {/* Bottom emojis */}
          <motion.div className="flex justify-center gap-1 md:gap-2 mt-6 text-xl md:text-3xl" variants={itemVariants}>
            {BOTTOM_EMOJIS.map((emoji, i) => (
              <motion.span
                key={emoji}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-6 md:mt-8 text-white/90 text-sm md:text-base text-center"
          variants={itemVariants}
        >
          Made with 💖 just for you, from James
        </motion.p>
      </motion.div>
    </div>
  );
}