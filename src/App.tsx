import { useEffect, useRef, useState } from "react";
import Rules from "./components/rules";

type duplicateType = {
  isDuplicate: boolean,
  index: number;
};

export default function App() {
  const defaultIsDuplicate: duplicateType = { index: -1, isDuplicate: false };

  const [inputNames, setInputNames] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [isDuplicate, setIsDucplicate] = useState<duplicateType>(defaultIsDuplicate);
  const [timeElapsed, setTimeElapsed] = useState(0);

  //@ts-ignore
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastItemRef = useRef(null);
  const ENDGAMETHRESHOLD = 100;

  useEffect(() => {
    if (inputNames.length >= ENDGAMETHRESHOLD && intervalIdRef.current) {
      clearInterval(intervalIdRef.current); // Stop the timer when the game ends
    }
  }, [inputNames.length, ENDGAMETHRESHOLD]);

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    setIsDucplicate(defaultIsDuplicate);
    if (inputNames.length >= ENDGAMETHRESHOLD) {
      return;
    }
    if (!input.trim()) {
      return;
    }
    if (e.key === 'Enter') {
      if (inputNames.includes(input)) {
        setInput('');
        const index = inputNames.findIndex(item => item === input);
        return setIsDucplicate({ index, isDuplicate: true });
      }
      setInputNames([...inputNames, input]);
      setInput('');
    }
  };

  useEffect(() => {
    if (lastItemRef.current) {
      (lastItemRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [inputNames]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!intervalIdRef.current) { // Start the timer on the first input
      intervalIdRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }
    setInput(e.target.value);
  }

  function formatTime() {
    const minutes = Math.floor(timeElapsed / 60);
    const remainingSeconds = timeElapsed % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}` : `${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function resetGame() {
    setInputNames([]);
    setInput('');
    setTimeElapsed(0);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  }

  return (
    <main>
      <section className="md:fixed md:left-8 md:top-1/2 md:-translate-y-1/2 md:w-[15rem] flex flex-col justify-center w-75vw] pl-8 bg-[#D7C6FC]">
        <Rules />
        <span className="md:hidden text-sm font-bold">Scroll to the bottom to start playing the game</span>
      </section>
      <div className="min-h-screen bg-[#D7C6FC] p-4 flex flex-col justify-between items-center">
        <section className="flex flex-col gap-2">
          <p className={`font-bold transition duration-1000 ${inputNames.length >= ENDGAMETHRESHOLD ? 'md:scale-[2]' : ''}`}>Time Elapsed: {formatTime()} seconds</p>
          <h1 className="text-xl">
            Your names:
          </h1>
          <ul className="md:max-h-[80vh] max-h-[75vh] overflow-auto">
            {inputNames.map((name: string, index: number) => {
              return <li
                ref={index === inputNames.length - 1 ? lastItemRef : null}
                key={`key${name} ${index}`} className={`${isDuplicate.index === index ? 'text-red-500 animate-shake' : ''} `}>
                {index + 1}) {name}
              </li>;
            })}
          </ul>
        </section >
        <section>
          {inputNames.length < ENDGAMETHRESHOLD ? (
            <div className="flex flex-col items-center">
              <input type="text" onChange={handleOnChange} value={input}
                onKeyUp={handleKeyUp} placeholder="Enter a name" className="p-2"
              />
              <span className="text-sm">Press enter to enter a name</span>
              <div className={`font-bold ${!isDuplicate.isDuplicate ? 'invisible' : ''}`}>
                Already present
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="font-bold"> Goodjob - game is done !</span>
              <button className="border p-2 bg-slate-200 border-sm shadow-md hover:shadow-xl" onClick={resetGame}>Reset game</button>
            </div>
          )}
        </section>
      </div>
    </main >
  );
}