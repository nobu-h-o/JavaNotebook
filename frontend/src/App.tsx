import React, { useState } from 'react';
// @ts-ignore: Missing type declarations for "@monaco-editor/react"
import Editor from "@monaco-editor/react";
import Navbar from './Components/Navbar.tsx';
import axios from 'axios';
import spinner from './assets/spinner.svg';

const App: React.FC = () => {
  // State variable to store the user's source code
  const defaultCode = `public class Main {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }`;
  const [userCode, setUserCode] = useState<string>(defaultCode);

  // State variable for the editor's language
  const [userLang, setUserLang] = useState<string>('java');

  // State variable for the editor's theme
  const [userTheme, setUserTheme] = useState<string>('vs-dark');

  // State variable for the editor's font size
  const [fontSize, setFontSize] = useState<number>(20);

  // State variable for the user's input
  const [userInput, setUserInput] = useState<string>('');

  // State variable for the output from the compile endpoint
  const [userOutput, setUserOutput] = useState<string>('');

  // Loading state variable to show spinner while fetching data
  const [loading, setLoading] = useState<boolean>(false);

  const options = { fontSize: fontSize };
  React.useEffect(() => {
    const handleResizeObserverErr = (event: ErrorEvent) => {
      if (event.message.includes('ResizeObserver loop completed')) {
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', handleResizeObserverErr);
    return () => window.removeEventListener('error', handleResizeObserverErr);
  }, []);
  
  // Function to call the compile endpoint
  const compile = (): void => {
    setLoading(true);
    if (userCode === '') {
      setLoading(false);
      return;
    }
    console.log(userCode);
    axios.post('http://localhost:8080/compile', {
        code: userCode,
        language: userLang,
        input: userInput,
      })
      .then((res) => {
        setUserOutput(res.data.stdout || res.data.stderr);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUserOutput(
          "Error: " +
            (err.response ? err.response.data.error : err.message)
        );
        setLoading(false);
      });
  };

  return (
    <div className="max-h-screen w-full overflow-y-hidden bg-[#474747]">
      {/* Navbar Container */}
      <div className="">
        <Navbar
          userLang={userLang}
          setUserLang={setUserLang}
          userTheme={userTheme}
          setUserTheme={setUserTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      </div>
      {/* Main Section */}
      <div className="flex h-[calc(100vh-50px)]">
        {/* Left Container with Run Button at the Top */}
        <div className="w-3/5 h-full flex flex-col">
          {/* Run Button Container */}
          <div className="flex justify-end p-2">
            <button
              onClick={compile}
              className="w-20 h-10 text-2xl font-bold bg-[#afec3f] rounded transition duration-300 cursor-pointer active:bg-[#6e9427]"
            >
              Run
            </button>
          </div>
          {/* Editor Container */}
          <div className="flex-grow relative">
          <Editor
            options={options}
            height="100%"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="java"
            defaultValue={`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello from JavaNotebook!");
  }
}`}
            onChange={(value) => setUserCode(value || '')}
          />

          </div>
        </div>
        {/* Right Container */}
        <div className="w-2/5 h-full flex flex-col bg-[#242424] border-l-2 border-l-[#1f65e6] p-1.5">
          <h4 className="text-[#afec3f]">Input:</h4>
          <div className="flex-1">
            <textarea
              id="code-inp"
              className="box-border w-full h-full resize-none bg-[#242424] text-[#f5f5f5] p-1.5 focus:outline-none text-base"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setUserInput(e.target.value)
              }
            />
          </div>
          <h4 className="text-[#afec3f]">Output:</h4>
          {loading ? (
            <div className="flex-1 bg-[#242424] overflow-y-auto flex justify-center items-center">
              <img src={spinner} alt="Loading..." className="w-52" />
            </div>
          ) : (
            <div className="flex-1 bg-[#242424] overflow-y-auto text-white relative">
              <pre className="text-sm whitespace-pre-wrap">{userOutput}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
