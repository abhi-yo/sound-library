'use client';
import { DragHandle, SwapyItem, SwapyLayout, SwapySlot } from '@/components/ui/swapy';
import { Heart, PlusCircle, AudioWaveform, Zap, Volume2, Cpu } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { type SlotItemMapArray, utils } from 'swapy';
import { Blobatar } from '@blobatar/react';
import 'blobatar/motion.css';

export function SoundCountCard() {
  return (
    <div className='bg-emerald-600 rounded-xl h-full p-4 sm:p-6 flex flex-col justify-center items-center text-center shadow-md'>
      <div className='flex gap-2 items-center'>
        <h2 className='text-yellow-200 text-3xl sm:text-4xl 2xl:text-5xl font-bold mb-1'>20+</h2>
        <div className='text-yellow-200 flex items-center gap-1'>
          <span className='text-lg sm:text-xl'>
            <Heart className='fill-yellow-200 size-5 sm:size-6' />
          </span>
        </div>
      </div>
      <p className='text-yellow-200 font-medium text-sm sm:text-base'>Unique Sounds</p>
      <p className='text-yellow-200/80 text-xs sm:text-sm'>and growing</p>
    </div>
  );
}

export function ZeroDepsCard() {
  return (
    <div className='bg-neutral-600 rounded-xl h-full p-4 sm:p-6 flex flex-col justify-center shadow-md'>
      <p className='text-yellow-200 mb-1 font-medium text-xs sm:text-sm'>Dependencies</p>
      <h2 className='text-yellow-200 text-3xl sm:text-5xl 2xl:text-6xl font-bold leading-none'>0</h2>
      <p className='text-green-400 font-medium mt-2 text-xs sm:text-sm'>+ Zero overhead</p>
    </div>
  );
}

export function WebAudioCard() {
  return (
    <div className='bg-blue-100 rounded-xl p-4 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden shadow-md'>
      <div className='bg-blue-300 text-black font-medium px-3 py-1 sm:px-4 sm:py-2 rounded-xl inline-block mb-3 max-w-fit text-xs sm:text-sm'>
        Powered by native Web Audio API
      </div>
      <div>
        <p className='font-bold text-neutral-900 text-sm sm:text-base'>Browser-Native Synthesis</p>
        <div className='flex items-end gap-2 mt-1'>
          <span className='font-bold text-neutral-900'>
            <Cpu className='size-8 sm:size-12' />
          </span>
          <span className='text-green-600 font-medium mb-0.5 text-xs sm:text-sm'>No plugins</span>
        </div>
      </div>
    </div>
  );
}

export function ProceduralCard() {
  return (
    <div className='bg-purple-300 rounded-xl h-full p-4 sm:p-5 relative overflow-hidden shadow-md flex flex-col justify-between'>
      <div className='bg-neutral-900 text-yellow-200 text-sm sm:text-base font-medium px-3 py-2 rounded-lg inline-block w-full'>
        <p>Procedural Audio</p>
        <p className="text-xs text-yellow-200/80">Synthesis Engine</p>
      </div>
      <div className='flex gap-2 h-14 sm:h-16 mt-2'>
        <div className='w-full rounded-xl bg-purple-400 overflow-hidden flex items-center justify-center'>
          <AudioWaveform className='text-purple-900 size-6 sm:size-8' />
        </div>
        <div className='w-full rounded-xl bg-yellow-200 overflow-hidden ml-2 sm:ml-4 flex items-center justify-center'>
          <Zap className='text-amber-700 size-6 sm:size-8' />
        </div>
      </div>
    </div>
  );
}

export function LogoCard() {
  return (
    <div className='bg-pink-200 rounded-xl h-full p-4 sm:p-6 flex flex-col items-center justify-center shadow-md'>
      <div className='w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3 flex items-center justify-center'>
        <Blobatar
          name="alain00"
          traits={{ shape: 0.825 }}
          animate="always"
          size={70}
        />
      </div>
      <h2 className='2xl:text-3xl text-lg sm:text-xl font-bold text-neutral-900'>Sound Library</h2>
    </div>
  );
}

export function TrustedByCard() {
  return (
    <div className='bg-blue-600 rounded-xl h-full p-4 sm:p-5 flex flex-col justify-center items-center text-white shadow-lg text-center'>
      <h3 className='text-lg sm:text-2xl font-bold mb-1 sm:mb-2'>Trusted By</h3>
      <p className='text-xl sm:text-3xl font-bold mb-3 sm:mb-4'>Developers</p>

      <div className='flex -space-x-2 mb-3'>
        <div className='size-8 sm:size-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-blue-400'></div>
        <div className='size-8 sm:size-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-blue-300'></div>
        <div className='size-8 sm:size-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-blue-200'></div>
        <div className='size-8 sm:size-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-blue-100'></div>
        <div className='size-8 sm:size-10 rounded-xl bg-yellow-400 border-2 border-blue-600 flex items-center justify-center'>
          <PlusCircle className='size-4 sm:size-5 text-white' />
        </div>
      </div>

      <p className='text-xs sm:text-sm text-blue-100'>MIT Licensed · Open Source</p>
    </div>
  );
}

