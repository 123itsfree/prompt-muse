import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { JournalPrompt } from '@/data/prompts';
import { motion } from 'framer-motion';

interface SpinWheelProps {
  prompts: JournalPrompt[];
  onSelect: (prompt: JournalPrompt) => void;
}

const SpinWheel = ({ prompts, onSelect }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);

  const segmentAngle = 360 / prompts.length;
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--primary) / 0.7)',
    'hsl(var(--secondary) / 0.7)',
    'hsl(var(--accent) / 0.7)',
  ];

  const handleSpin = () => {
    if (isSpinning || prompts.length === 0) return;

    setIsSpinning(true);
    
    // Random number of full rotations (5-10) plus random segment
    const randomSpins = 5 + Math.random() * 5;
    const randomSegment = Math.floor(Math.random() * prompts.length);
    const targetRotation = randomSpins * 360 + randomSegment * segmentAngle;
    
    setRotation(targetRotation);

    // After spin animation completes
    setTimeout(() => {
      const selectedIndex = prompts.length - 1 - randomSegment;
      const selected = prompts[selectedIndex];
      setSelectedPrompt(selected);
      setIsSpinning(false);
    }, 4000);
  };

  const handleUsePrompt = () => {
    if (selectedPrompt) {
      onSelect(selectedPrompt);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-muted-foreground mb-4">
          All prompts have been used! Great job!
        </p>
        <p className="text-muted-foreground">
          You can unmark prompts in the manual selection view to use them again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-accent drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full shadow-strong relative overflow-hidden"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 4,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
            {prompts.map((prompt, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              const color = colors[index % colors.length];
              
              // Convert to radians
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              // Calculate path
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              const largeArc = segmentAngle > 180 ? 1 : 0;
              
              // Calculate text position (middle of segment)
              const midAngle = startAngle + segmentAngle / 2;
              const midRad = (midAngle * Math.PI) / 180;
              const textRadius = 35; // Position text at 70% of radius
              const textX = 50 + textRadius * Math.cos(midRad);
              const textY = 50 + textRadius * Math.sin(midRad);
              
              // Truncate long titles
              const maxLength = segmentAngle > 30 ? 20 : 12;
              const displayTitle = prompt.title.length > maxLength 
                ? prompt.title.substring(0, maxLength - 3) + '...'
                : prompt.title;
              
              return (
                <g key={prompt.id}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="white"
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize={segmentAngle > 30 ? "3" : "2.5"}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                    }}
                  >
                    {displayTitle}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-background rounded-full border-4 border-white shadow-medium" />
        </motion.div>
      </div>

      {selectedPrompt && !isSpinning && (
        <div className="text-center space-y-4 animate-in fade-in duration-500">
          <h3 className="text-2xl font-bold text-primary">
            {selectedPrompt.title}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {selectedPrompt.text}
          </p>
          <Button onClick={handleUsePrompt} size="lg" className="mt-4">
            Use This Prompt
          </Button>
        </div>
      )}

      {!selectedPrompt && (
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          size="lg"
          className="min-w-[200px]"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
        </Button>
      )}
    </div>
  );
};

export default SpinWheel;
