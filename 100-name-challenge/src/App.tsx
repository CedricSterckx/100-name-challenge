import { useEffect, useState } from "react";

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
  const [timerActive, setTimerActive] = useState(false);

  const endGameTreshold = 100;

  let intervalId = 1;


  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    setIsDucplicate(defaultIsDuplicate);
    if (inputNames.length >= endGameTreshold) {
      clearInterval(intervalId);
      return;
    }
    if (!input) {
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
    if (timerActive) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timerActive]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!timerActive) {
      setTimerActive(true); // Start the timer when the user starts typing
    }
    setInput(e.target.value);
  }

  function formatTime() {
    const minutes = Math.floor(timeElapsed / 60);
    const remainingSeconds = timeElapsed % 60;

    return minutes > 0 ? `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}` : `${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <main className="min-h-screen  bg-[#D7C6FC] p-4 flex flex-col justify-between items-center">
      <section className="flex flex-col gap-2">
        <p className={`font-bold transition duration-1000 ${inputNames.length >= endGameTreshold ? 'scale-[2]' : ''}`}>Time Elapsed: {formatTime()} seconds</p>
        <h1 className="text-xl">
          Your names:
        </h1>
        <ul className="max-h-[75vh] overflow-auto">
          {inputNames.map((name: string, index: number) => {
            return <li key={`key${name} ${index}`} className={`${isDuplicate.index === index ? 'text-red-500 animate-shake' : ''} `}>
              {index + 1}) {name}
            </li>;
          })}
        </ul>
      </section >
      <section>
        {inputNames.length < endGameTreshold ? (
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
          <div>
            <span className="font-bold"> Goodjob - game is done !</span>
          </div>
        )}
      </section>

    </main >
  );
}