export function FontCard() {
  return (
    <div className='bg-yellow-200 rounded-xl h-full p-4 sm:p-6 col-span-1 shadow-md flex flex-col justify-between'>
      <div>
        <h2 className='text-2xl sm:text-3xl font-bold mb-0.5 text-neutral-900'>Sounds</h2>
        <p className='text-xs sm:text-sm text-neutral-600'>Click · Toggle · Pop</p>
      </div>

      <div className='flex gap-2 sm:gap-3 mt-3'>
        <div className='size-9 sm:size-12 bg-neutral-800 rounded-md flex items-center justify-center shadow-xs'>
          <Volume2 className='text-white size-4 sm:size-5' />
        </div>
        <div className='size-9 sm:size-12 bg-neutral-400 rounded-md shadow-xs'></div>
        <div className='size-9 sm:size-12 bg-red-400 rounded-md shadow-xs'></div>
        <div className='size-9 sm:size-12 bg-pink-300 rounded-md shadow-xs'></div>
      </div>
    </div>
  );
}

export function FutureOfAudioCard() {
  return (
    <div className='bg-emerald-600 text-yellow-200 rounded-xl h-full p-4 sm:p-6 flex flex-col justify-between relative shadow-md'>
      <p className='text-lg sm:text-2xl font-bold'>We Build Future of</p>
      <p className='text-lg sm:text-2xl font-bold'>UI Sound Design</p>
    </div>
  );
}

export function InstallCard() {
  return (
    <div className='bg-yellow-200 rounded-xl h-full p-4 sm:p-6 shadow-lg flex flex-col justify-between'>
      <div>
        <h3 className='text-base sm:text-lg font-bold mb-1 text-neutral-900'>Get Started</h3>
        <h2 className='text-sm sm:text-base font-bold mb-3 text-neutral-900 font-mono'>npx copy & paste</h2>
      </div>

      <div className='bg-black text-white rounded-lg p-3 sm:p-4 shadow-xs font-mono text-xs sm:text-sm'>
        <div className='flex justify-between text-[10px] sm:text-xs mb-1.5 text-neutral-400'>
          <span>Terminal</span>
          <span>zsh</span>
        </div>
        <div className="truncate">
          <span className='text-green-400'>$</span> npm i sound-library
        </div>
      </div>
    </div>
  );
}

type Item = {
  id: string;
  title: string;
  widgets: React.ReactNode;
  className?: string;
};

const initialItems: Item[] = [
  {
    id: '1',
    title: '1',
    widgets: <SoundCountCard />,
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '2',
    title: '2',
    widgets: <ZeroDepsCard />,
    className: 'lg:col-span-3 sm:col-span-6 col-span-12',
  },
  {
    id: '3',
    title: '3',
    widgets: <FutureOfAudioCard />,
    className: 'lg:col-span-5 sm:col-span-6 col-span-12',
  },
  {
    id: '4',
    title: '4',
    widgets: <WebAudioCard />,
    className: 'lg:col-span-5 sm:col-span-6 col-span-12',
  },
  {
    id: '5',
    title: '5',
    widgets: <LogoCard />,
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '6',
    title: '6',
    widgets: <FontCard />,
    className: 'lg:col-span-3 sm:col-span-6 col-span-12',
  },
  {
    id: '7',
    title: '7',
    widgets: <ProceduralCard />,
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '8',
    title: '8',
    widgets: <TrustedByCard />,
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '9',
    title: '9',
    widgets: <InstallCard />,
    className: 'lg:col-span-4 sm:col-span-12 col-span-12',
  },
];

export default function BentoFeatures() {
  const [mounted, setMounted] = useState(false);
  const [slotItemMap] = useState<SlotItemMapArray>(() =>
    utils.initSlotItemMap(initialItems, 'id')
  );

  const slottedItems = useMemo(
    () => utils.toSlottedItems(initialItems, 'id', slotItemMap),
    [slotItemMap]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-12 sm:py-20 px-3 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className='grid w-full grid-cols-12 gap-3 sm:gap-6 py-4'>
            {initialItems.map((item) => (
              <div key={item.id} className={`rounded-xl min-h-[14rem] sm:min-h-[16rem] ${item.className}`}>
                {item.widgets}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SwapyLayout
          id='bento-features'
          className='w-full'
          config={{
            swapMode: 'hover',
          }}
          onSwap={(event: { newSlotItemMap: { asArray: SlotItemMapArray } }) => {
            // Swapy handles DOM swapping directly; avoid setting React state during drag
            console.log('Swap detected!', event.newSlotItemMap.asArray);
          }}
        >
          <div className='grid w-full grid-cols-12 gap-3 sm:gap-6 py-4'>
            {slottedItems.map(({ slotId, itemId }) => {
              const item = initialItems.find((i) => i.id === itemId);

              return (
                <SwapySlot
                  key={slotId}
                  className={`swapyItem rounded-xl min-h-[14rem] sm:min-h-[16rem] ${item?.className}`}
                  id={slotId}
                >
                  <SwapyItem
                    id={itemId!}
                    className='relative rounded-xl w-full h-full text-xs sm:text-sm'
                    key={itemId}
                  >
                    {item?.widgets}
                  </SwapyItem>
                </SwapySlot>
              );
            })}
          </div>
        </SwapyLayout>
      </div>
    </section>
  );
}
